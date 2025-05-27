// src/pages/AnsattDetalj.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import '../App.css';

export default function AnsattDetalj() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ansatt, setAnsatt] = useState(null);
  const [rediger, setRediger] = useState(false);
  const [fornavn, setFornavn] = useState('');
  const [etternavn, setEtternavn] = useState('');
  const [telefon, setTelefon] = useState('');

  useEffect(() => {
    const hentAnsatt = async () => {
      const ref = doc(db, 'brukere', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setAnsatt(data);
        setFornavn(data.fornavn || '');
        setEtternavn(data.etternavn || '');
        setTelefon(data.telefon || '');
      }
    };
    hentAnsatt();
  }, [id]);

  const lagreEndringer = async () => {
    const ref = doc(db, 'brukere', id);
    await updateDoc(ref, {
      fornavn,
      etternavn,
      telefon,
    });
    setRediger(false);
    setAnsatt((prev) => ({ ...prev, fornavn, etternavn, telefon }));
  };

  if (!ansatt) return <div>Laster...</div>;

  return (
    <div className="innhold">
      <h2>{`${ansatt.fornavn || ''} ${ansatt.etternavn || ''}`.trim()}</h2>

      <div className="bobleDetalj">
        {rediger ? (
          <>
            <input
              type="text"
              value={fornavn}
              onChange={(e) => setFornavn(e.target.value)}
              placeholder={t('ansatt.fornavn')}
              className="inputfelt"
            />
            <input
              type="text"
              value={etternavn}
              onChange={(e) => setEtternavn(e.target.value)}
              placeholder={t('ansatt.etternavn')}
              className="inputfelt"
            />
            <input
              type="text"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              placeholder={t('ansatt.telefon')}
              className="inputfelt"
            />
            <button onClick={lagreEndringer} className="gronnKnapp">{t('knapp.lagre')}</button>
            <button onClick={() => setRediger(false)} className="secondaryKnapp">{t('knapp.avbryt')}</button>
          </>
        ) : (
          <>
            <p><strong>{t('ansatt.fornavn')}:</strong> {ansatt.fornavn}</p>
            <p><strong>{t('ansatt.etternavn')}:</strong> {ansatt.etternavn}</p>
            <p><strong>{t('ansatt.telefon')}:</strong> {ansatt.telefon}</p>
            <p><strong>{t('ansatt.epost')}:</strong> {ansatt.epost}</p>
            <p><strong>{t('ansatt.rolle')}:</strong> {ansatt.rolle}</p>
            <button onClick={() => setRediger(true)} className="blaKnapp">{t('knapp.rediger')}</button>
            <button onClick={() => navigate(-1)} className="secondaryKnapp">{t('knapp.tilbake')}</button>
          </>
        )}
      </div>
    </div>
  );
}
