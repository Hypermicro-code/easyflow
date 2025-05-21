import React, { useState } from 'react';

function NavnModal({ vis, onLukk, onBekreft }) {
  const [navn, setNavn] = useState('');

  if (!vis) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    }}>
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
      }}>
        <h3>Opprett under-anlegg</h3>
        <p>Skriv inn navn for under-anlegget:</p>
        <input
          type="text"
          value={navn}
          onChange={(e) => setNavn(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onLukk}>Avbryt</button>
          <button
            onClick={() => {
              onBekreft(navn);
              setNavn('');
            }}
            disabled={!navn.trim()}
          >
            Opprett
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavnModal;
