// Domain Entity: Character
// Representa un personaje personalizado en una historia

export class Character {
  constructor(
    public readonly id: string,
    public name: string,
    public photoUrl: string | null,
    public description?: string
  ) {}

  hasPhoto(): boolean {
    return this.photoUrl !== null && this.photoUrl.length > 0;
  }

  static createEmpty(id: string): Character {
    return new Character(id, '', null);
  }
}
