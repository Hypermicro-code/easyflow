import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function OfflineKo() {
  const [meldinger, setMeldinger] = useState([]);
  const [anlegg, setAnlegg] = useState([]);

  const hentKøer = () => {
    const lagretMeldinger = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    const lagretAnlegg = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    setMeldinger(lagretMeldinger);
    setAnlegg(lagretAnlegg);
  };

  const synkMeldinger = async () => {
    if (meldinger.length === 0) {
      alert('Ingen meldinger i kø.');
      return;
    }

    for (let melding of meldinger) {
      try {
        await addDoc(collection(db, 'meldinger'), melding);
      } catch (error) {
        console.error('Feil ved synk av melding: ', error);
        alert('Feil ved synk av melding.');
        return;
      }
    }

    localStorage.removeItem('offlineMeldinger');
    hentKøer();
    alert('Alle meldinger synkronisert!');
  };

  const synkAnlegg = async () => {
    if (anlegg.length === 0) {
      alert('Ingen anlegg i kø.');
      return;
    }

    for (let a of anlegg) {
      try {
        await addDoc(collection(db, 'anlegg'), a);
      } catch (error) {
        console.error('Feil ved synk av anlegg: ', error);
        alert('Feil ved synk av anlegg.');
        return;
      }
    }

    localStorage.removeItem('offlineAnlegg');
    hentKøer();
    alert('Alle anlegg synkronisert!');
  };

  useEffect(() => {
    hentKøer();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Offline kø</h1>

      {/* Meldinger */}
      <h2>Meldinger ({meldinger.length})</h2>
      {meldinger.length > 0 ? (
        <>
          <ul>
            {meldinger.map((m, index) => (
              <li key={index}>
                <strong>Fra:</strong> {m.fra} <br />
                <strong>Tekst:</strong> {m.tekst}
              </li>
            ))}
          </ul>
          <button onClick={synkMeldinger}>Synkroniser meldinger</button>
        </>
      ) : (
        <p>Ingen meldinger i kø.</p>
      )}

      {/* Anlegg */}
      <h2>Anlegg ({anlegg.length})</h2>
      {anlegg.length > 0 ? (
        <>
          <ul>
            {anlegg.map((a, index) => (
              <li key={index}>
                <strong>Navn:</strong> {a.navn} <br />
                <strong>Status:</strong> {a.status}
              </li>
            ))}
          </ul>
          <button onClick={synkAnlegg}>Synkroniser anlegg</button>
        </>
      ) : (
        <p>Ingen anlegg i kø.</p>
      )}
    </div>
  );
}

export default OfflineKo;
