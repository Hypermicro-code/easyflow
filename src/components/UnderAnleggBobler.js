import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function UnderAnleggBobler({ hovednummer, gjeldendeId }) {
  const [underAnlegg, setUnderAnlegg] = useState([]);

  useEffect(() => {
    const hent = async () => {
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
    hent();
  }, [hovednummer, gjeldendeId]);

  if (underAnlegg.length === 0) return null;

  return (
    <div style={{ margin: '5px 0 15px' }}>
      <strong>Underanlegg:</strong><br />
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '5px' }}>
        {underAnlegg.map(a => {
          const suffix = a.anleggsnummer.split('-')[1];
          return (
            <Link key={a.id} to={`/anlegg/${a.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '5px 10px',
                backgroundColor: '#e0e0e0',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: '#333'
              }}>
                -{suffix}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default UnderAnleggBobler;
