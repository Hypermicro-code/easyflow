// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';
import OpprettAnsattModal from '../components/OpprettAnsattModal';
import HjemKnapp from '../components/HjemKnapp';
import { Link } from 'react-router-dom';
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

  const rolleEmoji = (rolle) => {
    switch (rolle) {
      case 'admin':
        return '👑';
      case 'kontor':
        return '🧑‍💼';
      case 'felt':
        return '👷';
      default:
        return '❓';
    }
  };

  return (
    <div className="innhold">
      <h2>{t('admin.overskrift')}</h2>
      <HjemKnapp />
      <button onClick={() => setVisModal(true)} className="blaKnapp">
        {t('admin.opprett')}
      </button>

      <div className="overskriftRad">
        <div className="kolonne stor">{t('admin.kolonne.navn')}</div>
        <div class
