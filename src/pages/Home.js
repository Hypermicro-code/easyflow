import React from 'react';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('home.velkommen')}</h1>
      <p>{t('home.beskrivelse')}</p>
    </div>
  );
}

export default Home;
