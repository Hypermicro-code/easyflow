import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Anlegg from './pages/Anlegg';
import Meldinger from './pages/Meldinger';
import NyMelding from './pages/NyMelding';
import OfflineKo from './pages/OfflineKo';
import NyttAnlegg from './pages/NyttAnlegg';

function App() {
    const [offlineCount, setOfflineCount] = useState(0);

  const oppdaterOfflineTeller = () => {
    const lagret = JSON.parse(localStorage.getItem('offlineMeldinger')) || [];
    setOfflineCount(lagret.length);
  };

  useEffect(() => {
    oppdaterOfflineTeller();

    // Lytter på lagring, nett tilbake og når brukeren fokuserer vinduet
    window.addEventListener('storage', oppdaterOfflineTeller);
    window.addEventListener('online', oppdaterOfflineTeller);
    window.addEventListener('focus', oppdaterOfflineTeller);

    return () => {
      window.removeEventListener('storage', oppdaterOfflineTeller);
      window.removeEventListener('online', oppdaterOfflineTeller);
      window.removeEventListener('focus', oppdaterOfflineTeller);
    };
  }, []);
  const [offlineAnleggCount, setOfflineAnleggCount] = useState(0);

  const oppdaterOfflineAnleggTeller = () => {
    const lagret = JSON.parse(localStorage.getItem('offlineAnlegg')) || [];
    setOfflineAnleggCount(lagret.length);
  };

  useEffect(() => {
    oppdaterOfflineAnleggTeller();

    window.addEventListener('storage', oppdaterOfflineAnleggTeller);
    window.addEventListener('online', oppdaterOfflineAnleggTeller);
    window.addEventListener('focus', oppdaterOfflineAnleggTeller);

    return () => {
      window.removeEventListener('storage', oppdaterOfflineAnleggTeller);
      window.removeEventListener('online', oppdaterOfflineAnleggTeller);
      window.removeEventListener('focus', oppdaterOfflineAnleggTeller);
    };
  }, []);

  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Hjem</Link> |{' '}
        <Link to="/anlegg">Anlegg</Link> |{' '}
        <Link to="/nytt-anlegg">
    Nytt anlegg {offlineAnleggCount > 0 && (
      <span style={{ backgroundColor: 'orange', color: 'white', padding: '2px 6px', borderRadius: '12px', marginLeft: '5px' }}>
        {offlineAnleggCount}
      </span>
    )}
  </Link> |{' '}
        <Link to="/meldinger">Meldinger</Link> |{' '}
        <Link to="/ny-melding">Ny melding</Link> |{' '}
         <Link to="/offline-ko">
    Offline kø {offlineCount > 0 && (
      <span style={{ backgroundColor: 'red', color: 'white', padding: '2px 6px', borderRadius: '12px', marginLeft: '5px' }}>
        {offlineCount}
      </span>
    )}
  </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anlegg" element={<Anlegg />} />
        <Route path="/nytt-anlegg" element={<NyttAnlegg />} />
        <Route path="/meldinger" element={<Meldinger />} />
        <Route path="/ny-melding" element={<NyMelding />} />
        <Route path="/offline-ko" element={<OfflineKo />} />
      </Routes>
    </Router>
  );
}

export default App;
