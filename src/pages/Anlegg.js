import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);

  useEffect(() => {
    const fetchAnlegg = async () => {
      const anleggCol = collection(db, 'anlegg');
      const anleggSnapshot = await getDocs(anleggCol);
      const anleggList = anleggSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnlegg(anleggList);
    };

    fetchAnlegg();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Anleggsliste (fra Firebase)</h1>
      <ul>
        {anlegg.map(a => (
          <li key={a.id}>{a.navn} - Status: {a.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Anlegg;
