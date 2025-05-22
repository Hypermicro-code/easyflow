// AdminDashboard.js med sekundær Firebase-app og ekstra felter
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

// Sekundær Firebase-app for å unngå at admin logges ut
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

  const hentBrukere = async () => {
    const snapshot = await getDocs(collection(db, 'brukere'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBrukere(data);
  };

  useEffect(() => {
    hentBrukere();
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
      await hentBrukere();
    } catch (err) {
      console.error(err);
      setStatus('❌ Feil ved opprettelse: ' + err.message);
    }
  };

  const oppdaterRolle = async (id, nyRolle) => {
    try {
      const brukerRef = doc(db, 'brukere', id);
      await updateDoc(brukerRef, { rolle: nyRolle });
      setBrukere(brukere.map(b => b.id === id ? { ...b, rolle: nyRolle } : b));
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

      <h4>👥 Eksisterende brukere</h4>
      {brukere.map((b, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <strong>{b.fornavn || ''} {b.etternavn || ''}</strong> – {b.epost}<br />
          <em>Telefon:</em> {b.telefon || '-'} | <em>Ansatt:</em> {b.ansattnummer || '-'}<br />
          <select value={b.rolle || 'felt'} onChange={(e) => oppdaterRolle(b.id, e.target.value)}>
            <option value="kontor">Kontor</option>
            <option value="felt">Felt</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
