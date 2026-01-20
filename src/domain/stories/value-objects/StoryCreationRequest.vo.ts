// Value Object: Story Creation Request
// Representa los datos necesarios para crear una historia

export class StoryCreationRequest {
  constructor(
    public readonly prompt: string,
    public readonly tags: string[],
    public readonly intensity: number,
    public readonly visualStyle: VisualStyle,
    public readonly isPublic: boolean,
    public readonly characters: CharacterInput[] = []
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.prompt.length < 20) {
      throw new Error('El prompt debe tener al menos 20 caracteres');
    }

    if (this.prompt.length > 500) {
      throw new Error('El prompt no puede exceder 500 caracteres');
    }

    if (this.tags.length === 0) {
      throw new Error('Debes seleccionar al menos un tag');
    }

    if (this.tags.length > 3) {
      throw new Error('No puedes seleccionar más de 3 tags');
    }

    if (this.intensity < 0 || this.intensity > 1) {
      throw new Error('La intensidad debe estar entre 0 y 1');
    }

    if (this.characters.length > 4) {
      throw new Error('No puedes agregar más de 4 personajes');
    }
  }

  toJSON() {
    return {
      prompt: this.prompt,
      tags: this.tags,
      intensity: this.intensity,
      visualStyle: this.visualStyle,
      isPublic: this.isPublic,
      characters: this.characters
    };
  }
}

export type VisualStyle = 
  | 'realistic'
  | 'anime'
  | 'illustration'
  | 'cyberpunk'
  | 'fantasy';

export interface CharacterInput {
  name: string;
  photoUrl?: string;
}
