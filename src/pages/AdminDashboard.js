import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from '../components/Toast';
import NavnModal from '../components/NavnModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [brukere, setBrukere] = useState([]);
  const [nyBruker, setNyBruker] = useState({
    epost: '',
    passord: '',
    rolle: 'felt',
    fornavn: '',
    etternavn: '',
    telefon: '',
    ansattnummer: ''
  });
  const [visModal, setVisModal] = useState(false);
  const [toast, setToast] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const hentBrukere = async () => {
      const querySnapshot = await getDocs(collection(db, 'brukere'));
      const liste = querySnapshot.docs.map((doc) => doc.data());
      setBrukere(liste);
    };
    hentBrukere();
  }, [toast]);

  const opprettBruker = async () => {
    try {
      const brukerCredential = await createUserWithEmailAndPassword(auth, nyBruker.epost, nyBruker.passord);
      const brukerId = brukerCredential.user.uid;
      await setDoc(doc(db, 'brukere', brukerId), {
        uid: brukerId,
        epost: nyBruker.epost,
        rolle: nyBruker.rolle,
        fornavn: nyBruker.fornavn,
        etternavn: nyBruker.etternavn,
        telefon: nyBruker.telefon,
        ansattnummer: nyBruker.ansattnummer
      });
      setToast(t('admin.opprettet'));
      setVisModal(false);
    } catch (err) {
      setToast(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('admin.tittel')}</h1>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => navigate('/')}>🏠 Hjem</button>
      </div>

      <button onClick={() => setVisModal(true)}>{t('admin.leggTil')}</button>

      <div style={{ marginTop: '20px' }}>
        <h2>{t('admin.liste')}</h2>
        {brukere.map((b, idx) => (
          <div key={idx} style={{
            background: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px'
          }}>
            <strong>{b.ansattnummer}</strong> – {b.fornavn} {b.etternavn} – {b.telefon}<br />
            <small>{b.epost} ({b.rolle})</small>
          </div>
        ))}
      </div>

      <NavnModal
        vis={visModal}
        onLukk={() => setVisModal(false)}
        onBekreft={(data) => {
          setNyBruker(data);
          opprettBruker();
        }}
        type="bruker"
      />

      {toast && <Toast melding={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default AdminDashboard;
