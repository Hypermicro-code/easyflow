import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';

function NyMelding() {
  const [melding, setMelding] = useState('');
  const [anleggsnummer, setAnleggsnummer] = useState('');
  const [anleggsnumre, setAnleggsnumre] = useState([]);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const hentAnlegg = async () => {
      const querySnapshot = await getDocs(collection(db, 'anlegg'));
      const numre = querySnapshot.docs
        .map((doc) => doc.data().anleggsnummer)
        .filter((nummer) => !!nummer);
      setAnleggsnumre(numre);
    };
    hentAnlegg();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!melding || !anleggsnummer) {
      setToast(t('nyMelding.utfylling'));
      return;
    }

    await addDoc(collection(db, 'meldinger'), {
      melding,
      anleggsnummer,
      tidspunkt: new Date().toISOString()
    });

    setToast(t('nyMelding.lagret'));
    setMelding('');
    setAnleggsnummer('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('nyMelding.tittel')}</h1>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>🏠 Hjem</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>{t('nyMelding.anleggsnummer')}</label><br />
          <select value={anleggsnummer} onChange={(e) => setAnleggsnummer(e.target.value)}>
            <option value="">{t('nyMelding.velg')}</option>
            {anleggsnumre.map((nr, idx) => (
              <option key={idx} value={nr}>{nr}</option>
            ))}
          </select>
        </div>
        <div>
          <label>{t('nyMelding.melding')}</label><br />
          <textarea value={melding} onChange={(e) => setMelding(e.target.value)} />
        </div>
        <button type="submit">{t('knapp.lagre')}</button>
      </form>

      {toast && <Toast melding={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default NyMelding;
