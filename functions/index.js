const { setGlobalOptions } = require("firebase-functions");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Limit instance scaling to control costs
setGlobalOptions({ maxInstances: 10 });

/**
 * Cloud Function to publish an invitation using Coin Tokenomics.
 * Expects { invitationId } in request data.
 */
exports.publishInvitation = onCall(async (request) => {
  // 1. Verify the user is authenticated via request.auth
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Մուտքը վավերացված չէ: The function must be called while authenticated."
    );
  }

  const uid = request.auth.uid;
  const invitationId = request.data.invitationId;

  if (!invitationId) {
    throw new HttpsError(
      "invalid-argument",
      "Հրավերի ID-ն բացակայում է: The function must be called with a valid 'invitationId'."
    );
  }

  const userRef = db.collection("users").doc(uid);
  const invitationRef = db.collection("invitations").doc(invitationId);

  try {
    // 2. Use a Firestore Transaction to ensure atomic execution
    const result = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const invitationDoc = await transaction.get(invitationRef);

      if (!userDoc.exists) {
        throw new HttpsError(
          "not-found",
          "Օգտատիրոջ հաշիվը չի գտնվել: User profile document not found."
        );
      }
      if (!invitationDoc.exists) {
        throw new HttpsError(
          "not-found",
          "Հրավերը չի գտնվել: Invitation document not found."
        );
      }

      const userData = userDoc.data();
      const invitationData = invitationDoc.data();

      // 3. Verify the user owns the invitation
      if (invitationData.ownerId !== uid) {
        throw new HttpsError(
          "permission-denied",
          "Դուք չունեք այս հրավերը խմբագրելու իրավունք: You are not the owner of this invitation."
        );
      }

      // 4. Double-spend protection: check if already published
      if (invitationData.isPublished === true) {
        throw new HttpsError(
          "failed-precondition",
          "Հրավերն արդեն հրապարակված է: This invitation is already published."
        );
      }

      // 5. Check if the user has >= 100 coins
      const coins = userData.coins || 0;
      if (coins < 100) {
        throw new HttpsError(
          "failed-precondition",
          "Բավարար միավորներ չկան: Insufficient coins to publish this invitation."
        );
      }

      // Check if this is their first invitation published and they were referred
      const isFirstPublish = !userData.firstInvitationPublished;
      const referredBy = userData.referredBy;
      let finalDeduction = -100;
      let referralBonusApplied = false;

      if (isFirstPublish) {
        // Mark firstInvitationPublished as true
        transaction.update(userRef, {
          firstInvitationPublished: true
        });

        // If referred by someone, apply the +50 coins bonus to both!
        if (referredBy) {
          const referrerRef = db.collection("users").doc(referredBy);
          
          // Reward the referrer with +50 coins
          transaction.update(referrerRef, {
            coins: FieldValue.increment(50)
          });

          // Reward the referee (current user) with +50 coins
          // Net change to referee: -100 cost + 50 reward = -50 coins
          finalDeduction = -50;
          referralBonusApplied = true;
        }
      }

      // 6. Deduct coins atomically (normal: -100, referral bonus: -50)
      transaction.update(userRef, {
        coins: FieldValue.increment(finalDeduction)
      });

      // 7. Update the invitation settings
      transaction.update(invitationRef, {
        isPublished: true,
        publishedAt: FieldValue.serverTimestamp()
      });

      return { 
        success: true, 
        message: referralBonusApplied 
          ? "Հրավերը հրապարակվեց: Դուք և ձեզ հրավիրողը ստացաք +50 Coins նվեր: Published! You and your referrer received +50 Coins bonus."
          : "Հրավերը հաջողությամբ հրապարակվեց: Invitation successfully published.",
        newCoinsBalance: coins + finalDeduction,
        referralBonusApplied
      };
    });

    return result;
  } catch (error) {
    console.error("Publish transaction failed:", error);
    // If it's already a standard HttpsError, rethrow it
    if (error instanceof HttpsError) {
      throw error;
    }
    // Wrap other internal errors
    throw new HttpsError("internal", error.message || "Failed to publish invitation.");
  }
});

/**
 * Cloud Function to assign Super Admin claims.
 * Strictly verifies that the authenticated user's email is admin@har.com.
 */
exports.setupSuperAdmin = onCall(async (request) => {
  // 1. Verify the user is authenticated
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const email = request.auth.token.email;
  const uid = request.auth.uid;

  // 2. Strict email verification
  if (email !== "admin@har.com") {
    throw new HttpsError(
      "permission-denied",
      "Unauthorized: Only admin@har.com can run this setup."
    );
  }

  try {
    const authAdmin = getAuth();
    
    // 3. Set custom user claims { admin: true }
    await authAdmin.setCustomUserClaims(uid, { admin: true });

    // 4. Update the user's Firestore document
    const userRef = db.collection("users").doc(uid);
    await userRef.set({
      role: "super-admin"
    }, { merge: true });

    return { 
      success: true, 
      message: "Super Admin privileges assigned successfully. Please sign out and log back in to apply the changes." 
    };
  } catch (error) {
    console.error("Super Admin setup failed:", error);
    throw new HttpsError("internal", error.message || "Failed to set custom claims.");
  }
});

// Helper: Verify if user is an admin
function verifyAdminClaim(auth) {
  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "Մուտքը վավերացված չէ: The function must be called while authenticated."
    );
  }
  if (auth.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Հասանելիությունը մերժված է: Only super admins can call this function."
    );
  }
}

/**
 * Cloud Function to fetch all user profile documents.
 */
exports.getAllUsers = onCall(async (request) => {
  verifyAdminClaim(request.auth);

  try {
    const snapshot = await db.collection("users").get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new HttpsError("internal", error.message || "Failed to fetch users.");
  }
});

/**
 * Cloud Function to update a user's coin count.
 */
exports.updateUserCoins = onCall(async (request) => {
  verifyAdminClaim(request.auth);

  const { targetUid, coinAmount } = request.data;
  if (!targetUid || typeof coinAmount !== "number") {
    throw new HttpsError(
      "invalid-argument",
      "Missing targetUid or invalid coinAmount."
    );
  }

  try {
    const userRef = db.collection("users").doc(targetUid);
    await userRef.update({
      coins: FieldValue.increment(coinAmount)
    });
    return { success: true, message: `Successfully updated coins by ${coinAmount}.` };
  } catch (error) {
    console.error("Error updating user coins:", error);
    throw new HttpsError("internal", error.message || "Failed to update user coins.");
  }
});

/**
 * Cloud Function to delete a user account from Auth and Firestore.
 */
exports.deleteUserAccount = onCall(async (request) => {
  verifyAdminClaim(request.auth);

  const { targetUid } = request.data;
  if (!targetUid) {
    throw new HttpsError("invalid-argument", "Missing targetUid.");
  }

  try {
    // Delete from Firebase Authentication
    const authAdmin = getAuth();
    await authAdmin.deleteUser(targetUid);

    // Delete from Firestore users collection
    const userRef = db.collection("users").doc(targetUid);
    await userRef.delete();

    return { success: true, message: "User account successfully deleted." };
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw new HttpsError("internal", error.message || "Failed to delete user account.");
  }
});

/**
 * Cloud Function to delete an invitation document.
 */
exports.deletePlatformInvitation = onCall(async (request) => {
  verifyAdminClaim(request.auth);

  const { invitationId } = request.data;
  if (!invitationId) {
    throw new HttpsError("invalid-argument", "Missing invitationId.");
  }

  try {
    const invitationRef = db.collection("invitations").doc(invitationId);
    await invitationRef.delete();
    return { success: true, message: "Invitation successfully deleted." };
  } catch (error) {
    console.error("Error deleting invitation:", error);
    throw new HttpsError("internal", error.message || "Failed to delete invitation.");
  }
});
