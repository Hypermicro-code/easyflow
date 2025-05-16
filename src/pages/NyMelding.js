import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function NyMelding() {
  const [fra, setFra] = useState('');
  const [tekst, setTekst] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'meldinger'), {
        fra,
        tekst
      });
      alert('Melding lagret!');
      setFra('');
      setTekst('');
    } catch (error) {
      console.error('Feil ved lagring av melding: ', error);
      alert('Kunne ikke lagre melding.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
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
