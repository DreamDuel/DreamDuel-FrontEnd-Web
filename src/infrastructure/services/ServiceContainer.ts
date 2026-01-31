// Service Container
// Contenedor centralizado para todos los servicios del frontend

import { HttpClient } from '../services/HttpClient';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { UploadService } from '../services/UploadService';
import { AIGenerationService } from '../services/AIGenerationService';
import { PaymentService } from '../services/PaymentService';
import { CommentService } from '../services/CommentService';
import { AnalyticsService } from '../services/AnalyticsService';

/**
 * Service Container
 * Proporciona instancias singleton de todos los servicios
 */
class ServiceContainer {
  private static instance: ServiceContainer;
  
  private _httpClient?: HttpClient;
  private _authService?: AuthService;
  private _userService?: UserService;
  private _uploadService?: UploadService;
  private _aiGenerationService?: AIGenerationService;
  private _paymentService?: PaymentService;
  private _commentService?: CommentService;
  private _analyticsService?: AnalyticsService;

  private constructor() {}

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  get httpClient(): HttpClient {
    if (!this._httpClient) {
      this._httpClient = new HttpClient();
    }
    return this._httpClient;
  }

  get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService();
    }
    return this._authService;
  }

  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService();
    }
    return this._userService;
  }

  get uploadService(): UploadService {
    if (!this._uploadService) {
      this._uploadService = new UploadService();
    }
    return this._uploadService;
  }

  get aiGenerationService(): AIGenerationService {
    if (!this._aiGenerationService) {
      this._aiGenerationService = new AIGenerationService();
    }
    return this._aiGenerationService;
  }

  get paymentService(): PaymentService {
    if (!this._paymentService) {
      this._paymentService = new PaymentService();
    }
    return this._paymentService;
  }

  get commentService(): CommentService {
    if (!this._commentService) {
      this._commentService = new CommentService();
    }
    return this._commentService;
  }

  get analyticsService(): AnalyticsService {
    if (!this._analyticsService) {
      this._analyticsService = new AnalyticsService();
    }
    return this._analyticsService;
  }

  /**
   * Resetea todas las instancias (útil para testing)
   */
  reset(): void {
    this._httpClient = undefined;
    this._authService = undefined;
    this._userService = undefined;
    this._uploadService = undefined;
    this._aiGenerationService = undefined;
    this._paymentService = undefined;
    this._commentService = undefined;
    this._analyticsService = undefined;
  }
}

// Exportar instancia singleton
export const services = ServiceContainer.getInstance();

// Exportar servicios individuales para convenience
export const authService = () => services.authService;
export const userService = () => services.userService;
export const uploadService = () => services.uploadService;
export const aiGenerationService = () => services.aiGenerationService;
export const paymentService = () => services.paymentService;
export const commentService = () => services.commentService;
export const analyticsService = () => services.analyticsService;
