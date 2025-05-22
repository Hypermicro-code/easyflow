import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Anlegg from './pages/Anlegg';
import AnleggDetalj from './pages/AnleggDetalj';
import NyttAnlegg from './pages/NyttAnlegg';
import NyMelding from './pages/NyMelding';
import Meldinger from './pages/Meldinger';
import OfflineKo from './pages/OfflineKo';
import Home from './pages/Home';
import Login from './pages/Login';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSpråk = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('språk', e.target.value);
  };

  if (loading) {
    return <div style={{ padding: '30px' }}>⏳ Laster inn...</div>;
  }

  if (!user) {
    return <Login />;
  }

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
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select onChange={handleSpråk} value={i18n.language}>
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
      </Routes>
    </div>
  );
}

export default App;
