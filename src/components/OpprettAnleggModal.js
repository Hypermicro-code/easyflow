// src/components/OpprettAnleggModal.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Modal.css';

export default function OpprettAnleggModal({ vis, onLukk, onBekreft }) {
  const { t } = useTranslation();
  const [navn, setNavn] = useState('');

  const bekreft = () => {
    if (navn.trim()) {
      onBekreft(navn.trim());
      setNavn('');
    }
  };

  if (!vis) return null;

  return (
    <div className="modalBakgrunn">
      <div className="modalInnhold">
        <h2>{t('anlegg.modalTittel')}</h2>
        <input
          type="text"
          placeholder={t('anlegg.modalNavn')}
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
        />
        <div className="modalKnapper">
          <button className="avbrytKnapp" onClick={onLukk}>
            {t('anlegg.modalAvbryt') || 'Avbryt'}
          </button>
          <button className="bekreftKnapp" onClick={bekreft}>
            {t('anlegg.modalBekreft') || 'Opprett'}
          </button>
        </div>
      </div>
    </div>
  );
}
