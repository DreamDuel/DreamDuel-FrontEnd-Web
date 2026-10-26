import { beforeEach, describe, expect, it } from 'vitest';
import { getSessionId } from './session';

describe('getSessionId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('crea un ID nuevo y lo guarda', () => {
    const id = getSessionId();

    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(localStorage.getItem('guest_session_id')).toBe(id);
  });

  it('reutiliza el ID existente', () => {
    localStorage.setItem('guest_session_id', 'existing-id');

    expect(getSessionId()).toBe('existing-id');
  });
});
