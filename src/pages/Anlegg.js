import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Anlegg() {
  const { t } = useTranslation();
  const [anlegg, setAnlegg] = useState([]);
  const [visArkiverte, setVisArkiverte] = useState(false);

  useEffect(() => {
    const hentAnlegg = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'anlegg'));
        const liste = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.anleggsnummer - a.anleggsnummer);
        setAnlegg(liste);
      } catch (error) {
        console.error('Feil ved henting av anlegg:', error);
      }
    };

    hentAnlegg();
  }, []);

 const filtrert = anlegg.filter(a =>
  (visArkiverte ? a.arkivert === true : !a.arkivert) &&
  !a.anleggsnummer.toString().includes('-') // 🧠 Kun hovedanlegg
);

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
      <h1>
        {visArkiverte ? t('anlegg.arkiverteTittel') : t('anlegg.tittel')}
      </h1>

      <button onClick={() => setVisArkiverte(!visArkiverte)} style={{ marginBottom: '16px' }}>
        {visArkiverte ? t('anlegg.visAktive') : t('anlegg.visArkiverte')}
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 2fr 60px',
        gap: '10px',
        fontWeight: 'bold',
        position: 'sticky',
        top: '0',
        backgroundColor: '#ffffff',
        padding: '10px 16px',
        borderBottom: '2px solid #ccc',
        zIndex: 10
      }}>
        <div>{t('anlegg.anleggsnummer')}</div>
        <div>{t('anlegg.opprettet')}</div>
        <div>{t('anlegg.navn')}</div>
        <div>{t('anlegg.status')}</div>
      </div>

      {filtrert.length === 0 ? (
        <p>{visArkiverte ? t('anlegg.ingenArkiverte') : t('anlegg.ingen')}</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtrert.map((a) => (
            <li key={a.id} style={{ marginBottom: '8px' }}>
              <Link
                to={`/anlegg/${a.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 2fr 60px',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{a.anleggsnummer}</div>
                <div>{new Date(a.opprettet).toLocaleString()}</div>
                <div style={{ fontWeight: 'bold' }}>{a.navn}</div>
                <div style={{ fontSize: '1.5rem' }}>{statusEmoji(a.status)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Anlegg;
