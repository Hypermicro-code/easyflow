import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useTranslation } from 'react-i18next';

function AnleggDetalj() {
  const { id } = useParams();
  const [anlegg, setAnlegg] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const hentAnlegg = async () => {
      const docRef = doc(db, 'anlegg', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAnlegg({ id: docSnap.id, ...docSnap.data() });
      }
    };
    hentAnlegg();
  }, [id]);

  const handleTilbake = () => {
    if (anlegg?.anleggsnummer.toString().includes('-')) {
      const hovednummer = anlegg.anleggsnummer.toString().split('-')[0];
      const hoved = anlegg.hovedanleggId;
      navigate(`/anlegg/${hoved}`);
    } else {
      navigate('/anlegg');
    }
  };

  if (!anlegg) return <p>Laster...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('anleggDetalj.tittel')}</h1>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>🏠 Hjem</button>{' '}
        <button onClick={handleTilbake}>🔙 {t('anleggDetalj.tilbake')}</button>
      </div>

      <p><strong>{t('anleggDetalj.anleggsnummer')}:</strong> {anlegg.anleggsnummer}</p>
      <p><strong>{t('anleggDetalj.navn')}:</strong> {anlegg.navn}</p>
      <p><strong>{t('anleggDetalj.opprettet')}:</strong> {anlegg.opprettet}</p>
      <p><strong>{t('anleggDetalj.status')}:</strong> {anlegg.status}</p>

      {/* Her kommer evt. bildeopplasting, gallerier, underanlegg osv. */}
    </div>
  );
}

export default AnleggDetalj;
