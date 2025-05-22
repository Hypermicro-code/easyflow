// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Lim inn din egen Firebase-konfigurasjon her:
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_API_KEY,
  storageBucket: "easyflow-95b3e.firebasestorage.app",
  messagingSenderId: "821871316593",
  appId: "1:821871316593:web:caaead49048be3b00f95d0"
};

const app = initializeApp(firebaseConfig);

// 📦 Eksporter tjenestene du bruker
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
