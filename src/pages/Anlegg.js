// Anlegg.js – med "Opprett nytt anlegg" som modal
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BekreftModal from '../components/BekreftModal';

function Anlegg() {
  const { t } = useTranslation();
  const [anlegg, setAnlegg] = useState([]);
  const [visModal, setVisModal] = useState(false);
  const [nyttNavn, setNyttNavn] = useState('');
  const [nyStatus, setNyStatus] = useState('Nytt anlegg');
  const navigate = useNavigate();

  useEffect(() => {
    const hentAnlegg = async () => {
      const q = query(collection(db, 'anlegg'), orderBy('anleggsnummer', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnlegg(data.filter(a => !a.arkivert && !a.anleggsnummer.toString().includes('-')));
    };
    hentAnlegg();
  }, []);

  const finnNesteAnleggsnummer = () => {
    const numre = anlegg.map(a => parseInt(a.anleggsnummer)).filter(n => !isNaN(n));
    return numre.length > 0 ? Math.max(...numre) + 1 : 1;
  };

  const opprettAnlegg = async () => {
    const nyttAnleggsnummer = finnNesteAnleggsnummer();
    await addDoc(collection(db, 'anlegg'), {
      navn: nyttNavn,
      status: nyStatus,
      anleggsnummer: nyttAnleggsnummer,
      opprettet: new Date().toISOString(),
      arkivert: false
    });
    setVisModal(false);
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Oversikt over anlegg</h2>
      <button onClick={() => setVisModal(true)} style={{ marginBottom: '20px' }}>➕ Opprett nytt anlegg</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', fontWeight: 'bold', background: '#eee', padding: '10px', borderRadius: '10px 10px 0 0' }}>
        <div>Anlegg</div>
        <div>Opprettet</div>
        <div>Navn</div>
        <div>Status</div>
      </div>
      {anlegg.map((a) => (
        <div
          key={a.id}
          onClick={() => navigate(`/anlegg/${a.id}`)}
          style={{ cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', padding: '10px', borderBottom: '1px solid #ddd', background: '#f9f9f9' }}>
          <div><strong>{a.anleggsnummer}</strong></div>
          <div>{new Date(a.opprettet).toLocaleDateString()}</div>
          <div><strong>{a.navn}</strong></div>
          <div>{a.status === 'Ferdig' ? '✅' : a.status === 'Til utbedring' ? '🛠️' : a.status === 'Til kontroll' ? '🔍' : a.status === 'Under arbeid' ? '🚧' : '🆕'}</div>
        </div>
      ))}

      <BekreftModal
        vis={visModal}
        tittel="Opprett nytt anlegg"
        onLukk={() => setVisModal(false)}
        onBekreft={opprettAnlegg}
        bekreftTekst="Opprett"
        avbrytTekst="Avbryt"
      >
        <input type="text" placeholder="Angi anleggsnavn" value={nyttNavn} onChange={(e) => setNyttNavn(e.target.value)} />
        <select value={nyStatus} onChange={(e) => setNyStatus(e.target.value)}>
          <option value="Nytt anlegg">Nytt anlegg</option>
          <option value="Under arbeid">Under arbeid</option>
          <option value="Til kontroll">Til kontroll</option>
          <option value="Ferdig">Ferdig</option>
          <option value="Til utbedring">Til utbedring</option>
        </select>
      </BekreftModal>
    </div>
  );
}

export default Anlegg;
