import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function NyMelding() {
  const [fra, setFra] = useState('');
  const [tekst, setTekst] = useState('');
  const [offlineCount, setOfflineCount] = useState(0);

  const oppdaterOfflineTeller = () => {
    const lagret = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    setOfflineCount(lagret.length);
  };

  const syncOfflineMeldinger = async () => {
    const lagret = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    if (lagret.length > 0) {
      for (let melding of lagret) {
        try {
          await addDoc(collection(db, 'meldinger'), melding);
        } catch (error) {
          console.error('Feil ved synk av melding: ', error);
          return;
        }
      }
      localStorage.removeItem('offlineMeldinger');
      alert('Offline-meldinger ble synkronisert!');
      oppdaterOfflineTeller();
    }
  };

  useEffect(() => {
    oppdaterOfflineTeller();

    if (navigator.onLine) {
      syncOfflineMeldinger();
    }

    window.addEventListener('online', syncOfflineMeldinger);

    return () => {
      window.removeEventListener('online', syncOfflineMeldinger);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const melding = { fra, tekst };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'meldinger'), melding);
        alert('Melding lagret!');
      } catch (error) {
        console.error('Feil ved lagring av melding: ', error);
        alert('Kunne ikke lagre melding.');
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
      lagret.push(melding);
      localStorage.setItem('offlineMeldinger', JSON.stringify(lagret));
      alert('Ingen dekning. Melding lagret lokalt.');
      oppdaterOfflineTeller();
    }

    setFra('');
    setTekst('');
  };

  return (
    <div style={{ padding: '20px' }}>
      {offlineCount > 0 && (
        <div style={{ backgroundColor: 'yellow', padding: '10px', marginBottom: '10px' }}>
          🚨 {offlineCount} melding(er) venter på synkronisering!
        </div>
      )}
      <h1>Ny melding</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fra:</label><br />
          <input type='text' value={fra} onChange={(e) => setFra(e.target.value)} required />
        </div>
        <div>
          <label>Meldingstekst:</label><br />
          <textarea value={tekst} onChange={(e) => setTekst(e.target.value)} required />
        </div>
        <button type='submit'>Send melding</button>
      </form>
    </div>
  );
}

export default NyMelding;
