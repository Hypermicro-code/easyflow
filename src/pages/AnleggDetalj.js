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
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [bildeSomSkalSlettes, setBildeSomSkalSlettes] = useState(null);
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

  const lastOppNyttBilde = async () => {
    if (!bilde) return;
    try {
      const bildeRef = ref(storage, `anlegg/${Date.now()}_${bilde.name}`);
      const snapshot = await uploadBytes(bildeRef, bilde);
      const url = await getDownloadURL(snapshot.ref);

      const eksisterende = anlegg.bilder || [];
      await updateDoc(doc(db, 'anlegg', id), {
        bilder: [...eksisterende, url]
      });

      setToast('Bilde lastet opp');
      setBilde(null);
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved opplasting:', error);
      setToast('Feil ved bildeopplasting');
    }
  };

  const slettBilde = async (url) => {
    try {
      const bildeRef = ref(storage, url);
      await deleteObject(bildeRef);

      const gjenværende = (anlegg.bilder || []).filter(b => b !== url);
      await updateDoc(doc(db, 'anlegg', id), { bilder: gjenværende });

      setToast('Bilde slettet');
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      setToast('Feil ved sletting av bilde');
    }

    setBildeSomSkalSlettes(null);
    setVisModal(false);
  };

  const slettAnlegg = async () => {
    try {
      for (const url of anlegg.bilder || []) {
        const bildeRef = ref(storage, url);
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
      {/* VENSTRE */}
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
          style={{ marginBottom: '10px', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white' }}
        >
          💾 Lagre endringer
        </button>{' '}

        <input type="file" accept="image/*" onChange={(e) => setBilde(e.target.files[0])} />
        <button
          onClick={lastOppNyttBilde}
          style={{ marginTop: '10px', marginLeft: '10px', backgroundColor: '#2196F3', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          ⬆️ Last opp bilde
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
              marginTop: '20px',
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

      {/* HØYRE */}
      <div style={{ flex: '0 0 300px' }}>
        <h3>Bilder</h3>
        {anlegg.bilder && anlegg.bilder.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {anlegg.bilder.map((url, idx) => (
              <div key={idx}>
                <img
                  src={url}
                  alt={`Bilde ${idx + 1}`}
                  style={{ width: '100%', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => setFullscreenBilde(url)}
                />
                <button
                  onClick={() => {
                    setBildeSomSkalSlettes(url);
                    setVisModal(true);
                  }}
                  style={{
                    marginTop: '5px',
                    backgroundColor: '#eee',
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Slett
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontStyle: 'italic', color: '#666' }}>Ingen bilder</p>
        )}
      </div>

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
        melding={bildeSomSkalSlettes ? 'Slette dette bildet?' : 'Slette hele anlegget?'}
        onBekreft={() => {
          if (bildeSomSkalSlettes) {
            slettBilde(bildeSomSkalSlettes);
          } else {
            slettAnlegg();
          }
        }}
        onAvbryt={() => {
          setVisModal(false);
          setBildeSomSkalSlettes(null);
        }}
      />
    </div>
  );
}

export default AnleggDetalj;
