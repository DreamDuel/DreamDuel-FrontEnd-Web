// Configuración de la app leída de variables de entorno (ver .env.example)

/** URL base del backend, incluyendo el prefijo /api */
export const API_URL = (import.meta.env.VITE_API_URL || 'https://dreamduel-backend-web.onrender.com/api').replace(/\/+$/, '');

/** Página de compra de créditos en Gumroad */
export const GUMROAD_CHECKOUT_URL = import.meta.env.VITE_GUMROAD_CHECKOUT_URL || 'https://gumroad.com/l/tooupe?wanted=true';
