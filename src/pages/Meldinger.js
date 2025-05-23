// src/pages/Meldinger.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import HjemKnapp from '../components/HjemKnapp';
import '../App.css';

export default function Meldinger() {
  const [meldinger, setMeldinger] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const hentMeldinger = async () => {
      const querySnapshot = await getDocs(collection(db, 'meldinger'));
      const liste = [];
      querySnapshot.forEach((doc) => {
        liste.push({ id: doc.id, ...doc.data() });
      });

      liste.sort((a, b) => (b.opprettet || '').localeCompare(a.opprettet || ''));
      setMeldinger(liste);
    };

    hentMeldinger();
  }, []);

  const slettMelding = async (id) => {
    await deleteDoc(doc(db, 'meldinger', id));
    setMeldinger((prev) => prev.filter((m) => m.id !== id));
  };

  const formatDato = (isoDato) => {
    try {
      return new Date(isoDato).toISOString().split('T')[0];
    } catch {
      return isoDato;
    }
  };

  return (
    <div className="innhold">
      <h2>{t('meldinger.oversikt')}</h2>
      <HjemKnapp />

      <div className="overskriftRad">
        <div className="kolonne stor">{t('meldinger.kolonne.melding')}</div>
        <div className="kolonne liten">{t('meldinger.kolonne.anlegg')}</div>
        <div className="kolonne liten">{t('meldinger.kolonne.dato')}</div>
        <div className="kolonne liten">{t('meldinger.kolonne.knapp')}</div>
      </div>

      {meldinger.map((m) => (
        <div className="boble" key={m.id}>
          <div className="kolonne stor">{m.tekst}</div>
          <div className="kolonne liten">{m.anleggsnummer || '-'}</div>
          <div className="kolonne liten">{formatDato(m.opprettet)}</div>
          <div className="kolonne liten">
            <button className="rødKnapp" onClick={() => slettMelding(m.id)}>
              {t('knapp.slett')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
