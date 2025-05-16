import React from 'react';

function Anlegg() {
  const anlegg = [
    { id: 1, navn: 'Anlegg 1', status: 'OK' },
    { id: 2, navn: 'Anlegg 2', status: 'Avvik' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Anleggsliste</h1>
      <ul>
        {anlegg.map(a => (
          <li key={a.id}>{a.navn} - Status: {a.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Anlegg;
