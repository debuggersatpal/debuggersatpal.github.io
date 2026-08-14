import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// The configuration is loaded from Astro's environment variables.
// These PUBLIC_ variables are perfectly safe to expose to the browser,
// as security is enforced entirely by Firebase Security Rules.
const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
