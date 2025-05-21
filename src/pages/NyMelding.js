import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';

function NyMelding() {
  const { t } = useTranslation();
  const [tekst, setTekst] = useState('');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [alleAnlegg, setAlleAnlegg] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const hentAnlegg = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'anlegg'));
        const liste = snapshot.docs
          .map(doc => doc.data().anleggsnummer)
          .filter(nr => !!nr)
          .sort((a, b) => b - a);
        setAlleAnlegg(liste);
        if (liste.length > 0) setAnleggsnummer(liste[0]);
      } catch (error) {
        console.error('Kunne ikke hente anlegg:', error);
      }
    };

    hentAnlegg();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const melding = {
      tekst,
      anleggsnummer: parseInt(anleggsnummer),
      opprettet: new Date().toISOString()
    };

    if (navigator.onLine) {
      try {
        await addDoc(collection(db, 'meldinger'), melding);
        setToast(t('nyMelding.sendt'));
      } catch (error) {
        console.error('Feil ved sending:', error);
        setToast('Feil ved sending av melding');
      }
    } else {
      const offline = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
      offline.push(melding);
      localStorage.setItem('offlineMeldinger', JSON.stringify(offline));
      setToast(t('nyMelding.lokal'));
    }

    setTekst('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('nyMelding.tittel')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('nyMelding.anleggsnummer')}:</label><br />
          <select value={anleggsnummer} onChange={(e) => setAnleggsnummer(e.target.value)} required>
            {alleAnlegg.map((nr, i) => (
              <option key={i} value={nr}>{nr}</option>
            ))}
          </select>
        </div>
        <div>
          <label>{t('nyMelding.melding')}:</label><br />
          <textarea
            value={tekst}
            onChange={(e) => setTekst(e.target.value)}
            rows={5}
            cols={40}
            required
          />
        </div>
        <button type="submit">{t('nyMelding.send')}</button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyMelding;
