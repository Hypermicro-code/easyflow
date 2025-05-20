import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';

function NyMelding() {
  const [fra, setFra] = useState('');
  const [tekst, setTekst] = useState('');
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
        const bildeRef = ref(storage, `meldinger/${Date.now()}_${bilde.name}`);
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

    const melding = {
      fra,
      tekst,
      bildeUrl,
      bildeBase64: base64,
      opprettet: new Date().toISOString()
    };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'meldinger'), melding);
        setToast('Melding lagret');
      } catch (error) {
        console.error('Feil ved lagring av melding: ', error);
        setToast('Feil: kunne ikke lagre melding.');
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
      lagret.push(melding);
      localStorage.setItem('offlineMeldinger', JSON.stringify(lagret));
      setToast('Ingen dekning – melding lagret lokalt');
    }

    setFra('');
    setTekst('');
    setBilde(null);
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

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyMelding;
