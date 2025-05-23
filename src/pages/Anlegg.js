// src/pages/Anlegg.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HjemKnapp from '../components/HjemKnapp';
import OpprettAnleggModal from '../components/OpprettAnleggModal';
import '../styles/Anlegg.css';

export default function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [visModal, setVisModal] = useState(false);
  const [visArkiverte, setVisArkiverte] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const hentAnlegg = async () => {
      const querySnapshot = await getDocs(collection(db, 'anlegg'));
      const liste = [];
      querySnapshot.forEach((doc) => {
        liste.push({ id: doc.id, ...doc.data() });
      });

      const filtrert = liste.filter(
        (a) => !a.anleggsnummer.toString().includes('-')
      );

      filtrert.sort((a, b) => {
        const numA = parseInt(a.anleggsnummer);
        const numB = parseInt(b.anleggsnummer);
        return numB - numA;
      });

      setAnlegg(filtrert);
    };

    hentAnlegg();
  }, [visModal]);

  const statusEmoji = (status, arkivert) => {
    if (arkivert) return '📦';
    switch (status) {
      case 'Nytt anlegg':
        return '🆕';
      case 'Under arbeid':
        return '🛠️';
      case 'Til kontroll':
        return '🔍';
      case 'Ferdig':
        return '✅';
      case 'Til utbedring':
        return '♻️';
      default:
        return '📁';
    }
  };

  const filtrertAnlegg = anlegg.filter(
    (a) => a.arkivert === visArkiverte
  );

  return (
    <div className="innhold">
      <h2>{t('anlegg.oversikt')}</h2>
      <HjemKnapp />
      <button onClick={() => setVisModal(true)} className="blaKnapp">
        {t('anlegg.opprettNytt')}
      </button>
      <button
        onClick={() => setVisArkiverte(!visArkiverte)}
        className="secondaryKnapp"
      >
        {visArkiverte ? t('anlegg.visAktive') : t('anlegg.visArkiverte')}
      </button>

      <div className="overskriftRad">
        <div className="kolonne liten">{t('anlegg.kolonne.anlegg')}</div>
        <div className="kolonne liten">{t('anlegg.kolonne.opprettet')}</div>
        <div className="kolonne stor">{t('anlegg.kolonne.navn')}</div>
        <div className="kolonne liten">{t('anlegg.kolonne.status')}</div>
      </div>

      {filtrertAnlegg.map((a) => (
        <Link to={`/anlegg/${a.id}`} key={a.id} className="anleggsboble">
          <div className="kolonne liten">
            <strong>{a.anleggsnummer}</strong>
          </div>
          <div className="kolonne liten">
            {a.opprettet
              ? new Date(a.opprettet).toLocaleString()
              : t('anlegg.ukjentDato')}
          </div>
          <div className="kolonne stor">
            <strong>{a.navn}</strong>
          </div>
          <div className="kolonne liten">
            {statusEmoji(a.status, a.arkivert)}
          </div>
        </Link>
      ))}

      <OpprettAnleggModal vis={visModal} onLukk={() => setVisModal(false)} />
    </div>
  );
}
