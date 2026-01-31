// AI Generation Service
// Servicio para generar imágenes con IA a través del backend

import { HttpClient } from './HttpClient';

export interface GenerationRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  negativePrompt?: string;
  characterImages?: string[]; // URLs de personajes
}

export interface GenerationResponse {
  imageUrl: string;
  prompt: string;
  generationId: string;
  creditsUsed: number;
}

export interface BatchGenerationRequest {
  scenes: Array<{
    text: string;
    prompt: string;
  }>;
  style: string;
  characterImages?: string[];
}

export interface BatchGenerationResponse {
  images: Array<{
    sceneIndex: number;
    imageUrl: string;
    generationId: string;
  }>;
  totalCreditsUsed: number;
}

export class AIGenerationService {
  private http: HttpClient;
  private generationEndpoint = '/api/generate';

  constructor() {
    this.http = new HttpClient();
  }

  /**
   * Genera una imagen individual
   */
  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    return await this.http.post<GenerationResponse>(this.generationEndpoint, request);
  }

  /**
   * Genera múltiples imágenes en batch (para historias completas)
   */
  async generateBatch(request: BatchGenerationRequest): Promise<BatchGenerationResponse> {
    return await this.http.post<BatchGenerationResponse>(`${this.generationEndpoint}/batch`, request);
  }

  /**
   * Regenera una imagen específica
   */
  async regenerateImage(generationId: string, newPrompt?: string): Promise<GenerationResponse> {
    return await this.http.post<GenerationResponse>(`${this.generationEndpoint}/${generationId}/regenerate`, {
      prompt: newPrompt,
    });
  }

  /**
   * Obtiene el estado de una generación en progreso
   */
  async getGenerationStatus(generationId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    imageUrl?: string;
    error?: string;
  }> {
    return await this.http.get(`${this.generationEndpoint}/${generationId}/status`);
  }

  /**
   * Cancela una generación en progreso
   */
  async cancelGeneration(generationId: string): Promise<void> {
    await this.http.post(`${this.generationEndpoint}/${generationId}/cancel`, {});
  }
}
