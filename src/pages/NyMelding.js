import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

function NyMelding() {
  const [fra, setFra] = useState('');
  const [tekst, setTekst] = useState('');
  const [bilde, setBilde] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let bildeUrl = '';
    if (bilde) {
      const bildeRef = ref(storage, `meldinger/${Date.now()}_${bilde.name}`);
      try {
        const snapshot = await uploadBytes(bildeRef, bilde);
        bildeUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Feil ved bildeopplasting:', error);
        alert('Kunne ikke laste opp bilde.');
        return;
      }
    }

    const melding = { fra, tekst, bildeUrl };

    try {
      await addDoc(collection(db, 'meldinger'), melding);
      alert('Melding lagret!');
      setFra('');
      setTekst('');
      setBilde(null);
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
        <div>
          <label>Legg til bilde (valgfritt):</label><br />
          <input type='file' accept='image/*' onChange={(e) => setBilde(e.target.files[0])} />
        </div>
        <button type='submit'>Send melding</button>
      </form>
    </div>
  );
}

export default NyMelding;
