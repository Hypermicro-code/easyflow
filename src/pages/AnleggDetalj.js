import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import {
  doc, getDoc, updateDoc, deleteDoc, addDoc, getDocs, collection
} from 'firebase/firestore';
import {
  ref, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage';
import UnderAnleggBobler from '../components/UnderAnleggBobler';
import Toast from '../components/Toast';
import BekreftModal from '../components/BekreftModal';
import UnderAnleggListe from '../components/UnderAnleggListe';
import { useTranslation } from 'react-i18next';

function AnleggDetalj() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [anlegg, setAnlegg] = useState(null);
  const [status, setStatus] = useState('');
  const [informasjon, setInformasjon] = useState('');
  const [bilder, setBilder] = useState([]);
  const [toast, setToast] = useState('');
  const [visModal, setVisModal] = useState(false);
  const [sletteType, setSletteType] = useState(null);
  const [bildeSomSkalSlettes, setBildeSomSkalSlettes] = useState(null);
  const [fullscreenBilde, setFullscreenBilde] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchAnlegg = async () => {
      const docRef = doc(db, 'anlegg', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnlegg({ id: docSnap.id, ...data });
        setStatus(data.status || '');
        setInformasjon(data.informasjon || '');
        setBilder(data.bilder || []);
      } else {
        setToast(t('feil.anleggIkkeFunnet'));
      }
    };
    fetchAnlegg();
  }, [id, t]);

  const erArkivert = anlegg?.arkivert;

  const oppdaterAnlegg = async () => {
    try {
      await updateDoc(doc(db, 'anlegg', id), {
        status,
        informasjon,
      });
      setToast(t('anleggDetalj.lagret'));
    } catch (error) {
      console.error('Feil ved oppdatering:', error);
      setToast(t('feil.lagring'));
    }
  };

  const opprettUnderanlegg = async () => {
    const hovednummer = anlegg.anleggsnummer;
    const snapshot = await getDocs(collection(db, 'anlegg'));
    const eksisterende = snapshot.docs
      .map(doc => doc.data().anleggsnummer)
      .filter(nr => typeof nr === 'string' && nr.startsWith(`${hovednummer}-`));
    const nesteSuffiks = eksisterende.length + 1;
    const nyttNummer = `${hovednummer}-${nesteSuffiks}`;

    const nytt = {
      navn: `${anlegg.navn} - ${t('anleggDetalj.underanlegg')}`,
      status: t('status.nytt'),
      anleggsnummer: nyttNummer,
      informasjon: '',
      bilder: [],
      opprettet: new Date().toISOString(),
      arkivert: false
    };

    const docRef = await addDoc(collection(db, 'anlegg'), nytt);
    navigate(`/anlegg/${docRef.id}`);
  };

  const statusEmoji = (status, erArkivert) => {
    if (erArkivert) return '📦';
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
        <h1>{t('anleggDetalj.tittel')} {statusEmoji(status, erArkivert)}</h1>

        <div><strong>{t('anleggDetalj.anleggsnummer')}:</strong> {anlegg.anleggsnummer}</div>
           {!anlegg.anleggsnummer.toString().includes('-') && (
  <UnderAnleggBobler hovednummer={anlegg.anleggsnummer} gjeldendeId={anlegg.id} />
)} 
        <div><strong>{t('anleggDetalj.navn')}:</strong> {anlegg.navn}</div>
        <div><strong>{t('anleggDetalj.opprettet')}:</strong> {new Date(anlegg.opprettet).toLocaleString()}</div>

        {!anlegg.anleggsnummer.toString().includes('-') && (
          <UnderAnleggListe hovednummer={anlegg.anleggsnummer} gjeldendeId={anlegg.id} />
        )}

        <br />
        <label>{t('anleggDetalj.status')}:</label><br />
        <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={erArkivert}>
          <option>{t('status.nytt')}</option>
          <option>{t('status.underArbeid')}</option>
          <option>{t('status.tilKontroll')}</option>
          <option>{t('status.ferdig')}</option>
          <option>{t('status.tilUtbedring')}</option>
        </select><br /><br />

        <label>{t('anleggDetalj.informasjon')}:</label><br />
        <textarea
          value={informasjon}
          onChange={(e) => setInformasjon(e.target.value)}
          rows={4}
          cols={40}
          disabled={erArkivert}
        /><br /><br />

        {!erArkivert && (
          <>
            <button onClick={oppdaterAnlegg}>💾 {t('anleggDetalj.lagre')}</button>
            <button onClick={opprettUnderanlegg} style={{ marginLeft: '10px' }}>
              ➕ {t('anleggDetalj.opprettUnderanlegg')}
            </button>
            <br /><br />
            <button onClick={() => fileInputRef.current.click()}>
              📷 {t('anleggDetalj.lastOpp')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                const files = Array.from(e.target.files);
                const nyeUrls = [];
                for (const file of files) {
                  const refPath = `anlegg/${Date.now()}_${file.name}`;
                  const filRef = ref(storage, refPath);
                  await uploadBytes(filRef, file);
                  const url = await getDownloadURL(filRef);
                  nyeUrls.push(url);
                }
                const nyeBilder = [...(bilder || []), ...nyeUrls];
                await updateDoc(doc(db, 'anlegg', id), { bilder: nyeBilder });
                setBilder(nyeBilder);
                setToast(t('anleggDetalj.bildeLastetOpp'));
              }}
            />
            <br /><br />
            <button onClick={async () => {
              await updateDoc(doc(db, 'anlegg', id), { arkivert: true });
              setToast(t('anleggDetalj.arkivert'));
              navigate('/anlegg');
            }}>
              📦 {t('anleggDetalj.arkiver')}
            </button>
          </>
        )}

        <div style={{ marginTop: '30px' }}>
          <button onClick={() => {
            setSletteType('anlegg');
            setVisModal(true);
          }} style={{ backgroundColor: '#f44336', color: 'white' }}>
            🗑️ {t('anleggDetalj.slett')}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, maxHeight: '80vh', overflowY: 'auto' }}>
        <h3>{t('anleggDetalj.bilder')}</h3>
        {bilder.length > 0 ? (
          bilder.map((url, idx) => (
            <div key={idx}>
              <img
                src={url}
                alt={`bilde-${idx}`}
                style={{ width: '100%', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer' }}
                onClick={() => setFullscreenBilde(url)}
              />
              {!erArkivert && (
                <button onClick={() => {
                  setSletteType('bilde');
                  setBildeSomSkalSlettes(url);
                  setVisModal(true);
                }}>
                  🗑️ {t('anleggDetalj.slettBilde')}
                </button>
              )}
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
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <img src={fullscreenBilde} alt="fullscreen" style={{ maxWidth: '90%', maxHeight: '90%' }} />
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      <BekreftModal
        vis={visModal}
        melding={sletteType === 'bilde' ? t('anleggDetalj.bekreftBildeSlett') : t('anleggDetalj.bekreftAnleggSlett')}
        onBekreft={async () => {
          if (sletteType === 'bilde') {
            const refToDel = ref(storage, bildeSomSkalSlettes);
            await deleteObject(refToDel);
            const nyeBilder = bilder.filter(b => b !== bildeSomSkalSlettes);
            await updateDoc(doc(db, 'anlegg', id), { bilder: nyeBilder });
            setBilder(nyeBilder);
            setToast(t('anleggDetalj.bildeSlettet'));
          } else {
            await deleteDoc(doc(db, 'anlegg', id));
            setToast(t('anleggDetalj.slettet'));
            navigate('/anlegg');
          }
          setVisModal(false);
        }}
        onAvbryt={() => {
          setVisModal(false);
          setSletteType(null);
          setBildeSomSkalSlettes(null);
        }}
      />
    </div>
  );
}

export default AnleggDetalj;
