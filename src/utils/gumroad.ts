import { GUMROAD_CHECKOUT_URL } from '@/config';

/**
 * Abre el checkout de Gumroad en una ventana emergente centrada.
 * Se usa una ventana nativa en lugar del overlay de gumroad.js para no
 * interferir con el router de Vue.
 */
export function openGumroadCheckout() {
  const width = 600;
  const height = Math.min(800, window.innerHeight);
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  window.open(
    GUMROAD_CHECKOUT_URL,
    'GumroadCheckout',
    `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=yes,resizable=yes,status=no`
  );
}
