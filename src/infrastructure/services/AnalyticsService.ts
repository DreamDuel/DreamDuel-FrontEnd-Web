// Analytics Service
// Servicio para tracking de métricas y analytics

import { HttpClient } from './HttpClient';

export interface AnalyticsEvent {
  eventType: 'page_view' | 'story_view' | 'story_create' | 'blur_click' | 'download_attempt' | 'premium_click' | 'referral_click';
  metadata?: Record<string, any>;
}

export interface UserMetrics {
  generationsToday: number;
  blurClicksToday: number;
  downloadAttempts: number;
  storiesViewed: number;
  isHighIntent: boolean;
}

export interface StoryAnalytics {
  storyId: string;
  views: number;
  likes: number;
  saves: number;
  comments: number;
  shares: number;
  averageReadTime: number;
  completionRate: number;
}

export class AnalyticsService {
  private http: HttpClient;
  private analyticsEndpoint = '/api/analytics';

  constructor() {
    this.http = new HttpClient();
  }

  /**
   * Registra un evento de analytics
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await this.http.post(`${this.analyticsEndpoint}/event`, event);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  /**
   * Obtiene métricas del usuario actual
   */
  async getUserMetrics(): Promise<UserMetrics> {
    return await this.http.get<UserMetrics>(`${this.analyticsEndpoint}/user/metrics`);
  }

  /**
   * Obtiene analytics de una historia específica
   */
  async getStoryAnalytics(storyId: string): Promise<StoryAnalytics> {
    return await this.http.get<StoryAnalytics>(`${this.analyticsEndpoint}/story/${storyId}`);
  }

  /**
   * Registra vista de historia
   */
  async trackStoryView(storyId: string, duration?: number): Promise<void> {
    await this.trackEvent({
      eventType: 'story_view',
      metadata: { storyId, duration }
    });
  }

  /**
   * Registra clic en imagen borrosa (PQL importante)
   */
  async trackBlurClick(storyId: string): Promise<void> {
    await this.trackEvent({
      eventType: 'blur_click',
      metadata: { storyId }
    });
  }

  /**
   * Registra intento de descarga
   */
  async trackDownloadAttempt(storyId: string, sceneIndex: number): Promise<void> {
    await this.trackEvent({
      eventType: 'download_attempt',
      metadata: { storyId, sceneIndex }
    });
  }

  /**
   * Registra clic en botón premium/upgrade
   */
  async trackPremiumClick(source: string): Promise<void> {
    await this.trackEvent({
      eventType: 'premium_click',
      metadata: { source }
    });
  }
}
