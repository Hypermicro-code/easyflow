import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { brukerdata } = useAuth(); // For å sjekke admin-rolle

  const knapper = [
    { label: t('nav.anlegg'), path: '/anlegg' },
    { label: t('nav.nyMelding'), path: '/ny-melding' },
    { label: t('nav.meldinger'), path: '/meldinger' },
    { label: t('nav.offlineKo'), path: '/offline' },
  ];

  if (brukerdata?.rolle === 'admin') {
    knapper.push({ label: 'Admin', path: '/admin' });
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Velkommen til EasyFlow</h1>
      <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {knapper.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => navigate(btn.path)}
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '80px',
              fontSize: '16px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer'
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
