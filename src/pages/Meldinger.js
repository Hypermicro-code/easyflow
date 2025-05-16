import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Meldinger() {
  const [meldinger, setMeldinger] = useState([]);

  useEffect(() => {
    const fetchMeldinger = async () => {
      const meldingCol = collection(db, 'meldinger');
      const meldingSnapshot = await getDocs(meldingCol);
      const meldingList = meldingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMeldinger(meldingList);
    };

    fetchMeldinger();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meldinger (fra Firebase)</h1>
      <ul>
        {meldinger.map(m => (
          <li key={m.id}>{m.fra}: {m.tekst}</li>
        ))}
      </ul>
    </div>
  );
}

export default Meldinger;
