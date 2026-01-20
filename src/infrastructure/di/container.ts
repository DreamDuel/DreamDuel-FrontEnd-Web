// Dependency Injection Container
// Configura qué implementaciones usar (Mock vs API)

import type { IStoryRepository } from '@/domain/stories/repositories/IStoryRepository';
import { MockStoryRepository } from '@/infrastructure/repositories/MockStoryRepository';
import { ApiStoryRepository } from '@/infrastructure/repositories/ApiStoryRepository';

// Use Cases
import { GetStoriesUseCase, GetTrendingStoriesUseCase, GetNewStoriesUseCase, GetStoryByIdUseCase } from '@/application/stories/GetStories.usecase';
import { CreateStoryUseCase } from '@/application/stories/CreateStory.usecase';
import { LikeStoryUseCase, SaveStoryUseCase } from '@/application/stories/LikeStory.usecase';
import { SearchStoriesUseCase } from '@/application/stories/SearchStories.usecase';

// TODO: Cambiar a false cuando el Backend esté listo
const USE_MOCK = true;

class DIContainer {
  private storyRepo: IStoryRepository;

  constructor() {
    // Configurar repositorios según el modo
    this.storyRepo = USE_MOCK 
      ? new MockStoryRepository() 
      : new ApiStoryRepository();
  }

  // Story Use Cases
  getStoriesUseCase = () => new GetStoriesUseCase(this.storyRepo);
  getTrendingStoriesUseCase = () => new GetTrendingStoriesUseCase(this.storyRepo);
  getNewStoriesUseCase = () => new GetNewStoriesUseCase(this.storyRepo);
  getStoryByIdUseCase = () => new GetStoryByIdUseCase(this.storyRepo);
  createStoryUseCase = () => new CreateStoryUseCase(this.storyRepo);
  likeStoryUseCase = () => new LikeStoryUseCase(this.storyRepo);
  saveStoryUseCase = () => new SaveStoryUseCase(this.storyRepo);
  searchStoriesUseCase = () => new SearchStoriesUseCase(this.storyRepo);
}

export const container = new DIContainer();
