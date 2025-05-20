import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function Meldinger() {
  const [meldinger, setMeldinger] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [valgForSletting, setValgForSletting] = useState(null);

  const fetchMeldinger = async () => {
    const meldingCol = collection(db, 'meldinger');
    const meldingSnapshot = await getDocs(meldingCol);
    const meldingList = meldingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMeldinger(meldingList);
  };

  useEffect(() => {
    fetchMeldinger();
  }, []);

  const startSletting = (id, bildeUrl) => {
    setValgForSletting({ id, bildeUrl });
    setVisModal(true);
  };

  const bekreftSletting = async () => {
    if (!valgForSletting) return;
    const { id, bildeUrl } = valgForSletting;
    setVisModal(false);

    try {
      const bildeRef = ref(storage, bildeUrl);
      await deleteObject(bildeRef);
      const meldingRef = doc(db, 'meldinger', id);
      await updateDoc(meldingRef, { bildeUrl: '' });
      setToast('Bilde slettet');
      fetchMeldinger();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      alert('Kunne ikke slette bildet.');
    }

    setValgForSletting(null);
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
          <li key={m.id} style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontSize: '1.05em',
            lineHeight: '1.6'
          }}>
            <strong>{m.fra}:</strong> {m.tekst}<br />
            {m.opprettet && (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Opprettet: {new Date(m.opprettet).toLocaleString()}
              </div>
            )}
            {m.bildeUrl && (
              <>
                <img
                  src={m.bildeUrl}
                  alt="Melding bilde"
                  style={{ maxWidth: '100%', maxHeight: '250px', marginTop: '10px', cursor: 'pointer' }}
                  onClick={() => setFullscreenBilde(m.bildeUrl)}
                /><br />
                <button onClick={() => lastNedBilde(m.bildeUrl)} style={{ marginRight: '8px', marginTop: '6px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#eee' }}>
                  📥 Last ned
                </button>
                <button onClick={() => startSletting(m.id, m.bildeUrl)} style={{ marginTop: '6px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#eee' }}>
                  🗑️ Slett bilde
                </button>
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
      <BekreftModal
        vis={visModal}
        melding="Er du sikker på at du vil slette bildet?"
        onBekreft={bekreftSletting}
        onAvbryt={() => setVisModal(false)}
      />
    </div>
  );
}

export default Meldinger;
