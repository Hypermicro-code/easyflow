import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function NavnModal({ vis, onLukk, onBekreft }) {
  const { t } = useTranslation();
  const [navn, setNavn] = useState('');

  if (!vis) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    }}>
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
      }}>
        <h3>{t('anleggDetalj.opprettUnderanlegg')}</h3>
        <p>{t('anleggDetalj.angiNavnUnderanlegg')}</p>
        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onLukk}
            style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px' }}
          >
            {t('knapp.avbryt')}
          </button>
          <button
            onClick={() => {
              onBekreft(navn);
              setNavn('');
            }}
            disabled={!navn.trim()}
            style={{
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '5px',
              opacity: navn.trim() ? 1 : 0.5,
              cursor: navn.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            {t('knapp.opprett')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavnModal;
