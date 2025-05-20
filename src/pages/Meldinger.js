import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';

function Meldinger() {
  const [meldinger, setMeldinger] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [toast, setToast] = useState('');

  const fetchMeldinger = async () => {
    const meldingCol = collection(db, 'meldinger');
    const meldingSnapshot = await getDocs(meldingCol);
    const meldingList = meldingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMeldinger(meldingList);
  };

  useEffect(() => {
    fetchMeldinger();
  }, []);

  const slettBilde = async (meldingId, bildeUrl) => {
    if (!window.confirm('Er du sikker på at du vil slette bildet?')) return;
    try {
      const bildeRef = ref(storage, bildeUrl);
      await deleteObject(bildeRef);
      const meldingRef = doc(db, 'meldinger', meldingId);
      await updateDoc(meldingRef, { bildeUrl: '' });
      setToast('Bilde slettet');
      fetchMeldinger();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      alert('Kunne ikke slette bildet.');
    }
  };

  const lastNedBilde = (bildeUrl) => {
    const link = document.createElement('a');
    link.href = bildeUrl;
    link.download = 'melding_bilde.jpg';
    link.click();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meldinger</h1>
      <ul>
        {meldinger.map(m => (
          <li key={m.id} style={{ marginBottom: '30px' }}>
            <strong>{m.fra}:</strong> {m.tekst}<br />
            {m.opprettet && (
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                Opprettet: {new Date(m.opprettet).toLocaleString()}
              </div>
            )}
            {m.bildeUrl && (
              <>
                <img
                  src={m.bildeUrl}
                  alt="Melding bilde"
                  style={{ maxWidth: '200px', marginTop: '10px', cursor: 'pointer' }}
                  onClick={() => setFullscreenBilde(m.bildeUrl)}
                /><br />
                <button onClick={() => lastNedBilde(m.bildeUrl)}>📥 Last ned</button>{' '}
                <button onClick={() => slettBilde(m.id, m.bildeUrl)}>🗑️ Slett bilde</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {fullscreenBilde && (
        <div
          onClick={() => setFullscreenBilde(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >
          <img
            src={fullscreenBilde}
            alt="Fullskjerm"
            style={{ maxWidth: '90%', maxHeight: '90%' }}
          />
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default Meldinger;
