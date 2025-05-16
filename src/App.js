import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Anlegg from './pages/Anlegg';
import Meldinger from './pages/Meldinger';

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Hjem</Link> |{' '}
        <Link to="/anlegg">Anlegg</Link> |{' '}
        <Link to="/meldinger">Meldinger</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anlegg" element={<Anlegg />} />
        <Route path="/meldinger" element={<Meldinger />} />
      </Routes>
    </Router>
  );
}

export default App;
