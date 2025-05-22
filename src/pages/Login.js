import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [epost, setEpost] = useState('');
  const [passord, setPassord] = useState('');
  const [nyBruker, setNyBruker] = useState(false);
  const [feil, setFeil] = useState('');
  const navigate = useNavigate();

  const håndterSubmit = async (e) => {
    e.preventDefault();
    setFeil('');

    try {
      if (nyBruker) {
        await createUserWithEmailAndPassword(auth, epost, passord);
      } else {
        await signInWithEmailAndPassword(auth, epost, passord);
      }
      navigate('/'); // Gå til startside etter vellykket login
    } catch (err) {
      setFeil(err.message);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '400px', margin: 'auto' }}>
      <h2>{nyBruker ? 'Registrer bruker' : 'Logg inn'}</h2>
      <form onSubmit={håndterSubmit}>
        <input
          type="email"
          placeholder="E-post"
          value={epost}
          onChange={(e) => setEpost(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Passord"
          value={passord}
          onChange={(e) => setPassord(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        {feil && <p style={{ color: 'red' }}>{feil}</p>}
        <button type="submit" style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
          {nyBruker ? 'Opprett bruker' : 'Logg inn'}
        </button>
      </form>
      <p>
        {nyBruker ? 'Har du allerede bruker?' : 'Ingen bruker ennå?'}{' '}
        <button onClick={() => setNyBruker(!nyBruker)} style={{ color: 'blue', background: 'none', border: 'none' }}>
          {nyBruker ? 'Logg inn' : 'Registrer deg'}
        </button>
      </p>
    </div>
  );
}

export default Login;
