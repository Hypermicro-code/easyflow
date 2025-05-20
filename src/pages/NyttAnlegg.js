import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';

function NyttAnlegg() {
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [bilde, setBilde] = useState(null);
  const [toast, setToast] = useState('');

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bildeUrl = '';
    let base64 = '';

    if (bilde) {
      if (navigator.onLine) {
        const bildeRef = ref(storage, `anlegg/${Date.now()}_${bilde.name}`);
        try {
          const snapshot = await uploadBytes(bildeRef, bilde);
          bildeUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error('Feil ved bildeopplasting:', error);
          setToast('Feil: kunne ikke laste opp bilde.');
          return;
        }
      } else {
        base64 = await toBase64(bilde);
      }
    }

    const anlegg = {
      navn,
      status,
      anleggsnummer: parseInt(anleggsnummer),
      bildeUrl,
      bildeBase64: base64,
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
    setBilde(null);
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
        <div>
          <label>Legg til bilde (valgfritt):</label><br />
          <input type='file' accept='image/*' onChange={(e) => setBilde(e.target.files[0])} />
        </div>
        <button type='submit'>Lag Anlegg</button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyttAnlegg;
