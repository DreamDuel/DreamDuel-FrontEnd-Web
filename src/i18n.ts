import { createI18n } from 'vue-i18n';
import es from './locales/es';
import en from './locales/en';

export const SUPPORTED_LOCALES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]['code'];

const LOCALE_STORAGE_KEY = 'locale';
const DEFAULT_LOCALE: AppLocale = 'es';

const isSupported = (code: string | null): code is AppLocale =>
  SUPPORTED_LOCALES.some((l) => l.code === code);

// Idioma guardado, luego el del navegador (ej: 'es-MX' -> 'es'), y por último español
const getInitialLocale = (): AppLocale => {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isSupported(saved)) return saved;

  const browserLang = navigator.language.split('-')[0]?.toLowerCase() ?? null;
  return isSupported(browserLang) ? browserLang : DEFAULT_LOCALE;
};

const initialLocale = getInitialLocale();
document.documentElement.lang = initialLocale;

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { es, en }
});

/** Cambia el idioma de la app, lo recuerda y actualiza <html lang> */
export function setLocale(code: AppLocale) {
  i18n.global.locale.value = code;
  localStorage.setItem(LOCALE_STORAGE_KEY, code);
  document.documentElement.lang = code;
}

export default i18n;
