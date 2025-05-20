import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function OfflineKo() {
  const [meldinger, setMeldinger] = useState([]);
  const [anlegg, setAnlegg] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [slettValg, setSlettValg] = useState(null); // { type: 'melding'|'anlegg', index }

  const hentKøer = () => {
    const lagretMeldinger = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    const lagretAnlegg = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    setMeldinger(lagretMeldinger);
    setAnlegg(lagretAnlegg);
  };

  const slettFraKø = () => {
    if (!slettValg) return;
    const { type, index } = slettValg;

    if (type === 'melding') {
      const ny = [...meldinger];
      ny.splice(index, 1);
      localStorage.setItem('offlineMeldinger', JSON.stringify(ny));
      setMeldinger(ny);
      setToast('Melding fjernet fra kø');
    }

    if (type === 'anlegg') {
      const ny = [...anlegg];
      ny.splice(index, 1);
      localStorage.setItem('offlineAnlegg', JSON.stringify(ny));
      setAnlegg(ny);
      setToast('Anlegg fjernet fra kø');
    }

    setSlettValg(null);
    setVisModal(false);
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const lastOppBilde = async (type, base64, namePrefix) => {
    const blob = dataURLtoBlob(base64);
    const storageRef = ref(storage, `${type}/${namePrefix}_${Date.now()}.jpg`);
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  };

  const synkMeldinger = async () => {
    if (meldinger.length === 0) return;

    for (let melding of meldinger) {
      let bildeUrl = melding.bildeUrl || '';
      if (!bildeUrl && melding.bildeBase64) {
        bildeUrl = await lastOppBilde('meldinger', melding.bildeBase64, 'melding');
      }

      await addDoc(collection(db, 'meldinger'), {
        fra: melding.fra,
        tekst: melding.tekst,
        bildeUrl,
        opprettet: melding.opprettet || new Date().toISOString()
      });
    }

    localStorage.removeItem('offlineMeldinger');
    hentKøer();
    setToast('Meldinger synkronisert');
  };

  const synkAnlegg = async () => {
    if (anlegg.length === 0) return;

    for (let a of anlegg) {
      let bildeUrl = a.bildeUrl || '';
      if (!bildeUrl && a.bildeBase64) {
        bildeUrl = await lastOppBilde('anlegg', a.bildeBase64, 'anlegg');
      }

      await addDoc(collection(db, 'anlegg'), {
        navn: a.navn,
        status: a.status,
        bildeUrl,
        opprettet: a.opprettet || new Date().toISOString()
      });
    }

    localStorage.removeItem('offlineAnlegg');
    hentKøer();
    setToast('Anlegg synkronisert');
  };

  const lastNedBase64 = (dataUrl, filnavn) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filnavn;
    link.click();
  };

  useEffect(() => {
    hentKøer();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Offline kø</h1>

      {/* Meldinger */}
      <h2>Meldinger ({meldinger.length})</h2>
      {meldinger.length > 0 ? (
        <>
          <ul>
            {meldinger.map((m, index) => (
              <li key={index} style={{ marginBottom: '20px' }}>
                <strong>Fra:</strong> {m.fra}<br />
                <strong>Tekst:</strong> {m.tekst}<br />
                {m.opprettet && (
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    Lagret: {new Date(m.opprettet).toLocaleString()}
                  </div>
                )}
                {(m.bildeBase64 || m.bildeUrl) && (
                  <>
                    <img
                      src={m.bildeUrl || m.bildeBase64}
                      alt="bilde"
                      style={{ maxWidth: '200px', cursor: 'pointer', marginTop: '5px' }}
                      onClick={() => setFullscreenBilde(m.bildeUrl || m.bildeBase64)}
                    /><br />
                    <button onClick={() => lastNedBase64(m.bildeUrl || m.bildeBase64, 'melding_offline.jpg')}>📥 Last ned</button>{' '}
                    <button onClick={() => { setSlettValg({ type: 'melding', index }); setVisModal(true); }}>🗑️ Slett fra kø</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <button onClick={synkMeldinger}>Synkroniser meldinger</button>
        </>
      ) : (
        <p>Ingen meldinger i kø.</p>
      )}

      {/* Anlegg */}
      <h2>Anlegg ({anlegg.length})</h2>
      {anlegg.length > 0 ? (
        <>
          <ul>
            {anlegg.map((a, index) => (
              <li key={index} style={{ marginBottom: '20px' }}>
                <strong>Navn:</strong> {a.navn}<br />
                <strong>Status:</strong> {a.status}<br />
                {a.opprettet && (
                  <div style={{ fontSize: '0.85em', color: '#666' }}>
                    Lagret: {new Date(a.opprettet).toLocaleString()}
                  </div>
                )}
                {(a.bildeBase64 || a.bildeUrl) && (
                  <>
                    <img
                      src={a.bildeUrl || a.bildeBase64}
                      alt="bilde"
                      style={{ maxWidth: '200px', cursor: 'pointer', marginTop: '5px' }}
                      onClick={() => setFullscreenBilde(a.bildeUrl || a.bildeBase64)}
                    /><br />
                    <button onClick={() => lastNedBase64(a.bildeUrl || a.bildeBase64, 'anlegg_offline.jpg')}>📥 Last ned</button>{' '}
                    <button onClick={() => { setSlettValg({ type: 'anlegg', index }); setVisModal(true); }}>🗑️ Slett fra kø</button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <button onClick={synkAnlegg}>Synkroniser anlegg</button>
        </>
      ) : (
        <p>Ingen anlegg i kø.</p>
      )}

      {/* Fullskjermvisning */}
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
        melding="Er du sikker på at du vil slette dette fra køen?"
        onBekreft={slettFraKø}
        onAvbryt={() => setVisModal(false)}
      />
    </div>
  );
}

export default OfflineKo;
