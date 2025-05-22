// src/components/BekreftModal.js
import React from 'react';

function BekreftModal({ vis, tittel, onLukk, onBekreft, bekreftTekst = 'Ja', avbrytTekst = 'Nei', children }) {
  if (!vis) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        minWidth: '300px',
        maxWidth: '90%',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
      }}>
        <h3>{tittel}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {children}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button style={{ background: 'green', color: 'white', padding: '5px 10px' }} onClick={onBekreft}>{bekreftTekst}</button>
          <button style={{ background: 'red', color: 'white', padding: '5px 10px' }} onClick={onLukk}>{avbrytTekst}</button>
        </div>
      </div>
    </div>
  );
}

export default BekreftModal;
