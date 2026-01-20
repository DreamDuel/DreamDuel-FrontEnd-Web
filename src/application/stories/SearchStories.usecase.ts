// Use Case: Search Stories
// Busca historias con filtros

import type { Story } from '@/domain/stories/entities/Story.entity';
import type { IStoryRepository, StoryFilters } from '@/domain/stories/repositories/IStoryRepository';

export class SearchStoriesUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(query: string, filters?: StoryFilters): Promise<Story[]> {
    if (!query.trim() && (!filters || Object.keys(filters).length === 0)) {
      return [];
    }

    return await this.storyRepository.search(query, filters);
  }
}
