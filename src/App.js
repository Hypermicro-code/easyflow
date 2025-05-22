// Endringer for å integrere AdminDashboard og opprette admin automatisk første gang
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
import { signOut, onAuthStateChanged } from 'firebase/auth';
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
            <Link to="/nytt-anlegg">{t('nav.nyttAnlegg')}</Link>
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
          element={rolle === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
