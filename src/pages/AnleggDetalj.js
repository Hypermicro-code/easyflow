import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function AnleggDetalj() {
  const { id } = useParams();
  const [anlegg, setAnlegg] = useState(null);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [sletteType, setSletteType] = useState(null); // "bilde" eller "anlegg"
  const navigate = useNavigate();

  const fetchAnlegg = async () => {
    const docRef = doc(db, 'anlegg', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAnlegg({ id: docSnap.id, ...docSnap.data() });
    } else {
      setToast('Anlegg ikke funnet');
    }
  };

  useEffect(() => {
    fetchAnlegg();
  }, [id]);

  const slettBilde = async () => {
    try {
      const bildeRef = ref(storage, anlegg.bildeUrl);
      await deleteObject(bildeRef);
      await updateDoc(doc(db, 'anlegg', id), { bildeUrl: '' });
      setToast('Bilde slettet');
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved sletting av bilde:', error);
      setToast('Feil ved sletting av bilde');
    }
    setVisModal(false);
    setSletteType(null);
  };

  const slettAnlegg = async () => {
    try {
      if (anlegg.bildeUrl) {
        const bildeRef = ref(storage, anlegg.bildeUrl);
        await deleteObject(bildeRef);
      }
      await deleteDoc(doc(db, 'anlegg', id));
      setToast('Anlegg slettet');
      navigate('/anlegg');
    } catch (error) {
      console.error('Feil ved sletting av anlegg:', error);
      setToast('Feil ved sletting av anlegg');
    }
    setVisModal(false);
    setSletteType(null);
  };

  const lastNedBilde = () => {
    const link = document.createElement('a');
    link.href = anlegg.bildeUrl;
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

  if (!anlegg) return <div style={{ padding: '20px' }}>Laster anlegg...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Anleggsdetaljer</h1>
      <p><strong>Anleggsnummer:</strong> {anlegg.anleggsnummer}</p>
      <p><strong>Navn:</strong> {anlegg.navn}</p>
      <p><strong>Status:</strong> {statusEmoji(anlegg.status)} {anlegg.status}</p>
      <p><strong>Opprettet:</strong> {new Date(anlegg.opprettet).toLocaleString()}</p>

      {anlegg.bildeUrl ? (
        <>
          <img
            src={anlegg.bildeUrl}
            alt="Bilde"
            style={{ maxWidth: '100%', marginTop: '10px' }}
          /><br />
          <button onClick={lastNedBilde} style={{ marginRight: '8px' }}>📥 Last ned bilde</button>
          <button onClick={() => { setVisModal(true); setSletteType('bilde'); }}>🗑️ Slett bilde</button>
        </>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#666' }}>Ingen bilde lastet opp</p>
      )}

      <hr style={{ margin: '20px 0' }} />

      <button
        onClick={() => { setVisModal(true); setSletteType('anlegg'); }}
        style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        🗑️ Slett hele anlegget
      </button>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <BekreftModal
        vis={visModal}
        melding={sletteType === 'bilde' ? 'Slette bilde fra anlegget?' : 'Slette hele anlegget?'}
        onBekreft={sletteType === 'bilde' ? slettBilde : slettAnlegg}
        onAvbryt={() => setVisModal(false)}
      />
    </div>
  );
}

export default AnleggDetalj;
