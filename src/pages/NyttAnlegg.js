import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function NyttAnlegg() {
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const anlegg = { navn, status };

    try {
      await addDoc(collection(db, 'anlegg'), anlegg);
      alert('Anlegg lagret!');
      setNavn('');
      setStatus('');
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
        <button type='submit'>Lag Anlegg</button>
      </form>
    </div>
  );
}

export default NyttAnlegg;
