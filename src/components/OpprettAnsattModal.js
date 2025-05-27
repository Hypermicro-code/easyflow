// src/components/OpprettAnsattModal.js
import React, { useState } from 'react';
import '../styles/Modal.css';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function OpprettAnsattModal({ vis, onLukk }) {
  const { t } = useTranslation();
  const [fornavn, setFornavn] = useState('');
  const [etternavn, setEtternavn] = useState('');
  const [telefon, setTelefon] = useState('');
  const [epost, setEpost] = useState('');
  const [rolle, setRolle] = useState('felt');

  const [feilmelding, setFeilmelding] = useState('');

  if (!vis) return null;

  const handleOpprett = async () => {
    try {
      const passord = Math.random().toString(36).slice(-8);

      const bruker = await createUserWithEmailAndPassword(auth, epost, passord);

      await setDoc(doc(db, 'brukere', bruker.user.uid), {
        fornavn,
        etternavn,
        telefon,
        epost,
        rolle,
        uid: bruker.user.uid,
      });

      alert(`✅ Bruker opprettet med midlertidig passord: ${passord}`);
      onLukk();
    } catch (error) {
      console.error('❌ Feil ved opprettelse av bruker:', error);
      setFeilmelding(error.message);
    }
  };

  return (
    <div className="modalBakgrunn">
      <div className="modalBoks">
        <h2>{t('admin.modalTittel')}</h3>
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
          type="text"
          placeholder={t('admin.modalTelefon')}
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
        />
        <input
          type="email"
          placeholder={t('admin.modalEpost')}
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
        />
        <select value={rolle} onChange={(e) => setRolle(e.target.value)}>
          <option value="felt">{t('admin.modalFelt')}</option>
          <option value="kontor">{t('admin.modalKontor')}</option>
        </select>

        {feilmelding && <p className="feil">{feilmelding}</p>}

        <div className="knappeRad">
          <button onClick={onLukk} className="rødKnapp">
            {t('admin.modalAvbryt')}
          </button>
          <button onClick={handleOpprett} className="blaKnapp">
            {t('admin.modalOpprett')}
          </button>
        </div>
      </div>
    </div>
  );
}
