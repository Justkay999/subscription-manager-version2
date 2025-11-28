import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Server-side Firebase Admin SDK initialization
function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        // For server-side, we can use the Web SDK config directly
        // since we're not using service account auth
        const app = initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
        });
        return app;
    }
    return getApps()[0];
}

const adminApp = initializeFirebaseAdmin();
const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);

export { adminApp, adminDb, adminAuth };
