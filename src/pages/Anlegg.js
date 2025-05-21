import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Anlegg() {
  const { t } = useTranslation();
  const [anlegg, setAnlegg] = useState([]);

  useEffect(() => {
    const hentAnlegg = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'anlegg'));
        const liste = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(a => !a.arkivert)
          .sort((a, b) => b.anleggsnummer - a.anleggsnummer);
        setAnlegg(liste);
      } catch (error) {
        console.error('Feil ved henting av anlegg:', error);
      }
    };

    hentAnlegg();
  }, []);

  const statusEmoji = (status) => {
    const s = status?.toLowerCase();
    if (s === t('status.nytt').toLowerCase()) return '🆕';
    if (s === t('status.underArbeid').toLowerCase()) return '🛠️';
    if (s === t('status.tilKontroll').toLowerCase()) return '🔍';
    if (s === t('status.ferdig').toLowerCase()) return '✅';
    if (s === t('status.tilUtbedring').toLowerCase()) return '⚠️';
    return '⚪️';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('anlegg.tittel')}</h1>
      {anlegg.length === 0 ? (
        <p>{t('anlegg.ingen')}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {anlegg.map((a) => (
            <li key={a.id}>
              <Link to={`/anlegg/${a.id}`}>
                {statusEmoji(a.status)} {a.anleggsnummer} – {a.navn}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Anlegg;

  useEffect(() => {
    fetchAnlegg();
  }, []);

const statusEmoji = (status) => {
  const s = status?.toLowerCase();
  if (s === 'nytt anlegg') return '🆕';
  if (s === 'under arbeid') return '🛠️';
  if (s === 'til kontroll') return '🔍';
  if (s === 'ferdig') return '✅';
  if (s === 'til utbedring') return '⚠️';
  return '⚪️';
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Anleggsliste</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {anlegg.map(a => (
          <li
            key={a.id}
            onClick={() => navigate(`/anlegg/${a.id}`)}
            style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '1.05em',
              lineHeight: '1.6',
              cursor: 'pointer'
            }}
          >
            <strong>{a.anleggsnummer}</strong> – {a.navn}<br />
            {statusEmoji(a.status)} {a.status}<br />
            {a.opprettet && (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Opprettet: {new Date(a.opprettet).toLocaleString()}
              </div>
            )}
          </li>
        ))}
      </ul>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default Anlegg;
