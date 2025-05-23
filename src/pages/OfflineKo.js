import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function OfflineKo() {
  const [meldingsKø, setMeldingsKø] = useState([]);
  const [anleggsKø, setAnleggsKø] = useState([]);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [elementType, setElementType] = useState('');
  const [elementIndex, setElementIndex] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const meldinger = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    const anlegg = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    setMeldingsKø(meldinger);
    setAnleggsKø(anlegg);
  }, [toast]);

  const bekreftSlett = (type, index) => {
    setElementType(type);
    setElementIndex(index);
    setVisModal(true);
  };

  const slettElement = () => {
    if (elementType === 'melding') {
      const nyListe = [...meldingsKø];
      nyListe.splice(elementIndex, 1);
      localStorage.setItem('offlineMeldinger', JSON.stringify(nyListe));
      setMeldingsKø(nyListe);
    } else if (elementType === 'anlegg') {
      const nyListe = [...anleggsKø];
      nyListe.splice(elementIndex, 1);
      localStorage.setItem('offlineAnlegg', JSON.stringify(nyListe));
      setAnleggsKø(nyListe);
    }
    setToast(t('offlineKo.slettet'));
    setVisModal(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('offlineKo.tittel')}</h1>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>🏠 Hjem</button>
      </div>

      {meldingsKø.length > 0 && (
        <>
          <h2>{t('offlineKo.meldinger')}</h2>
          {meldingsKø.map((m, idx) => (
            <div key={idx} style={{
              background: '#fffbe6',
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <strong>{m.anleggsnummer}</strong><br />
              <p>{m.melding}</p>
              <button onClick={() => bekreftSlett('melding', idx)}>{t('knapp.slett')}</button>
            </div>
          ))}
        </>
      )}

      {anleggsKø.length > 0 && (
        <>
          <h2>{t('offlineKo.anlegg')}</h2>
          {anleggsKø.map((a, idx) => (
            <div key={idx} style={{
              background: '#e6f7ff',
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px'
            }}>
              <strong>{a.anleggsnummer}</strong><br />
              <p>{a.navn}</p>
              <button onClick={() => bekreftSlett('anlegg', idx)}>{t('knapp.slett')}</button>
            </div>
          ))}
        </>
      )}

      {toast && <Toast melding={toast} onClose={() => setToast('')} />}
      <BekreftModal
        vis={visModal}
        melding={t('offlineKo.bekreft')}
        onBekreft={slettElement}
        onAvbryt={() => setVisModal(false)}
      />
    </div>
  );
}

export default OfflineKo;
