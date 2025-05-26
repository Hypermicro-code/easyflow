// src/components/OpprettAnsattModal.js
import React, { useState } from 'react';
import './Modal.css';
import { useTranslation } from 'react-i18next';

export default function OpprettAnsattModal({ vis, onLukk, onBekreft }) {
  const { t } = useTranslation();
  const [fornavn, setFornavn] = useState('');
  const [etternavn, setEtternavn] = useState('');
  const [epost, setEpost] = useState('');
  const [telefon, setTelefon] = useState('');
  const [ansattnummer, setAnsattnummer] = useState('');
  const [rolle, setRolle] = useState('felt');

  const nullstill = () => {
    setFornavn('');
    setEtternavn('');
    setEpost('');
    setTelefon('');
    setAnsattnummer('');
    setRolle('felt');
  };

  const håndterBekreft = () => {
    onBekreft({ fornavn, etternavn, epost, telefon, ansattnummer, rolle });
    nullstill();
  };

  if (!vis) return null;

  return (
    <div className="modalBakgrunn">
      <div className="modalBoks">
        <h3>{t('admin.modalTittel')}</h3>
        
        <input
          type="text"
          placeholder={t('admin.modalFornavn')}
          value={fornavn}
          onChange={(e) => setFornavn(e.target.value)}
        />
        <input
          type="text"
          placeholder={t('admin.modalEtternavn')}
          value={etternavn}
          onChange={(e) => setEtternavn(e.target.value)}
        />
        <input
          type="email"
          placeholder={t('admin.modalEpost')}
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
        />
        <input
          type="tel"
          placeholder={t('admin.modalTelefon')}
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
        />
        <input
          type="text"
          placeholder={t('admin.modalAnsattnummer')}
          value={ansattnummer}
          onChange={(e) => setAnsattnummer(e.target.value)}
        />

        <select value={rolle} onChange={(e) => setRolle(e.target.value)}>
          <option value="felt">{t('admin.modalFelt')}</option>
          <option value="kontor">{t('admin.modalKontor')}</option>
        </select>

        <div className="knappeRad">
          <button className="rødKnapp" onClick={onLukk}>
            {t('admin.modalAvbryt')}
          </button>
          <button className="blaKnapp" onClick={håndterBekreft}>
            {t('admin.modalOpprett')}
          </button>
        </div>
      </div>
    </div>
  );
}
export default OpprettAnsattModal;
