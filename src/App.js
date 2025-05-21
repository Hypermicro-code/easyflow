import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NyttAnlegg from './pages/NyttAnlegg';
import Anlegg from './pages/Anlegg';
import AnleggDetalj from './pages/AnleggDetalj';
import NyMelding from './pages/NyMelding';
import Meldinger from './pages/Meldinger';
import OfflineKo from './pages/OfflineKo';
import Home from './pages/Home';
import SprakVelger from './components/SprakVelger';
import './i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>{t('app.tittel')}</h1>

        <SprakVelger />

        <nav style={{ marginBottom: '20px' }}>
          <Link to="/">{t('app.hjem')}</Link> |{' '}
          <Link to="/anlegg">{t('app.anlegg')}</Link> |{' '}
          <Link to="/nytt-anlegg">{t('app.nyttAnlegg')}</Link> |{' '}
          <Link to="/meldinger">{t('app.meldinger')}</Link> |{' '}
          <Link to="/ny-melding">{t('app.nyMelding')}</Link> |{' '}
          <Link to="/offline-ko">{t('app.offlineKo')}</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anlegg" element={<Anlegg />} />
          <Route path="/nytt-anlegg" element={<NyttAnlegg />} />
          <Route path="/anlegg/:id" element={<AnleggDetalj />} />
          <Route path="/meldinger" element={<Meldinger />} />
          <Route path="/ny-melding" element={<NyMelding />} />
          <Route path="/offline-ko" element={<OfflineKo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
