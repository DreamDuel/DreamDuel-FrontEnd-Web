// Auth Service
// Servicio de autenticación completo listo para backend

import { HttpClient } from './HttpClient';

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl: string;
    isPremium: boolean;
  };
}

export interface GoogleAuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export class AuthService {
  private http: HttpClient;
  private authEndpoint = '/api/auth';

  constructor() {
    this.http = new HttpClient();
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.http.post<AuthResponse>(`${this.authEndpoint}/login`, credentials);
    this.saveToken(response.token);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.http.post<AuthResponse>(`${this.authEndpoint}/register`, data);
    this.saveToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.http.post(`${this.authEndpoint}/logout`, {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearToken();
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    await this.http.post(`${this.authEndpoint}/password-reset`, data);
  }

  async resetPassword(data: PasswordResetConfirm): Promise<void> {
    await this.http.post(`${this.authEndpoint}/password-reset/confirm`, data);
  }

  async verifyEmail(token: string): Promise<void> {
    await this.http.post(`${this.authEndpoint}/verify-email`, { token });
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.http.post<AuthResponse>(`${this.authEndpoint}/refresh`, {});
    this.saveToken(response.token);
    return response;
  }

  async loginWithGoogle(googleToken: string): Promise<GoogleAuthResponse> {
    console.log('🟢 AuthService.loginWithGoogle() START');
    console.log('🟢 Enviando POST a /api/oauth/google');
    console.log('🟢 Token (primeros 50 chars):', googleToken.substring(0, 50) + '...');
    
    const response = await this.http.post<GoogleAuthResponse>('/api/oauth/google', { 
      token: googleToken 
    });
    
    console.log('🟢 Respuesta del backend:', response);
    console.log('🟢 access_token recibido:', response.access_token?.substring(0, 50) + '...');
    
    this.saveToken(response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('refreshToken', response.refresh_token);
    }
    
    console.log('✅ AuthService.loginWithGoogle() completado');
    return response;
  }

  async loginWithApple(token: string): Promise<AuthResponse> {
    const response = await this.http.post<AuthResponse>(`${this.authEndpoint}/apple`, { token });
    this.saveToken(response.token);
    return response;
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    console.log('🟢 AuthService.getCurrentUser() START');
    console.log('🟢 Enviando GET a /api/auth/me');
    
    const user = await this.http.get<AuthResponse['user']>(`${this.authEndpoint}/me`);
    
    console.log('🟢 Usuario recibido:', user);
    console.log('✅ AuthService.getCurrentUser() completado');
    
    return user;
  }

  private saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private clearToken(): void {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
