import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { brukerdata } = useAuth();

  if (!brukerdata) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>{t('laster')}...</div>;
  }

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
      {/* Språk og utlogging */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <select
          onChange={(e) => {
            i18n.changeLanguage(e.target.value);
            localStorage.setItem('språk', e.target.value);
          }}
          value={i18n.language}
        >
          <option value="no">Norsk</option>
          <option value="en">English</option>
        </select>
        <button onClick={() => signOut(auth)}>{t('knapp.loggUt')}</button>
      </div>

      <h1>Velkommen til EasyFlow</h1>

      {/* Menyknapper */}
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
