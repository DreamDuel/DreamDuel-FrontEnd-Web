import { createI18n } from 'vue-i18n';
import es from './locales/es';
import en from './locales/en';

// Obtener idioma guardado o usar español por defecto
const savedLocale = localStorage.getItem('locale') || 'es';

const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: savedLocale,
  fallbackLocale: 'es',
  messages: {
    es,
    en
  },
  globalInjection: true
});

export default i18n;
