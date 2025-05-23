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
    console.log("✅ Bruker logget inn:", currentUser?.uid); 
    if (currentUser) {
      try {
        const docRef = doc(db, 'brukere', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.rolle) {
            setBrukerdata(data);
          } else {
            console.warn('⚠️ Brukerdata mangler rolle, legger til default admin for testing');
            setBrukerdata({ rolle: 'admin' }); // kun midlertidig hvis du ønsker
          }
        } else {
          console.warn('⚠️ Brukerdokument ikke funnet i Firestore');
          setBrukerdata({ rolle: 'ukjent' });
        }
      } catch (e) {
        console.error('❌ Feil ved henting av brukerdata:', e);
        setBrukerdata({ rolle: 'ukjent' });
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
