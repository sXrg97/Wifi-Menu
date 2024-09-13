import admin from 'firebase-admin';

export function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      if (!serviceAccountString) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables');
      }

      const serviceAccount = JSON.parse(serviceAccountString);

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw new Error('Failed to initialize Firebase Admin');
    }
  }

  return admin;
}

// Optionally, you can export commonly used services
export const firestore = admin.firestore;
export const auth = admin.auth;