// Repository Interface: IStoryRepository
// Contrato para acceder a historias (implementado por infraestructura)

import type { Story } from '../entities/Story.entity';
import type { StoryCreationRequest } from '../value-objects/StoryCreationRequest.vo';

export interface IStoryRepository {
  // Queries
  getAll(): Promise<Story[]>;
  getById(id: string): Promise<Story | null>;
  getTrending(): Promise<Story[]>;
  getNew(): Promise<Story[]>;
  getByAuthor(authorId: string): Promise<Story[]>;
  search(query: string, filters?: StoryFilters): Promise<Story[]>;
  
  // Commands
  create(request: StoryCreationRequest): Promise<Story>;
  update(id: string, data: Partial<Story>): Promise<Story>;
  delete(id: string): Promise<void>;
  
  // Actions
  incrementViews(id: string): Promise<void>;
  toggleLike(id: string, userId: string): Promise<boolean>;
  toggleSave(id: string, userId: string): Promise<boolean>;
}

export interface StoryFilters {
  tags?: string[];
  visualStyle?: string;
  sortBy?: 'recent' | 'views' | 'likes';
  authorId?: string;
}
