import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function OfflineKo() {
  const [meldinger, setMeldinger] = useState([]);

  const hentLokalKø = () => {
    const lagret = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    setMeldinger(lagret);
  };

  const synkroniserMeldinger = async () => {
    if (meldinger.length === 0) {
      alert('Ingen meldinger i kø.');
      return;
    }

    for (let melding of meldinger) {
      try {
        await addDoc(collection(db, 'meldinger'), melding);
      } catch (error) {
        console.error('Feil ved synkronisering: ', error);
        alert('Feil ved synkronisering.');
        return;
      }
    }

    localStorage.removeItem('offlineMeldinger');
    hentLokalKø();
    alert('Alle offline-meldinger er synkronisert!');
  };

  useEffect(() => {
    hentLokalKø();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Offline kø</h1>
      {meldinger.length > 0 ? (
        <>
          <p>Det ligger {meldinger.length} melding(er) klar for synkronisering:</p>
          <ul>
            {meldinger.map((m, index) => (
              <li key={index}>
                <strong>Fra:</strong> {m.fra} <br />
                <strong>Tekst:</strong> {m.tekst}
              </li>
            ))}
          </ul>
          <button onClick={synkroniserMeldinger}>Synkroniser nå</button>
        </>
      ) : (
        <p>Ingen meldinger i offline-kø.</p>
      )}
    </div>
  );
}

export default OfflineKo;
