import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [visArkiverte, setVisArkiverte] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const hentAnlegg = async () => {
      const querySnapshot = await getDocs(collection(db, 'anlegg'));
      const liste = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      liste.sort((a, b) => {
        const numA = a.anleggsnummer.toString().split('-')[0];
        const numB = b.anleggsnummer.toString().split('-')[0];
        return parseInt(numB) - parseInt(numA);
      });
      setAnlegg(liste);
    };
    hentAnlegg();
  }, []);

  const filtrerteAnlegg = anlegg.filter((a) =>
    visArkiverte ? a.arkivert : !a.arkivert
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('anlegg.oversikt')}</h1>

      <button onClick={() => navigate('/')}>🏠 Hjem</button>

      <button
        style={{ marginLeft: '10px' }}
        onClick={() => setVisArkiverte((v) => !v)}
      >
        {visArkiverte ? t('anlegg.visAktive') : t('anlegg.visArkiverte')}
      </button>

      <div style={{ marginTop: '20px' }}>
        <div style={{
          display: 'flex',
          fontWeight: 'bold',
          padding: '10px',
          borderBottom: '1px solid #ccc',
          position: 'sticky',
          top: 0,
          background: '#f0f0f0',
          zIndex: 1
        }}>
          <div style={{ flex: 1 }}>{t('anlegg.anleggsnummer')}</div>
          <div style={{ flex: 1 }}>{t('anlegg.opprettet')}</div>
          <div style={{ flex: 2 }}>{t('anlegg.navn')}</div>
          <div style={{ flex: 1 }}>{t('anlegg.status')}</div>
        </div>

        {filtrerteAnlegg.map((a) => (
          !a.anleggsnummer.toString().includes('-') && (
            <div
              key={a.id}
              onClick={() => navigate(`/anlegg/${a.id}`)}
              style={{
                display: 'flex',
                cursor: 'pointer',
                padding: '10px',
                borderBottom: '1px solid #eee',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ flex: 1, fontWeight: 'bold' }}>{a.anleggsnummer}</div>
              <div style={{ flex: 1 }}>{a.opprettet}</div>
              <div style={{ flex: 2, fontWeight: 'bold' }}>{a.navn}</div>
              <div style={{ flex: 1 }}>{a.statusEmoji || ''}</div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default Anlegg;
