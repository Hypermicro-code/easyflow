// src/pages/Meldinger.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import HjemKnapp from '../components/HjemKnapp';
import '../App.css'; // felles stil

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

  const formatDato = (datoStr) => {
    try {
      const dato = new Date(datoStr);
      return dato.toLocaleDateString('no-NO');
    } catch {
      return datoStr;
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
      </div>

      {meldinger.map((m) => (
        <div key={m.id} className="anleggsboble" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="kolonne stor">{m.tekst}</div>
          <div className="kolonne liten">{m.anleggsnummer}</div>
          <div className="kolonne liten">{formatDato(m.opprettet)}</div>
          <div style={{ marginLeft: 'auto', paddingRight: '8px' }}>
            <button onClick={() => slettMelding(m.id)} className="rødKnapp" style={{ padding: '4px 8px' }}>
              {t('knapp.slett')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
