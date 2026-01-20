// API Repository: Story Repository
// Implementación real que conecta con el Backend (TODO: configurar cuando esté listo)

import type { IStoryRepository, StoryFilters } from '@/domain/stories/repositories/IStoryRepository';
import type { Story } from '@/domain/stories/entities/Story.entity';
import type { StoryCreationRequest } from '@/domain/stories/value-objects/StoryCreationRequest.vo';
import { HttpClient } from '../services/HttpClient';

export class ApiStoryRepository implements IStoryRepository {
  private http: HttpClient;
  private baseUrl = '/api/stories';

  constructor() {
    this.http = new HttpClient();
  }

  async getAll(): Promise<Story[]> {
    return await this.http.get<Story[]>(this.baseUrl);
  }

  async getById(id: string): Promise<Story | null> {
    try {
      return await this.http.get<Story>(`${this.baseUrl}/${id}`);
    } catch {
      return null;
    }
  }

  async getTrending(): Promise<Story[]> {
    return await this.http.get<Story[]>(`${this.baseUrl}/trending`);
  }

  async getNew(): Promise<Story[]> {
    return await this.http.get<Story[]>(`${this.baseUrl}/new`);
  }

  async getByAuthor(authorId: string): Promise<Story[]> {
    return await this.http.get<Story[]>(`${this.baseUrl}/author/${authorId}`);
  }

  async search(query: string, filters?: StoryFilters): Promise<Story[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    if (filters?.visualStyle) params.append('style', filters.visualStyle);
    if (filters?.sortBy) params.append('sort', filters.sortBy);
    
    return await this.http.get<Story[]>(`${this.baseUrl}/search?${params}`);
  }

  async create(request: StoryCreationRequest): Promise<Story> {
    return await this.http.post<Story>(this.baseUrl, request.toJSON());
  }

  async update(id: string, data: Partial<Story>): Promise<Story> {
    return await this.http.put<Story>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`${this.baseUrl}/${id}`);
  }

  async incrementViews(id: string): Promise<void> {
    await this.http.post(`${this.baseUrl}/${id}/view`, {});
  }

  async toggleLike(id: string, userId: string): Promise<boolean> {
    const response = await this.http.post<{ liked: boolean }>(`${this.baseUrl}/${id}/like`, { userId });
    return response.liked;
  }

  async toggleSave(id: string, userId: string): Promise<boolean> {
    const response = await this.http.post<{ saved: boolean }>(`${this.baseUrl}/${id}/save`, { userId });
    return response.saved;
  }
}
