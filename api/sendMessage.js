// api/sendMessage.js
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!getApps().length) {
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

const db = getApps().length ? admin.firestore() : null;

export default async function handler(req, res) {
  // Թույլատրում ենք միայն POST հարցումներ
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, invitationId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Default credentials from environment variables
  let BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  let CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // If invitationId is provided and Firestore is initialized, fetch dynamic Telegram credentials
  if (invitationId && db) {
    try {
      const secretDoc = await db.collection("invitationSecrets").doc(invitationId).get();
      if (secretDoc.exists) {
        const data = secretDoc.data();
        if (data.telegramBotToken && data.telegramChatId) {
          BOT_TOKEN = data.telegramBotToken;
          CHAT_ID = data.telegramChatId;
        }
      }
    } catch (err) {
      console.error(`Error fetching secrets for invitation ${invitationId}:`, err);
    }
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Telegram credentials are not set.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const telegramResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      console.error('Telegram API error:', telegramResult);
      return res.status(500).json({ error: 'Failed to send message to Telegram.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending request to Telegram:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

