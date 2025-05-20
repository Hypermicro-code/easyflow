import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);

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
      <h1>Anleggsliste</h1>
      <ul>
        {anlegg.map(a => (
          <li key={a.id} style={{ marginBottom: '20px' }}>
            <strong>{a.navn}</strong> – Status: {a.status}<br />
            {a.bildeUrl && (
              <img
                src={a.bildeUrl}
                alt="Anleggsbilde"
                style={{ maxWidth: '200px', marginTop: '10px', cursor: 'pointer' }}
                onClick={() => setFullscreenBilde(a.bildeUrl)}
              />
            )}
          </li>
        ))}
      </ul>

      {/* Fullskjermvisning */}
      {fullscreenBilde && (
        <div
          onClick={() => setFullscreenBilde(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >
          <img
            src={fullscreenBilde}
            alt="Fullskjerm"
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          />
        </div>
      )}
    </div>
  );
}

export default Anlegg;
