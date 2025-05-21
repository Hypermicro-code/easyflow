import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import no from './lang/no';
import en from './lang/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      no: { translation: no },
      en: { translation: en },
    },
    lng: 'no', // Standard språk
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
