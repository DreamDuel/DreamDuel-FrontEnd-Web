// Domain Entity: User
// Representa un usuario del sistema

export class User {
  readonly id: string;
  username: string;
  email: string;
  avatarUrl: string;
  hasUsedFreeGeneration: boolean; // Primera generación gratis
  createdAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    avatarUrl: string,

    hasUsedFreeGeneration: boolean = false,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.hasUsedFreeGeneration = hasUsedFreeGeneration;
    this.createdAt = createdAt;
  }

  canGenerateFreeImage(): boolean {
    // Solo la primera generación es gratis
    return !this.hasUsedFreeGeneration;
  }
}
