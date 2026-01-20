// Use Case: Like Story
// Maneja el like/unlike de historias

import type { IStoryRepository } from '@/domain/stories/repositories/IStoryRepository';

export class LikeStoryUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(storyId: string, userId: string): Promise<boolean> {
    // Retorna true si se dio like, false si se quitó
    return await this.storyRepository.toggleLike(storyId, userId);
  }
}

export class SaveStoryUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(storyId: string, userId: string): Promise<boolean> {
    // Retorna true si se guardó, false si se quitó
    return await this.storyRepository.toggleSave(storyId, userId);
  }
}
