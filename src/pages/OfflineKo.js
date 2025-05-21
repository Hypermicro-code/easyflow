import React, { useEffect, useState } from 'react';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';
import { useTranslation } from 'react-i18next';

function OfflineKo() {
  const { t } = useTranslation();
  const [meldinger, setMeldinger] = useState([]);
  const [anlegg, setAnlegg] = useState([]);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [sletteInfo, setSletteInfo] = useState(null);

  useEffect(() => {
    const m = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    const a = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    setMeldinger(m);
    setAnlegg(a);
  }, []);

  const slettFraKø = (type, index) => {
    const oppdatert = [...(type === 'melding' ? meldinger : anlegg)];
    oppdatert.splice(index, 1);
    if (type === 'melding') {
      localStorage.setItem('offlineMeldinger', JSON.stringify(oppdatert));
      setMeldinger(oppdatert);
    } else {
      localStorage.setItem('offlineAnlegg', JSON.stringify(oppdatert));
      setAnlegg(oppdatert);
    }
    setToast(t('offlineKo.slettet'));
    setVisModal(false);
    setSletteInfo(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('offlineKo.tittel')}</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>{t('offlineKo.anlegg')}</h2>
        {anlegg.length === 0 ? (
          <p>{t('offlineKo.ingenAnlegg')}</p>
        ) : (
          <ul>
            {anlegg.map((a, idx) => (
              <li key={idx}>
                {a.anleggsnummer} – {a.navn}{' '}
                <button onClick={() => {
                  setSletteInfo({ type: 'anlegg', index: idx });
                  setVisModal(true);
                }}>
                  🗑️ {t('offlineKo.slettKnapp')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2>{t('offlineKo.meldinger')}</h2>
        {meldinger.length === 0 ? (
          <p>{t('offlineKo.ingenMeldinger')}</p>
        ) : (
          <ul>
            {meldinger.map((m, idx) => (
              <li key={idx}>
                {m.anleggsnummer}: {m.tekst}{' '}
                <button onClick={() => {
                  setSletteInfo({ type: 'melding', index: idx });
                  setVisModal(true);
                }}>
                  🗑️ {t('offlineKo.slettKnapp')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {visModal && (
        <BekreftModal
          vis={visModal}
          melding={t('offlineKo.bekreft')}
          onBekreft={() => slettFraKø(sletteInfo.type, sletteInfo.index)}
          onAvbryt={() => {
            setVisModal(false);
            setSletteInfo(null);
          }}
        />
      )}
    </div>
  );
}

export default OfflineKo;
