// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import OpprettAnsattModal from '../components/OpprettAnsattModal';
import HjemKnapp from '../components/HjemKnapp';
import '../App.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [brukere, setBrukere] = useState([]);
  const [visModal, setVisModal] = useState(false);

  useEffect(() => {
    const hentBrukere = async () => {
      const querySnapshot = await getDocs(collection(db, 'brukere'));
      const liste = [];
      querySnapshot.forEach((doc) => {
        liste.push({ id: doc.id, ...doc.data() });
      });
      setBrukere(liste);
    };

    hentBrukere();
  }, [visModal]);

  const håndterOpprett = async (nyBruker) => {
    try {
      await addDoc(collection(db, 'brukere'), nyBruker);
      setVisModal(false);
    } catch (err) {
      console.error('❌ Feil ved opprettelse av bruker:', err);
    }
  };

  return (
    <div className="innhold">
      <h2>{t('admin.overskrift')}</h2>
      <HjemKnapp />
      <button className="blaKnapp" onClick={() => setVisModal(true)}>
        {t('admin.leggTilAnsatt')}
      </button>

      <div className="overskriftRad">
        <div className="kolonne liten">ID</div>
        <div className="kolonne stor">{t('admin.navn')}</div>
        <div className="kolonne stor">{t('admin.epost')}</div>
        <div className="kolonne liten">{t('admin.telefon')}</div>
        <div className="kolonne liten">{t('admin.rolle')}</div>
      </div>

      {brukere.map((b) => (
        <div className="bobleliste" key={b.id}>
          <div className="kolonne liten">{b.ansattnummer || b.id.slice(0, 6)}</div>
          <div className="kolonne stor">
            {b.fornavn} {b.etternavn}
          </div>
          <div className="kolonne stor">{b.epost}</div>
          <div className="kolonne liten">{b.telefon}</div>
          <div className="kolonne liten">{b.rolle}</div>
        </div>
      ))}

      <OpprettAnsattModal
        vis={visModal}
        onLukk={() => setVisModal(false)}
        onBekreft={håndterOpprett}
      />
    </div>
  );
}
