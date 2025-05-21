import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';

function NyttAnlegg() {
  const { t } = useTranslation();
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('Nytt anlegg');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const anlegg = {
      navn,
      status,
      anleggsnummer: parseInt(anleggsnummer),
      opprettet: new Date().toISOString()
    };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'anlegg'), anlegg);
        setToast(t('nyttAnlegg.lagret'));
      } catch (error) {
        console.error('Feil ved lagring av anlegg: ', error);
        setToast(t('feil.lagring'));
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
      lagret.push(anlegg);
      localStorage.setItem('offlineAnlegg', JSON.stringify(lagret));
      setToast(t('feil.offlineLagret'));
    }

    setNavn('');
    setStatus('Nytt anlegg');
    setAnleggsnummer('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('nyttAnlegg.tittel')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('nyttAnlegg.navn')}:</label><br />
          <input
            type='text'
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('nyttAnlegg.status')}:</label><br />
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option>{t('status.nytt')}</option>
            <option>{t('status.underArbeid')}</option>
            <option>{t('status.tilKontroll')}</option>
            <option>{t('status.ferdig')}</option>
            <option>{t('status.tilUtbedring')}</option>
          </select>
        </div>
        <div>
          <label>{t('nyttAnlegg.anleggsnummer')}:</label><br />
          <input
            type='number'
            value={anleggsnummer}
            onChange={(e) => setAnleggsnummer(e.target.value)}
            required
          />
        </div>
        <button type='submit'>{t('nyttAnlegg.knapp')}</button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyttAnlegg;
