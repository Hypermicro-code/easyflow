// AdminDashboard.js – med forbedret listevisning
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { addDoc, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const secondaryAppConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const secondaryApp = initializeApp(secondaryAppConfig, 'Secondary');
const secondaryAuth = getAuth(secondaryApp);

function AdminDashboard() {
  const { t } = useTranslation();
  const [brukere, setBrukere] = useState([]);
  const [status, setStatus] = useState('');
  const [nyBruker, setNyBruker] = useState({
    epost: '',
    rolle: 'felt',
    fornavn: '',
    etternavn: '',
    telefon: '',
    ansattnummer: ''
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'brukere'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBrukere(data);
    });
    return () => unsubscribe();
  }, []);

  const genererPassord = () => Math.random().toString(36).slice(-8);

  const leggTilBruker = async () => {
    const passord = genererPassord();
    try {
      const brukerCredential = await createUserWithEmailAndPassword(secondaryAuth, nyBruker.epost, passord);
      const uid = brukerCredential.user.uid;
      const nyData = { uid, ...nyBruker };
      await addDoc(collection(db, 'brukere'), nyData);
      setStatus(`✅ Bruker opprettet. Midlertidig passord: ${passord}`);
      setNyBruker({ epost: '', rolle: 'felt', fornavn: '', etternavn: '', telefon: '', ansattnummer: '' });
    } catch (err) {
      console.error(err);
      setStatus('❌ Feil ved opprettelse: ' + err.message);
    }
  };

  const oppdaterRolle = async (id, nyRolle) => {
    try {
      const brukerRef = doc(db, 'brukere', id);
      await updateDoc(brukerRef, { rolle: nyRolle });
      setStatus('✅ Rolle oppdatert');
    } catch (err) {
      setStatus('❌ Klarte ikke å oppdatere rolle');
    }
  };

  const handleChange = (felt, verdi) => {
    setNyBruker(prev => ({ ...prev, [felt]: verdi }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>👑 Adminpanel</h2>

      <h4>➕ Legg til bruker</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '300px' }}>
        <input type="email" placeholder="E-post" value={nyBruker.epost} onChange={(e) => handleChange('epost', e.target.value)} />
        <input type="text" placeholder="Fornavn" value={nyBruker.fornavn} onChange={(e) => handleChange('fornavn', e.target.value)} />
        <input type="text" placeholder="Etternavn" value={nyBruker.etternavn} onChange={(e) => handleChange('etternavn', e.target.value)} />
        <input type="text" placeholder="Telefon" value={nyBruker.telefon} onChange={(e) => handleChange('telefon', e.target.value)} />
        <input type="text" placeholder="Ansattnummer" value={nyBruker.ansattnummer} onChange={(e) => handleChange('ansattnummer', e.target.value)} />
        <select value={nyBruker.rolle} onChange={(e) => handleChange('rolle', e.target.value)}>
          <option value="kontor">Kontor</option>
          <option value="felt">Felt</option>
        </select>
        <button onClick={leggTilBruker}>Opprett</button>
        <p>{status}</p>
      </div>

      <h4>👥 Eksisterende brukere</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr', fontWeight: 'bold', background: '#eee', padding: '10px', borderRadius: '10px 10px 0 0', position: 'sticky', top: 0, zIndex: 1 }}>
        <div>Ansattnr</div>
        <div>Navn</div>
        <div>E-post</div>
        <div>Rolle</div>
      </div>
      {brukere.map((b, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 1fr', alignItems: 'center', gap: '10px', padding: '10px', borderBottom: '1px solid #ddd', background: '#f9f9f9' }}>
          <div><strong>{b.ansattnummer || '-'}</strong></div>
          <div><strong>{b.fornavn || ''} {b.etternavn || ''}</strong></div>
          <div>{b.epost}</div>
          <div>
            <select value={b.rolle || 'felt'} onChange={(e) => oppdaterRolle(b.id, e.target.value)}>
              <option value="kontor">Kontor</option>
              <option value="felt">Felt</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
