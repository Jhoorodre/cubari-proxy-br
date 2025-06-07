import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from './locales/ptBR/translation.json';

const resources = {
  ptBR: {
    translation: ptBR
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ptBR',
    fallbackLng: 'ptBR',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
