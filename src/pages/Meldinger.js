import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';

function Meldinger() {
  const [meldinger, setMeldinger] = useState([]);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [meldingSomSkalSlettes, setMeldingSomSkalSlettes] = useState(null);

  const hentMeldinger = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'meldinger'));
      const liste = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeldinger(liste.sort((a, b) => new Date(b.opprettet) - new Date(a.opprettet)));
    } catch (error) {
      console.error('Feil ved henting av meldinger:', error);
    }
  };

  useEffect(() => {
    hentMeldinger();
  }, []);

  const slettMelding = async (id) => {
    try {
      await deleteDoc(doc(db, 'meldinger', id));
      setToast('Melding slettet');
      hentMeldinger();
    } catch (error) {
      console.error('Feil ved sletting:', error);
      setToast('Feil ved sletting');
    }
    setVisModal(false);
    setMeldingSomSkalSlettes(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meldinger</h1>
      {meldinger.length === 0 ? (
        <p>Ingen meldinger tilgjengelig</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {meldinger.map((m) => (
            <li key={m.id} style={{
              marginBottom: '20px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div><strong>Anleggsnummer:</strong> {m.anleggsnummer}</div>
              <div><strong>Melding:</strong><br />{m.tekst}</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {m.opprettet && (
                  <>Opprettet: {new Date(m.opprettet).toLocaleString()}</>
                )}
              </div>
              <button
                onClick={() => {
                  setMeldingSomSkalSlettes(m);
                  setVisModal(true);
                }}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Slett
              </button>
            </li>
          ))}
        </ul>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      {visModal && (
        <BekreftModal
          vis={visModal}
          melding={`Slette melding tilknyttet anlegg ${meldingSomSkalSlettes?.anleggsnummer}?`}
          onBekreft={() => slettMelding(meldingSomSkalSlettes.id)}
          onAvbryt={() => {
            setVisModal(false);
            setMeldingSomSkalSlettes(null);
          }}
        />
      )}
    </div>
  );
}

export default Meldinger;
