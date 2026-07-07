import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
  } else {
    try {
      admin.initializeApp();
    } catch (e) {
      console.warn("Firebase Admin could not be initialized with default credentials.");
    }
  }
}

const db = admin.apps.length ? admin.firestore() : null;

export default async function handler(req, res) {
  // Read id from query params (which is mapped from vercel.json rewrite: ?id=:id)
  const { id } = req.query;

  if (!id) {
    return res.redirect("/");
  }

  if (!db) {
    console.error("Firestore database is not initialized.");
    return res.status(500).send("Internal Server Error: Database not initialized");
  }

  try {
    const docRef = db.collection("invitations").doc(id);
    const docSnap = await docRef.get();

    let title = "Մեր մեծ օրը - Հարսանեկան հրավեր";
    let description = "Սիրով հրավիրում ենք մասնակցել մեր տոնական արարողությանը:";
    let imageUrl = "https://devaura.site/social-preview.png"; // fallback

    if (docSnap.exists) {
      const data = docSnap.data();
      // Read dynamic values from invitation document
      title = data.title || `${data.sealInitials || "RL"} - Հարսանեկան Հրավեր`;
      description = data.description || "Սիրով հրավիրում ենք մասնակցել մեր տոնական արարողությանը:";
      
      // Try to find image in hero background mobile or desktop, or any field
      if (data.hero?.bgMobileUrl) {
        imageUrl = data.hero.bgMobileUrl;
      } else if (data.hero?.bgDesktopUrl) {
        imageUrl = data.hero.bgDesktopUrl;
      } else if (data.imageUrl) {
        imageUrl = data.imageUrl;
      }
    }

    // Generate response HTML with dynamic OG tags
    const html = `<!DOCTYPE html>
<html lang="hy">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO & Open Graph Meta Tags -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="https://${req.headers.host}/i/${id}" />
  <meta property="og:type" content="article" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Immediately redirect normal browsers to the React app route -->
  <script type="text/javascript">
    window.location.href = "/show-invitation?id=${id}";
  </script>
</head>
<body>
  <div style="font-family: sans-serif; text-align: center; padding: 50px; color: #2c3e35;">
    <h2>Բեռնվում է / Loading Invitation...</h2>
    <p>${title}</p>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error("SEO handler error:", error);
    return res.status(500).send("Internal Server Error");
  }
}
