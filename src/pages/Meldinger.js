import React from 'react';

function Meldinger() {
  const meldinger = [
    { id: 1, fra: 'Kontor', tekst: 'Husk å sjekke anlegg 1' },
    { id: 2, fra: 'Felt', tekst: 'Avvik funnet på anlegg 2' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meldinger</h1>
      <ul>
        {meldinger.map(m => (
          <li key={m.id}>{m.fra}: {m.tekst}</li>
        ))}
      </ul>
    </div>
  );
}

export default Meldinger;
