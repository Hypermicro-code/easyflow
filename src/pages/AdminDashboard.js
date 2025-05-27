// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import OpprettAnsattModal from '../components/OpprettAnsattModal';
import HjemKnapp from '../components/HjemKnapp';
import '../App.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [brukere, setBrukere] = useState([]);
  const [visModal, setVisModal] = useState(false);

  useEffect(() => {
    const hentBrukere = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'brukere'));
        const liste = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          liste.push({ id: doc.id, ...data });
        });

        // Sorter alfabetisk etter fornavn + etternavn
        liste.sort((a, b) => {
          const navnA = (a.fornavn + a.etternavn).toLowerCase();
          const navnB = (b.fornavn + b.etternavn).toLowerCase();
          return navnA.localeCompare(navnB);
        });

        setBrukere(liste);
      } catch (error) {
        console.error('🚨 Feil ved henting av brukere:', error);
      }
    };

    hentBrukere();
  }, [visModal]);

  const rolleEmoji = (rolle) => {
    switch (rolle) {
      case 'admin':
        return '🛡️';
      case 'kontor':
        return '💼';
      case 'felt':
        return '🧰';
      default:
        return '❔';
    }
  };

  return (
    <div className="innhold">
      <h2>{t('admin.overskrift')}</h2>
      <HjemKnapp />

      <button onClick={() => setVisModal(true)} className="blaKnapp">
        {t('admin.leggTil')}
      </button>

      <div className="overskriftRad">
        <div className="kolonne stor">{t('admin.kolonne.navn')}</div>
        <div className="kolonne stor">{t('admin.kolonne.telefon')}</div>
        <div className="kolonne stor">{t('admin.kolonne.epost')}</div>
        <div className="kolonne liten">{t('admin.kolonne.rolle')}</div>
      </div>

      {brukere.map((b) => (
        <Link to={`/ansatt/${b.id}`} key={b.id} className="bobleliste">
          <div className="kolonne stor">
            <strong>{b.fornavn} {b.etternavn}</strong>
          </div>
          <div className="kolonne stor">{b.telefon || '—'}</div>
          <div className="kolonne stor">{b.epost || '—'}</div>
          <div className="kolonne liten">{rolleEmoji(b.rolle)}</div>
        </Link>
      ))}

      <OpprettAnsattModal vis={visModal} onLukk={() => setVisModal(false)} />
    </div>
  );
}
