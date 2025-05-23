// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [brukerdata, setBrukerdata] = useState(null);
  const [lastet, setLastet] = useState(false); // 👈 nytt flagg

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'brukere', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setBrukerdata(docSnap.data());
          } else {
            setBrukerdata({ rolle: 'ukjent' }); // fallback
          }
        } catch (e) {
          console.error('Feil ved henting av brukerdata:', e);
        }
      } else {
        setBrukerdata(null);
      }
      setLastet(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, brukerdata, lastet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
