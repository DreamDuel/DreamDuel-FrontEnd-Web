// Use Case: Get Stories
// Obtiene historias con filtros opcionales

import type { Story } from '@/domain/stories/entities/Story.entity';
import type { IStoryRepository, StoryFilters } from '@/domain/stories/repositories/IStoryRepository';

export class GetStoriesUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(filters?: StoryFilters): Promise<Story[]> {
    if (filters && Object.keys(filters).length > 0) {
      return await this.storyRepository.search('', filters);
    }
    
    return await this.storyRepository.getAll();
  }
}

export class GetTrendingStoriesUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(): Promise<Story[]> {
    return await this.storyRepository.getTrending();
  }
}

export class GetNewStoriesUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(): Promise<Story[]> {
    return await this.storyRepository.getNew();
  }
}

export class GetStoryByIdUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(id: string): Promise<Story | null> {
    const story = await this.storyRepository.getById(id);
    
    if (story) {
      // Incrementar views cuando se obtiene una historia
      await this.storyRepository.incrementViews(id);
    }
    
    return story;
  }
}
