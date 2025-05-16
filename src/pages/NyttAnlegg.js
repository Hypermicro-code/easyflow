import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function NyttAnlegg() {
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');
  const [offlineCount, setOfflineCount] = useState(0);

  const oppdaterOfflineTeller = () => {
    const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    setOfflineCount(lagret.length);
  };

  const syncOfflineAnlegg = async () => {
    const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    if (lagret.length > 0) {
      for (let anlegg of lagret) {
        try {
          await addDoc(collection(db, 'anlegg'), anlegg);
        } catch (error) {
          console.error('Feil ved synk av anlegg: ', error);
          return;
        }
      }
      localStorage.removeItem('offlineAnlegg');
      alert('Offline-anlegg synkronisert!');
      oppdaterOfflineTeller();
    }
  };

  useEffect(() => {
    oppdaterOfflineTeller();

    if (navigator.onLine) {
      syncOfflineAnlegg();
    }

    window.addEventListener('online', syncOfflineAnlegg);

    return () => {
      window.removeEventListener('online', syncOfflineAnlegg);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const anlegg = { navn, status };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'anlegg'), anlegg);
        alert('Anlegg lagret!');
      } catch (error) {
        console.error('Feil ved lagring av anlegg: ', error);
        alert('Kunne ikke lagre anlegg.');
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
      lagret.push(anlegg);
      localStorage.setItem('offlineAnlegg', JSON.stringify(lagret));
      alert('Ingen dekning. Anlegg lagret lokalt.');
      oppdaterOfflineTeller();
    }

    setNavn('');
    setStatus('');
  };

  return (
    <div style={{ padding: '20px' }}>
      {offlineCount > 0 && (
        <div style={{ backgroundColor: 'orange', padding: '10px', marginBottom: '10px' }}>
          🚨 {offlineCount} anlegg(er) venter på synkronisering!
        </div>
      )}
      <h1>Nytt anlegg</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Anleggsnavn:</label><br />
          <input type='text' value={navn} onChange={(e) => setNavn(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label><br />
          <input type='text' value={status} onChange={(e) => setStatus(e.target.value)} required />
        </div>
        <button type='submit'>Lag Anlegg</button>
      </form>
    </div>
  );
}

export default NyttAnlegg;
