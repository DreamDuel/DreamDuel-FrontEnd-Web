// Use Case: Create Story
// Crea una nueva historia usando IA

import type { Story } from '@/domain/stories/entities/Story.entity';
import type { IStoryRepository } from '@/domain/stories/repositories/IStoryRepository';
import type { StoryCreationRequest } from '@/domain/stories/value-objects/StoryCreationRequest.vo';

export class CreateStoryUseCase {
  constructor(private storyRepository: IStoryRepository) {}

  async execute(request: StoryCreationRequest): Promise<Story> {
    // Validaciones de dominio ya están en el Value Object
    // Aquí podríamos agregar validaciones de negocio adicionales
    
    // Por ejemplo: verificar si el usuario puede generar más historias
    // (esto vendría del contexto de usuario)
    
    const story = await this.storyRepository.create(request);
    
    return story;
  }
}
