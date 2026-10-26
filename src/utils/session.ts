const SESSION_KEY = 'guest_session_id';

/** Devuelve el ID de sesión anónima del navegador, creándolo si no existe */
export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}
