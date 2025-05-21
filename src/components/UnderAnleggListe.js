import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function UnderAnleggListe({ hovednummer, gjeldendeId }) {
  const { t } = useTranslation();
  const [underAnlegg, setUnderAnlegg] = useState([]);

  useEffect(() => {
    const hentUnderAnlegg = async () => {
      const snapshot = await getDocs(collection(db, 'anlegg'));
      const filtrert = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(a =>
          a.anleggsnummer?.toString().startsWith(`${hovednummer}-`) &&
          a.id !== gjeldendeId
        )
        .sort((a, b) => a.anleggsnummer.localeCompare(b.anleggsnummer));
      setUnderAnlegg(filtrert);
    };
    hentUnderAnlegg();
  }, [hovednummer, gjeldendeId]);

  if (underAnlegg.length === 0) return null;

  return (
    <div style={{ margin: '20px 0' }}>
      <h4>{t('anleggDetalj.underanlegg')}</h4>
      {underAnlegg.map((a) => (
        <Link key={a.id} to={`/anlegg/${a.id}`}>
          <button style={{ marginRight: '10px', marginBottom: '5px' }}>
            {a.anleggsnummer} – {a.navn}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default UnderAnleggListe;
