import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function Meldinger() {
  const [meldinger, setMeldinger] = useState([]);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [meldingId, setMeldingId] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const hentMeldinger = async () => {
      const querySnapshot = await getDocs(collection(db, 'meldinger'));
      const liste = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      liste.sort((a, b) => new Date(b.tidspunkt) - new Date(a.tidspunkt));
      setMeldinger(liste);
    };
    hentMeldinger();
  }, [toast]);

  const bekreftSlett = (id) => {
    setMeldingId(id);
    setVisModal(true);
  };

  const slettMelding = async () => {
    await deleteDoc(doc(db, 'meldinger', meldingId));
    setToast(t('meldinger.slettet'));
    setVisModal(false);
    setMeldingId(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('meldinger.tittel')}</h1>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>🏠 Hjem</button>
      </div>

      {meldinger.map((m) => (
        <div key={m.id} style={{
          background: '#f9f9f9',
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px'
        }}>
          <strong>{m.anleggsnummer}</strong><br />
          <small>{new Date(m.tidspunkt).toLocaleString()}</small>
          <p>{m.melding}</p>
          <button onClick={() => bekreftSlett(m.id)}>{t('knapp.slett')}</button>
        </div>
      ))}

      {toast && <Toast melding={toast} onClose={() => setToast('')} />}
      <BekreftModal
        vis={visModal}
        melding={t('meldinger.bekreft')}
        onBekreft={slettMelding}
        onAvbryt={() => setVisModal(false)}
      />
    </div>
  );
}

export default Meldinger;
