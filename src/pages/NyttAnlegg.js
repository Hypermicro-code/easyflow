import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';

function NyttAnlegg() {
  const { t } = useTranslation();
  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('Nytt anlegg');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [toast, setToast] = useState('');

  // Hent høyeste eksisterende anleggsnummer
  useEffect(() => {
    const hentNesteNummer = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'anlegg'));
        const alleNumre = snapshot.docs
          .map(doc => doc.data().anleggsnummer)
          .filter(nr => typeof nr === 'number');
        const max = alleNumre.length > 0 ? Math.max(...alleNumre) : 0;
        setAnleggsnummer(max + 1);
      } catch (error) {
        console.error('Feil ved generering av nytt nummer:', error);
      }
    };

    hentNesteNummer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nytt = {
      navn,
      status,
      anleggsnummer: parseInt(anleggsnummer),
      opprettet: new Date().toISOString(),
      arkivert: false
    };

    if (navigator.onLine) {
      try {
        // Dobbeltsjekk at nummer ikke er i bruk
        const snapshot = await getDocs(collection(db, 'anlegg'));
        const finnes = snapshot.docs.some(doc => doc.data().anleggsnummer === nytt.anleggsnummer);
        if (finnes) {
          setToast(t('nyttAnlegg.duplikat'));
          return;
        }

        await addDoc(collection(db, 'anlegg'), nytt);
        setToast(t('nyttAnlegg.lagret'));
        setNavn('');
        setStatus('Nytt anlegg');
        setAnleggsnummer(nytt.anleggsnummer + 1); // klargjør neste
      } catch (error) {
        console.error('Feil ved lagring:', error);
        setToast(t('feil.lagring'));
      }
    } else {
      const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
      lagret.push(nytt);
      localStorage.setItem('offlineAnlegg', JSON.stringify(lagret));
      setToast(t('feil.offlineLagret'));
      setNavn('');
      setStatus('Nytt anlegg');
      setAnleggsnummer(anleggsnummer + 1);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('nyttAnlegg.tittel')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('nyttAnlegg.anleggsnummer')}:</label><br />
          <input
            type='number'
            value={anleggsnummer}
            readOnly
            style={{ backgroundColor: '#eee' }}
          />
        </div>
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
        <button type='submit'>{t('nyttAnlegg.knapp')}</button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyttAnlegg;
