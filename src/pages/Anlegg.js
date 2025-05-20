import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [valgForSletting, setValgForSletting] = useState(null); // { id, bildeUrl }

  const fetchAnlegg = async () => {
    const anleggCol = collection(db, 'anlegg');
    const anleggSnapshot = await getDocs(anleggCol);
    const anleggList = anleggSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAnlegg(anleggList);
  };

  useEffect(() => {
    fetchAnlegg();
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

      const anleggRef = doc(db, 'anlegg', id);
      await updateDoc(anleggRef, { bildeUrl: '' });

      setToast('Bilde slettet');
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      alert('Kunne ikke slette bildet.');
    }

    setValgForSletting(null);
  };

  const lastNedBilde = (bildeUrl) => {
    const link = document.createElement('a');
    link.href = bildeUrl;
    link.download = 'anleggsbilde.jpg';
    link.click();
  };

  const statusEmoji = (status) => {
    const s = status?.toLowerCase();
    if (s === 'ok') return '🟢';
    if (s === 'avvik') return '🔴';
    if (s === 'pågår' || s === 'under arbeid') return '🟠';
    return '⚪️';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Anleggsliste</h1>
      <ul>
        {anlegg.map(a => (
          <li key={a.id} style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontSize: '1.05em',
            lineHeight: '1.6'
          }}>
            <strong>{a.navn}</strong> – {statusEmoji(a.status)} {a.status}<br />
            {a.opprettet && (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Opprettet: {new Date(a.opprettet).toLocaleString()}
              </div>
            )}
            {a.bildeUrl && (
              <>
                <img
                  src={a.bildeUrl}
                  alt="Anleggsbilde"
                  style={{ maxWidth: '100%', maxHeight: '250px', marginTop: '10px', cursor: 'pointer' }}
                  onClick={() => setFullscreenBilde(a.bildeUrl)}
                /><br />
                <button onClick={() => lastNedBilde(a.bildeUrl)} style={{ marginRight: '8px', marginTop: '6px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#eee' }}>
                  📥 Last ned
                </button>
                <button onClick={() => startSletting(a.id, a.bildeUrl)} style={{ marginTop: '6px', padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#eee' }}>
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

export default Anlegg;
