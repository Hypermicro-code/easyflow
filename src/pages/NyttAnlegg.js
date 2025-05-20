import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';

function NyttAnlegg() {
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const anlegg = {
      navn,import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';

function NyttAnlegg() {
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('Nytt anlegg');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const anlegg = {
      navn,
      status,
      anleggsnummer: parseInt(anleggsnummer),
      opprettet: new Date().toISOString()
    };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'anlegg'), anlegg);
        setToast('Anlegg lagret');
      } catch (error) {
        console.error('Feil ved lagring av anlegg: ', error);
        setToast('Feil: kunne ikke lagre anlegg.');
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
      lagret.push(anlegg);
      localStorage.setItem('offlineAnlegg', JSON.stringify(lagret));
      setToast('Ingen dekning – anlegg lagret lokalt');
    }

    setNavn('');
    setStatus('Nytt anlegg');
    setAnleggsnummer('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Nytt anlegg</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Anleggsnavn:</label><br />
          <input type='text' value={navn} onChange={(e) => setNavn(e.target.value)} required />
        </div>
        <div>
          <label>Status:</label><br />
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option>Nytt anlegg</option>
            <option>Under arbeid</option>
            <option>Til kontroll</option>
            <option>Ferdig</option>
            <option>Til utbedring</option>
          </select>
        </div>
        <div>
          <label>Anleggsnummer:</label><br />
          <input type='number' value={anleggsnummer} onChange={(e) => setAnleggsnummer(e.target.value)} required />
        </div>
        <button type='submit'>Lag Anlegg</button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyttAnlegg;

      status,
      anleggsnummer: parseInt(anleggsnummer),
      opprettet: new Date().toISOString()
    };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'anlegg'), anlegg);
        setToast('Anlegg lagret');
      } catch (error) {
        console.error('Feil ved lagring av anlegg: ', error);
        setToast('Feil: kunne ikke lagre anlegg.');
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
      lagret.push(anlegg);
      localStorage.setItem('offlineAnlegg', JSON.stringify(lagret));
      setToast('Ingen dekning – anlegg lagret lokalt');
    }

    setNavn('');
    setStatus('');
    setAnleggsnummer('');
  };

  return (
    <div style={{ padding: '20px' }}>
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
        <div>
          <label>Anleggsnummer:</label><br />
          <input type='number' value={anleggsnummer} onChange={(e) => setAnleggsnummer(e.target.value)} required />
        </div>
        <button type='submit'>Lag Anlegg</button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyttAnlegg;
