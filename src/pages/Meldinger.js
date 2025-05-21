import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';
import { useTranslation } from 'react-i18next';

function Meldinger() {
  const { t } = useTranslation();
  const [meldinger, setMeldinger] = useState([]);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [meldingSomSkalSlettes, setMeldingSomSkalSlettes] = useState(null);

  const hentMeldinger = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'meldinger'));
      const liste = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeldinger(liste.sort((a, b) => new Date(b.opprettet) - new Date(a.opprettet)));
    } catch (error) {
      console.error('Feil ved henting av meldinger:', error);
    }
  };

  useEffect(() => {
    hentMeldinger();
  }, []);

  const slettMelding = async (id) => {
    try {
      await deleteDoc(doc(db, 'meldinger', id));
      setToast(t('meldinger.slettet'));
      hentMeldinger();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      setToast(t('feil.sletting'));
    }
    setVisModal(false);
    setMeldingSomSkalSlettes(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('meldinger.tittel')}</h1>
      {meldinger.length === 0 ? (
        <p>{t('meldinger.ingen')}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {meldinger.map((m) => (
            <li key={m.id} style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div><strong>{t('meldinger.anleggsnummer')}:</strong> {m.anleggsnummer}</div>
              <div><strong>{t('meldinger.melding')}:</strong><br />{m.tekst}</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {m.opprettet && (
                  <>{t('meldinger.opprettet')}: {new Date(m.opprettet).toLocaleString()}</>
                )}
              </div>
              <button
                onClick={() => {
                  setMeldingSomSkalSlettes(m);
                  setVisModal(true);
                }}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🗑️ {t('meldinger.slettKnapp')}
              </button>
            </li>
          ))}
        </ul>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {visModal && (
        <BekreftModal
          vis={visModal}
          melding={`${t('meldinger.bekreft')} ${meldingSomSkalSlettes?.anleggsnummer}?`}
          onBekreft={() => slettMelding(meldingSomSkalSlettes.id)}
          onAvbryt={() => {
            setVisModal(false);
            setMeldingSomSkalSlettes(null);
          }}
        />
      )}
    </div>
  );
}

export default Meldinger;
