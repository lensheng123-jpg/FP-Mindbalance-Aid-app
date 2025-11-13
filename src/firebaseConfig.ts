import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth" ;
import { getStorage } from "firebase/storage" ; // ADD THIS IMPORT


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ADD ERROR HANDLING HERE
const requiredEnvVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_APP_ID'];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

//Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log ( "Storage Bucket:" , import . meta . env . VITE_FIREBASE_STORAGE_BUCKET ) ; // Add this log


// Initialize Firestore with persistent cache
export const auth = getAuth ( app ) ;
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache() // offline persistence enabled
});
export const storage = getStorage ( app ) ;

export default app;
