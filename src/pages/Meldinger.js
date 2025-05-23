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
      liste.sort((a, b) => new Date(b.opprettet) - new Date(a.opprettet));
      setMeldinger(liste);
    };
    hentMeldinger();
  }, []);

  const slettMelding = async (id) => {
    await deleteDoc(doc(db, 'meldinger', id));
    setMeldinger(meldinger.filter((m) => m.id !== id));
  };

  return (
    <div className="innhold">
      <h2>{t('meldinger.oversikt')}</h2>
      <HjemKnapp />

      <div className="overskriftRad">
        <div className="kolonne stor">{t('meldinger.kolonne.melding')}</div>
        <div className="kolonne liten">{t('meldinger.kolonne.anlegg')}</div>
        <div className="kolonne liten">{t('meldinger.kolonne.opprettet')}</div>
        <div className="kolonne liten">{t('meldinger.kolonne.slett')}</div>
      </div>

      {meldinger.map((melding) => (
        <div key={melding.id} className="bobleliste">
          <div className="kolonne stor">{melding.tekst}</div>
          <div className="kolonne liten">{melding.anleggsnummer}</div>
          <div className="kolonne liten">
            {melding.opprettet?.split('T')[0] ?? ''}
          </div>
          <div className="kolonne liten">
            <button
              onClick={() => slettMelding(melding.id)}
              className="rødKnapp"
            >
              {t('knapp.slett')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
