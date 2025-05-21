import React from 'react';
import { useTranslation } from 'react-i18next';

function SprakVelger() {
  const { i18n } = useTranslation();

  const endreSprak = (valgt) => {
    i18n.changeLanguage(valgt);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <button onClick={() => endreSprak('no')}>🇳🇴 Norsk</button>{' '}
      <button onClick={() => endreSprak('en')}>🇬🇧 English</button>
    </div>
  );
}

export default SprakVelger;
