// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Lim inn din egen Firebase-konfigurasjon her:
const firebaseConfig = {
  apiKey: "AIzaSyDhpNIsin6Bkvsl7DBhishGxz20cC4DPL4",
  authDomain: "easyflow-95b3e.firebaseapp.com",
  projectId: "easyflow-95b3e",
  storageBucket: "easyflow-95b3e.firebasestorage.app",
  messagingSenderId: "821871316593",
  appId: "1:821871316593:web:caaead49048be3b00f95d0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
// 📦 Eksporter tjenestene du bruker
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export { db, storage };
