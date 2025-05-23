// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import HjemKnapp from '../components/HjemKnapp';
import NavnModal from '../components/NavnModal';
import '../App.css';

export default function AdminDashboard() {
  const [brukere, setBrukere] = useState([]);
  const [visModal, setVisModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const hentBrukere = async () => {
      const querySnapshot = await getDocs(collection(db, 'brukere'));
      const liste = [];
      querySnapshot.forEach((doc) => {
        liste.push({ id: doc.id, ...doc.data() });
      });

      // Sorter etter etternavn og fornavn
      liste.sort((a, b) =>
        (a.etternavn || '').localeCompare(b.etternavn || '') ||
        (a.fornavn || '').localeCompare(b.fornavn || '')
      );

      setBrukere(liste);
    };

    hentBrukere();
  }, [visModal]);

  const slettBruker = async (id) => {
    const bekreft = window.confirm(t('bekreft.slettBruker'));
    if (bekreft) {
      await deleteDoc(doc(db, 'brukere', id));
      setBrukere(brukere.filter((b) => b.id !== id));
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
        <div className="kolonne stor">{t('admin.kolonne.fornavn')}</div>
        <div className="kolonne stor">{t('admin.kolonne.etternavn')}</div>
        <div className="kolonne stor">{t('admin.kolonne.epost')}</div>
        <div className="kolonne liten">{t('admin.kolonne.telefon')}</div>
        <div className="kolonne liten">{t('admin.kolonne.rolle')}</div>
        <div className="kolonne liten">{t('admin.kolonne.handling')}</div>
      </div>

      {brukere.map((b) => (
        <div key={b.id} className="anleggsboble">
          <div className="kolonne stor"><strong>{b.fornavn || '-'}</strong></div>
          <div className="kolonne stor"><strong>{b.etternavn || '-'}</strong></div>
          <div className="kolonne stor">{b.epost}</div>
          <div className="kolonne liten">{b.telefon || '-'}</div>
          <div className="kolonne liten">{b.rolle}</div>
          <div className="kolonne liten">
            <button
              onClick={() => slettBruker(b.id)}
              className="rødKnapp litenKnapp"
            >
              {t('knapp.slett')}
            </button>
          </div>
        </div>
      ))}

      <NavnModal vis={visModal} onLukk={() => setVisModal(false)} />
    </div>
  );
}
