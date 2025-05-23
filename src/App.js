import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Anlegg from './pages/Anlegg';
import AnleggDetalj from './pages/AnleggDetalj';
import NyttAnlegg from './pages/NyttAnlegg';
import NyMelding from './pages/NyMelding';
import Meldinger from './pages/Meldinger';
import OfflineKo from './pages/OfflineKo';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

function App() {
  const [user, setUser] = useState(null);
  const { i18n, t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anlegg" element={<Anlegg />} />
        <Route path="/anlegg/:id" element={<AnleggDetalj />} />
        <Route path="/nytt-anlegg" element={<NyttAnlegg />} />
        <Route path="/ny-melding" element={<NyMelding />} />
        <Route path="/meldinger" element={<Meldinger />} />
        <Route path="/offline" element={<OfflineKo />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
