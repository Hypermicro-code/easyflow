// src/pages/AnsattDetalj.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import HjemKnapp from '../components/HjemKnapp';

export default function AnsattDetalj() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [ansatt, setAnsatt] = useState(null);
  const [rediger, setRediger] = useState(false);
  const [nyttPassord, setNyttPassord] = useState('');

  useEffect(() => {
    const hentAnsatt = async () => {
      const ref = doc(db, 'brukere', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAnsatt({ id: snap.id, ...snap.data() });
      }
    };
    hentAnsatt();
  }, [id]);

  const genererPassord = () => {
    const tegn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pwd = '';
    for (let i = 0; i < 10; i++) {
      pwd += tegn.charAt(Math.floor(Math.random() * tegn.length));
    }
    setNyttPassord(pwd);
  };

  const handleLagre = async () => {
    if (ansatt) {
      const ref = doc(db, 'brukere', id);
      await updateDoc(ref, {
        navn: ansatt.navn,
        telefon: ansatt.telefon,
      });
      setRediger(false);
    }
  };

  const handleEndring = (felt, verdi) => {
    setAnsatt((prev) => ({ ...prev, [felt]: verdi }));
  };

  if (!ansatt) return <div>Laster...</div>;

  return (
    <div className="innhold">
      <h2>{ansatt.navn}</h2>
      <HjemKnapp />

      {!rediger ? (
        <>
          <p><strong>Telefon:</strong> {ansatt.telefon}</p>
          <p><strong>E-post:</strong> {ansatt.epost}</p>
          <p><strong>Rolle:</strong> {ansatt.rolle}</p>
          <button onClick={() => setRediger(true)} className="secondaryKnapp">
            Rediger informasjon
          </button>
        </>
      ) : (
        <>
          <label>Navn:
            <input type="text" value={ansatt.navn} onChange={(e) => handleEndring('navn', e.target.value)} />
          </label>
          <label>Telefon:
            <input type="text" value={ansatt.telefon} onChange={(e) => handleEndring('telefon', e.target.value)} />
          </label>
          <button onClick={handleLagre} className="blaKnapp">Lagre</button>
        </>
      )}

      <div style={{ marginTop: '20px' }}>
        <h4>Rolle: {ansatt.rolle}</h4>
        <h4>Generer nytt passord:</h4>
        <button onClick={genererPassord} className="blaKnapp">Generer passord</button>
        {nyttPassord && <p><strong>Generert passord:</strong> {nyttPassord}</p>}
      </div>

      <button onClick={() => navigate(-1)} className="secondaryKnapp" style={{ marginTop: '20px' }}>
        Tilbake
      </button>
    </div>
  );
}
