import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function AnleggDetalj() {
  const { id } = useParams();
  const [anlegg, setAnlegg] = useState(null);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [sletteType, setSletteType] = useState(null);
  const [bilde, setBilde] = useState(null);
  const navigate = useNavigate();

  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');
  const [anleggsnummer, setAnleggsnummer] = useState('');

  const fetchAnlegg = async () => {
    const docRef = doc(db, 'anlegg', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setAnlegg({ id: docSnap.id, ...data });
      setNavn(data.navn || '');
      setStatus(data.status || '');
      setAnleggsnummer(data.anleggsnummer || '');
    } else {
      setToast('Anlegg ikke funnet');
    }
  };

  useEffect(() => {
    fetchAnlegg();
  }, [id]);

  const oppdaterAnlegg = async () => {
    try {
      await updateDoc(doc(db, 'anlegg', id), {
        navn,
        status,
        anleggsnummer: parseInt(anleggsnummer)
      });
      setToast('Anlegg oppdatert');
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved oppdatering:', error);
      setToast('Feil ved oppdatering');
    }
  };

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

  const lastOppNyttBilde = async () => {
    if (!bilde) return;
    try {
      const bildeRef = ref(storage, `anlegg/${Date.now()}_${bilde.name}`);
      const snapshot = await uploadBytes(bildeRef, bilde);
      const url = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(db, 'anlegg', id), { bildeUrl: url });
      setToast('Nytt bilde lastet opp');
      setBilde(null);
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved opplasting:', error);
      setToast('Feil ved bildeopplasting');
    }
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
    <div style={{ display: 'flex', padding: '20px', gap: '30px' }}>
      {/* VENSTRE – Info og kontroller */}
      <div style={{ flex: 1 }}>
        <h1>Anleggsdetaljer</h1>

        <label>Anleggsnummer:</label><br />
        <input
          type="number"
          value={anleggsnummer}
          onChange={(e) => setAnleggsnummer(e.target.value)}
        /><br /><br />

        <label>Navn:</label><br />
        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
        /><br /><br />

        <label>Status:</label><br />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        /><br /><br />

        <button
          onClick={oppdaterAnlegg}
          style={{ marginBottom: '20px', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white' }}
        >
          💾 Lagre endringer
        </button>

        <p><strong>Opprettet:</strong> {new Date(anlegg.opprettet).toLocaleString()}</p>

        {!anlegg.arkivert && (
          <button
            onClick={async () => {
              await updateDoc(doc(db, 'anlegg', id), { arkivert: true });
              setToast('Anlegg arkivert');
              navigate('/anlegg');
            }}
            style={{
              marginTop: '10px',
              backgroundColor: '#999',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            📦 Arkiver anlegg
          </button>
        )}

        <hr style={{ margin: '20px 0' }} />

        <button
          onClick={() => { setVisModal(true); setSletteType('anlegg'); }}
          style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          🗑️ Slett hele anlegget
        </button>
      </div>

      {/* HØYRE – Bilde */}
      <div style={{ flex: '0 0 300px' }}>
        <h3>Bilde</h3>

        {anlegg.bildeUrl ? (
          <>
            <img
              src={anlegg.bildeUrl}
              alt="Bilde"
              style={{ maxWidth: '100%', marginBottom: '10px' }}
            /><br />
            <button onClick={lastNedBilde} style={{ marginRight: '8px' }}>📥 Last ned</button>
            <button onClick={() => { setVisModal(true); setSletteType('bilde'); }}>🗑️ Slett bilde</button>
          </>
        ) : (
          <p style={{ fontStyle: 'italic', color: '#666' }}>Ingen bilde lastet opp</p>
        )}

        <hr style={{ margin: '20px 0' }} />

        <label>Last opp nytt bilde:</label><br />
        <input type="file" accept="image/*" onChange={(e) => setBilde(e.target.files[0])} /><br />
        <button
          onClick={lastOppNyttBilde}
          style={{
            marginTop: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ⬆️ Last opp
        </button>
      </div>

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
