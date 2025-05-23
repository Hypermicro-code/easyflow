// src/components/HjemKnapp.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HjemKnapp() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button className="secondaryKnapp" onClick={() => navigate('/')}>
      {t('knapp.hjem')}
    </button>
  );
}
