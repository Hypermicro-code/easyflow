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
  }, []);// Endringer for å integrere AdminDashboard og opprette admin automatisk første gang
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Anlegg from './pages/Anlegg';
import AnleggDetalj from './pages/AnleggDetalj';
import NyttAnlegg from './pages/NyttAnlegg';
import NyMelding from './pages/NyMelding';
import Meldinger from './pages/Meldinger';
import OfflineKo from './pages/OfflineKo';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { auth, db } from './firebase';
import { signOut, onAuthStateChanged, getAuth } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { doc, getDocs, collection, addDoc, query, where } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [rolle, setRolle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const snapshot = await getDocs(collection(db, 'brukere'));
        const bruker = snapshot.docs.find(doc => doc.data().uid === currentUser.uid);

        if (!bruker) {
          await addDoc(collection(db, 'brukere'), {
            uid: currentUser.uid,
            epost: currentUser.email,
            rolle: 'admin' // 🚀 kun første gang du logger inn
          });
          setRolle('admin');
        } else {
          setRolle(bruker.data().rolle || 'felt');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSprak = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('sprak', e.target.value);
  };

  if (loading) return <div style={{ padding: '30px' }}>Laster inn...</div>;
  if (!user) return <Login />;

  return (
    <div>
      <header style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/">{t('nav.hjem')}</Link>
            <Link to="/anlegg">{t('nav.anlegg')}</Link>
            <Link to="/ny-melding">{t('nav.nyMelding')}</Link>
            <Link to="/meldinger">{t('nav.meldinger')}</Link>
            <Link to="/offline">{t('nav.offlineKo')}</Link>
            {rolle === 'admin' && <Link to="/admin">Admin</Link>}
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select onChange={handleSprak} value={i18n.language}>
              <option value="no">Norsk</option>
              <option value="en">English</option>
            </select>
            <button onClick={handleLogout}>{t('knapp.loggUt')}</button>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anlegg" element={<Anlegg />} />
        <Route path="/anlegg/:id" element={<AnleggDetalj />} />
        <Route path="/nytt-anlegg" element={<NyttAnlegg />} />
        <Route path="/ny-melding" element={<NyMelding />} />
        <Route path="/meldinger" element={<Meldinger />} />
        <Route path="/offline" element={<OfflineKo />} />
        <Route
          path="/admin"
          element={rolle === 'admin' ? <AdminDashboard authInstance={getAuth()} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;


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
