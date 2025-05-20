import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

function NyttAnlegg() {
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');
  const [bilde, setBilde] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bildeUrl = '';
    if (bilde) {
      const bildeRef = ref(storage, `anlegg/${Date.now()}_${bilde.name}`);
      try {
        const snapshot = await uploadBytes(bildeRef, bilde);
        bildeUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Feil ved bildeopplasting:', error);
        alert('Kunne ikke laste opp bilde.');
        return;
      }
    }

    const anlegg = { navn, status, bildeUrl };

    try {
      await addDoc(collection(db, 'anlegg'), anlegg);
      alert('Anlegg lagret!');
      setNavn('');
      setStatus('');
      setBilde(null);
    } catch (error) {
      console.error('Feil ved lagring av anlegg: ', error);
      alert('Kunne ikke lagre anlegg.');
    }
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
          <label>Legg til bilde (valgfritt):</label><br />
          <input type='file' accept='image/*' onChange={(e) => setBilde(e.target.files[0])} />
        </div>
        <button type='submit'>Lag Anlegg</button>
      </form>
    </div>
  );
}

export default NyttAnlegg;
