import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBRTranslations from './locales/ptBR/translation.json'; // Renomeado para clareza

const resources = {
  'pt-BR': { // Chave alterada para 'pt-BR'
    translation: ptBRTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // Alterado para 'pt-BR'
    fallbackLng: 'pt-BR', // Alterado para 'pt-BR'
    debug: true, // Mantendo o debug ativo
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
