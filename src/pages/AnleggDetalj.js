import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';
import { useTranslation } from 'react-i18next';

function AnleggDetalj() {
  const { id } = useParams();
  const [anlegg, setAnlegg] = useState(null);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [sletteType, setSletteType] = useState(null);
  const [bilder, setBilder] = useState([]);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const [bildeSomSkalSlettes, setBildeSomSkalSlettes] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const [navn, setNavn] = useState('');
  const [status, setStatus] = useState('');
  const [anleggsnummer, setAnleggsnummer] = useState('');

  useEffect(() => {
    const fetchAnlegg = async () => {
      const docRef = doc(db, 'anlegg', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnlegg({ id: docSnap.id, ...data });
        setNavn(data.navn || '');
        setStatus(data.status || '');
        setAnleggsnummer(data.anleggsnummer || '');
        setBilder(data.bilder || []);
      } else {
        setToast(t('feil.anleggIkkeFunnet'));
      }
    };
    fetchAnlegg();
  }, [id, t]);

  const oppdaterAnlegg = async () => {
    try {
      await updateDoc(doc(db, 'anlegg', id), {
        navn,
        status,
        anleggsnummer: parseInt(anleggsnummer)
      });
      setToast(t('anleggDetalj.lagret'));
    } catch (error) {
      console.error('Feil ved oppdatering:', error);
      setToast(t('feil.lagring'));
    }
  };

  const lastOppBilder = async (files) => {
    try {
      const nyeUrls = [];
      for (const file of files) {
        const bildeRef = ref(storage, `anlegg/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(bildeRef, file);
        const url = await getDownloadURL(snapshot.ref);
        nyeUrls.push(url);
      }
      const oppdatertListe = [...(anlegg.bilder || []), ...nyeUrls];
      await updateDoc(doc(db, 'anlegg', id), { bilder: oppdatertListe });
      setToast(t('anleggDetalj.bildeLastetOpp'));
      setBilder(oppdatertListe);
    } catch (error) {
      console.error('Feil ved opplasting:', error);
      setToast(t('feil.bildeOpplasting'));
    }
  };

  const slettBilde = async (url) => {
    try {
      const bildeRef = ref(storage, url);
      await deleteObject(bildeRef);
      const gjenværende = bilder.filter(b => b !== url);
      await updateDoc(doc(db, 'anlegg', id), { bilder: gjenværende });
      setToast(t('anleggDetalj.bildeSlettet'));
      setBilder(gjenværende);
    } catch (error) {
      console.error('Feil ved sletting:', error);
      setToast(t('feil.bildeSletting'));
    }
    setBildeSomSkalSlettes(null);
    setVisModal(false);
  };

  const slettAnlegg = async () => {
    try {
      for (const url of bilder) {
        const bildeRef = ref(storage, url);
        await deleteObject(bildeRef);
      }
      await deleteDoc(doc(db, 'anlegg', id));
      setToast(t('anleggDetalj.slettet'));
      navigate('/anlegg');
    } catch (error) {
      console.error('Feil ved sletting av anlegg:', error);
      setToast(t('feil.sletting'));
    }
    setVisModal(false);
    setSletteType(null);
  };

  const triggerFileDialog = () => {
    fileInputRef.current.click();
  };

  const statusEmoji = (status) => {
    const s = status?.toLowerCase();
    if (s === t('status.nytt').toLowerCase()) return '🆕';
    if (s === t('status.underArbeid').toLowerCase()) return '🛠️';
    if (s === t('status.tilKontroll').toLowerCase()) return '🔍';
    if (s === t('status.ferdig').toLowerCase()) return '✅';
    if (s === t('status.tilUtbedring').toLowerCase()) return '⚠️';
    return '⚪️';
  };

  if (!anlegg) return <div style={{ padding: '20px' }}>{t('anleggDetalj.laster')}</div>;

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '30px' }}>
      <div style={{ flex: 1 }}>
        <h1>{t('anleggDetalj.tittel')}</h1>

        <label>{t('anleggDetalj.anleggsnummer')}:</label><br />
        <input type="number" value={anleggsnummer} onChange={(e) => setAnleggsnummer(e.target.value)} /><br /><br />

        <label>{t('anleggDetalj.navn')}:</label><br />
        <input type="text" value={navn} onChange={(e) => setNavn(e.target.value)} /><br /><br />

        <label>{t('anleggDetalj.status')}:</label><br />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>{t('status.nytt')}</option>
          <option>{t('status.underArbeid')}</option>
          <option>{t('status.tilKontroll')}</option>
          <option>{t('status.ferdig')}</option>
          <option>{t('status.tilUtbedring')}</option>
        </select><br /><br />

        <button onClick={oppdaterAnlegg}>💾 {t('anleggDetalj.lagre')}</button>{' '}

        <button onClick={triggerFileDialog} style={{ marginLeft: '10px' }}>📷 {t('anleggDetalj.lastOpp')}</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={(e) => lastOppBilder(e.target.files)}
          style={{ display: 'none' }}
        />

        <p><strong>{t('anleggDetalj.opprettet')}:</strong> {new Date(anlegg.opprettet).toLocaleString()}</p>

        {!anlegg.arkivert && (
          <button onClick={async () => {
            await updateDoc(doc(db, 'anlegg', id), { arkivert: true });
            setToast(t('anleggDetalj.arkivert'));
            navigate('/anlegg');
          }} style={{ marginTop: '20px' }}>
            📦 {t('anleggDetalj.arkiver')}
          </button>
        )}

        <hr style={{ margin: '20px 0' }} />

        <button onClick={() => { setVisModal(true); setSletteType('anlegg'); }} style={{ backgroundColor: '#f44336', color: 'white' }}>
          🗑️ {t('anleggDetalj.slett')}
        </button>
      </div>

      {/* Høyre side – galleri */}
      <div style={{ flex: '0 0 300px', maxHeight: '80vh', overflowY: 'auto', paddingRight: '10px' }}>
        <h3>{t('anleggDetalj.bilder')}</h3>
        {bilder.length > 0 ? (
          bilder.map((url, idx) => (
            <div key={idx}>
              <img
                src={url}
                alt={`Bilde ${idx + 1}`}
                style={{ width: '100%', cursor: 'pointer', borderRadius: '6px' }}
                onClick={() => setFullscreenBilde(url)}
              />
              <button onClick={() => {
                setBildeSomSkalSlettes(url);
                setVisModal(true);
              }}>
                🗑️ {t('anleggDetalj.slettBilde')}
              </button>
            </div>
          ))
        ) : (
          <p>{t('anleggDetalj.ingenBilder')}</p>
        )}
      </div>

      {fullscreenBilde && (
        <div
          onClick={() => setFullscreenBilde(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}
        >
          <img src={fullscreenBilde} alt="Fullskjerm" style={{ maxWidth: '90%', maxHeight: '90%' }} />
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <BekreftModal
        vis={visModal}
        melding={bildeSomSkalSlettes ? t('anleggDetalj.bekreftBildeSlett') : t('anleggDetalj.bekreftAnleggSlett')}
        onBekreft={() => {
          if (bildeSomSkalSlettes) slettBilde(bildeSomSkalSlettes);
          else slettAnlegg();
        }}
        onAvbryt={() => {
          setVisModal(false);
          setBildeSomSkalSlettes(null);
        }}
      />
    </div>
  );
}

export default AnleggDetalj;
