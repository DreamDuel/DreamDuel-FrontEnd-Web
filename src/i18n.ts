import { createI18n } from 'vue-i18n';
import es from './locales/es';
import en from './locales/en';

// Idiomas disponibles en la aplicación
const availableLocales = ['es', 'en'];

// Función para detectar el idioma del navegador
const getBrowserLocale = (): string => {
  // Obtener el idioma del navegador
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // Extraer el código de idioma principal (ej: 'es-MX' -> 'es')
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  // Verificar si el idioma está disponible
  return availableLocales.includes(langCode) ? langCode : 'es';
};

// Obtener idioma: primero del localStorage, luego del navegador, finalmente español
const savedLocale = localStorage.getItem('locale');
const defaultLocale = savedLocale || getBrowserLocale();

const i18n = createI18n({
  legacy: false, // Usar Composition API
  locale: defaultLocale,
  fallbackLocale: 'es',
  messages: {
    es,
    en
  },
  globalInjection: true
});

export default i18n;
