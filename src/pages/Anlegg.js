import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);

  const fetchAnlegg = async () => {
    const anleggCol = collection(db, 'anlegg');
    const anleggSnapshot = await getDocs(anleggCol);
    const anleggList = anleggSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAnlegg(anleggList);
  };

  useEffect(() => {
    fetchAnlegg();
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [toast, setToast] = useState('');

  const fetchAnlegg = async () => {
    const anleggCol = collection(db, 'anlegg');
    const anleggSnapshot = await getDocs(anleggCol);
    const anleggList = anleggSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAnlegg(anleggList);
  };

  useEffect(() => {
    fetchAnlegg();
  }, []);

  const slettBilde = async (anleggId, bildeUrl) => {
    if (!window.confirm('Er du sikker på at du vil slette bildet?')) return;

    try {
      const bildeRef = ref(storage, bildeUrl);
      await deleteObject(bildeRef);

      const anleggRef = doc(db, 'anlegg', anleggId);
      await updateDoc(anleggRef, { bildeUrl: '' });

      setToast('Bilde slettet');
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      alert('Kunne ikke slette bildet.');
    }
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
          <li key={a.id} style={{ marginBottom: '30px' }}>
            <strong>{a.navn}</strong> – {statusEmoji(a.status)} {a.status}<br />
            {a.opprettet && (
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                Opprettet: {new Date(a.opprettet).toLocaleString()}
              </div>
            )}
            {a.bildeUrl && (
              <>
                <img
                  src={a.bildeUrl}
                  alt="Anleggsbilde"
                  style={{ maxWidth: '200px', marginTop: '10px', cursor: 'pointer' }}
                  onClick={() => setFullscreenBilde(a.bildeUrl)}
                /><br />
                <button onClick={() => lastNedBilde(a.bildeUrl)}>📥 Last ned</button>{' '}
                <button onClick={() => slettBilde(a.id, a.bildeUrl)}>🗑️ Slett bilde</button>
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

export default Anlegg;

  }, []);

  const slettBilde = async (anleggId, bildeUrl) => {
    if (!window.confirm('Er du sikker på at du vil slette bildet?')) return;
    try {
      const bildeRef = ref(storage, bildeUrl);
      await deleteObject(bildeRef);
      const anleggRef = doc(db, 'anlegg', anleggId);
      await updateDoc(anleggRef, { bildeUrl: '' });
      alert('Bilde slettet.');
      fetchAnlegg();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      alert('Kunne ikke slette bildet.');
    }
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
          <li key={a.id} style={{ marginBottom: '30px' }}>
            <strong>{a.navn}</strong> – {statusEmoji(a.status)} {a.status}<br />
            {a.opprettet && (
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                Opprettet: {new Date(a.opprettet).toLocaleString()}
              </div>
            )}
            {a.bildeUrl && (
              <>
                <img
                  src={a.bildeUrl}
                  alt="Anleggsbilde"
                  style={{ maxWidth: '200px', marginTop: '10px', cursor: 'pointer' }}
                  onClick={() => setFullscreenBilde(a.bildeUrl)}
                /><br />
                <button onClick={() => lastNedBilde(a.bildeUrl)}>📥 Last ned</button>{' '}
                <button onClick={() => slettBilde(a.id, a.bildeUrl)}>🗑️ Slett bilde</button>
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
    </div>
  );
}

export default Anlegg;
