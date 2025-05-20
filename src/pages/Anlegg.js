import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';
import { useNavigate } from 'react-router-dom';

function Anlegg() {
  const [anlegg, setAnlegg] = useState([]);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const fetchAnlegg = async () => {
    const anleggCol = collection(db, 'anlegg');
    const anleggSnapshot = await getDocs(anleggCol);
   const anleggList = anleggSnapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .filter(a => !a.arkivert);

    // Sorter etter anleggsnummer (synkende)
    anleggList.sort((a, b) => (b.anleggsnummer || 0) - (a.anleggsnummer || 0));
    setAnlegg(anleggList);
  };

  useEffect(() => {
    fetchAnlegg();
  }, []);

const statusEmoji = (status) => {
  const s = status?.toLowerCase();
  if (s === 'nytt anlegg') return '🆕';
  if (s === 'under arbeid') return '🛠️';
  if (s === 'til kontroll') return '🔍';
  if (s === 'ferdig') return '✅';
  if (s === 'til utbedring') return '⚠️';
  return '⚪️';
};

  return (
    <div style={{ padding: '20px' }}>
      <h1>Anleggsliste</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {anlegg.map(a => (
          <li
            key={a.id}
            onClick={() => navigate(`/anlegg/${a.id}`)}
            style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '1.05em',
              lineHeight: '1.6',
              cursor: 'pointer'
            }}
          >
            <strong>{a.anleggsnummer}</strong> – {a.navn}<br />
            {statusEmoji(a.status)} {a.status}<br />
            {a.opprettet && (
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                Opprettet: {new Date(a.opprettet).toLocaleString()}
              </div>
            )}
          </li>
        ))}
      </ul>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default Anlegg;
