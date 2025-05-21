import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import NyttAnlegg from './pages/NyttAnlegg';
import Anlegg from './pages/Anlegg';
import AnleggDetalj from './pages/AnleggDetalj';
import NyMelding from './pages/NyMelding';
import Meldinger from './pages/Meldinger';
import OfflineKo from './pages/OfflineKo';
import SprakVelger from './components/SprakVelger';
import './i18n';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>EasyFlow</h1>

        {/* 🌍 Språkvelger */}
        <SprakVelger />

        {/* 🔗 Navigasjon */}
        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">Hjem</Link> |{' '}
          <Link to="/anlegg">Anlegg</Link> |{' '}
          <Link to="/nytt-anlegg">Nytt anlegg</Link> |{' '}
          <Link to="/meldinger">Meldinger</Link> |{' '}
          <Link to="/ny-melding">Ny melding</Link> |{' '}
          <Link to="/offline-ko">Offline-kø</Link>
        </nav>

        <Routes>
          <Route path="/anlegg" element={<Anlegg />} />
          <Route path="/nytt-anlegg" element={<NyttAnlegg />} />
          <Route path="/anlegg/:id" element={<AnleggDetalj />} />
          <Route path="/meldinger" element={<Meldinger />} />
          <Route path="/ny-melding" element={<NyMelding />} />
          <Route path="/offline-ko" element={<OfflineKo />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
