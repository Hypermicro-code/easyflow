import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

function AdminDashboard() {
  const { t } = useTranslation();
  const [nyEpost, setNyEpost] = useState('');
  const [rolle, setRolle] = useState('felt');
  const [brukere, setBrukere] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const hentBrukere = async () => {
      const snapshot = await getDocs(collection(db, 'brukere'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBrukere(data);
    };
    hentBrukere();
  }, []);

  const genererPassord = () => {
    return Math.random().toString(36).slice(-8);
  };

  const leggTilBruker = async () => {
    const passord = genererPassord();
    try {
      const brukerCredential = await createUserWithEmailAndPassword(auth, nyEpost, passord);
      const uid = brukerCredential.user.uid;
      await addDoc(collection(db, 'brukere'), {
        uid,
        epost: nyEpost,
        rolle
      });
      setStatus(`✅ Bruker opprettet. Midlertidig passord: ${passord}`);
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>👑 Adminpanel</h2>

      <h4>➕ Legg til bruker</h4>
      <input type="email" placeholder="E-post" value={nyEpost} onChange={(e) => setNyEpost(e.target.value)} />
      <select value={rolle} onChange={(e) => setRolle(e.target.value)}>
        <option value="kontor">Kontor</option>
        <option value="felt">Felt</option>
      </select>
      <button onClick={leggTilBruker}>Opprett</button>
      <p>{status}</p>

      <h4>👥 Eksisterende brukere</h4>
      {brukere.map((b) => (
        <div key={b.id} style={{ marginBottom: '10px' }}>
          <strong>{b.epost}</strong><br />
          <select value={b.rolle} onChange={(e) => oppdaterRolle(b.id, e.target.value)}>
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
