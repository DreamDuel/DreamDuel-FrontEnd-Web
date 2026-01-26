/**
 * Sistema de referidos para viralidad orgánica
 * Cada usuario obtiene un código único que puede compartir
 */

/**
 * Genera un código de referido único para un usuario
 */
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'DD'; // Prefijo DreamDuel
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Valida si un código de referido tiene el formato correcto
 */
export function isValidReferralCode(code: string): boolean {
  return /^DD[A-Z0-9]{6}$/.test(code);
}

/**
 * Extrae el código de referido de una URL
 */
export function getReferralCodeFromUrl(url: string = window.location.href): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('ref') || urlObj.pathname.split('/ref/')[1] || null;
  } catch {
    return null;
  }
}

/**
 * Genera el link de invitación completo
 */
export function generateInviteLink(referralCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/register?ref=${referralCode}`;
}

/**
 * Comparte el código de referido a través de diferentes canales
 */
export async function shareReferralCode(
  referralCode: string,
  userName: string,
  channel: 'whatsapp' | 'twitter' | 'facebook' | 'email' | 'copy' | 'generic'
): Promise<boolean> {
  const inviteLink = generateInviteLink(referralCode);
  const message = `¡Únete a DreamDuel y crea historias visuales increíbles con IA! 🎨✨\n\nUsa mi código ${referralCode} y obtén 3 imágenes gratis para empezar:\n${inviteLink}`;

  switch (channel) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
      return true;

    case 'twitter':
      const twitterText = `¡Estoy creando historias increíbles en @DreamDuel! 🎨✨\n\nÚnete con mi código ${referralCode} y obtén 3 imágenes gratis:\n${inviteLink}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`, '_blank');
      return true;

    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`, '_blank');
      return true;

    case 'email':
      const subject = `${userName} te invita a DreamDuel`;
      const body = `Hola!\n\n${userName} te invita a unirte a DreamDuel, la plataforma para crear historias visuales increíbles con IA.\n\nÚsala mi código de invitación ${referralCode} para obtener 3 imágenes gratis:\n${inviteLink}\n\n¡Nos vemos allí!\n- ${userName}`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return true;

    case 'copy':
      try {
        await navigator.clipboard.writeText(inviteLink);
        return true;
      } catch {
        return false;
      }

    case 'generic':
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Únete a DreamDuel',
            text: message,
            url: inviteLink,
          });
          return true;
        } catch {
          return false;
        }
      }
      // Fallback a copiar
      try {
        await navigator.clipboard.writeText(inviteLink);
        return true;
      } catch {
        return false;
      }

    default:
      return false;
  }
}

/**
 * Guarda el código de referido en localStorage para atribuirlo después del registro
 */
export function saveReferralAttribution(referralCode: string): void {
  if (isValidReferralCode(referralCode)) {
    localStorage.setItem('referredBy', referralCode);
    localStorage.setItem('referralTimestamp', Date.now().toString());
  }
}

/**
 * Obtiene el código de referido guardado (si existe y no ha expirado)
 */
export function getSavedReferralCode(expirationDays: number = 30): string | null {
  const code = localStorage.getItem('referredBy');
  const timestamp = localStorage.getItem('referralTimestamp');
  
  if (!code || !timestamp) return null;
  
  // Verificar si ha expirado
  const expirationMs = expirationDays * 24 * 60 * 60 * 1000;
  if (Date.now() - parseInt(timestamp) > expirationMs) {
    localStorage.removeItem('referredBy');
    localStorage.removeItem('referralTimestamp');
    return null;
  }
  
  return code;
}

/**
 * Limpia el código de referido guardado después de usarlo
 */
export function clearReferralAttribution(): void {
  localStorage.removeItem('referredBy');
  localStorage.removeItem('referralTimestamp');
}

/**
 * Tracking de conversión de referidos (para analytics)
 */
export interface ReferralEvent {
  type: 'invited' | 'registered' | 'completed_action';
  referrerCode: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export function trackReferralEvent(event: ReferralEvent): void {
  // Aquí se integraría con el sistema de analytics (Google Analytics, Mixpanel, etc.)
  console.log('Referral Event:', event);
  
  // Guardar en localStorage para sincronización posterior
  const events = JSON.parse(localStorage.getItem('referralEvents') || '[]');
  events.push(event);
  localStorage.setItem('referralEvents', JSON.stringify(events));
}
