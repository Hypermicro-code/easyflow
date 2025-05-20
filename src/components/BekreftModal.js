import React from 'react';

function BekreftModal({ vis, melding, onBekreft, onAvbryt }) {
  if (!vis) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px 30px',
        borderRadius: '10px',
        maxWidth: '400px',
        textAlign: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>
        <p style={{ marginBottom: '20px', fontSize: '1.1em' }}>{melding}</p>
        <button
          onClick={onBekreft}
          style={{
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Ja
        </button>
        <button
          onClick={onAvbryt}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Nei
        </button>
      </div>
    </div>
  );
}

export default BekreftModal;
