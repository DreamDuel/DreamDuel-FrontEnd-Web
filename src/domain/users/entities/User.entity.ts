// Domain Entity: User
// Representa un usuario del sistema

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public email: string,
    public avatarUrl: string,
    public bio: string = '',
    public stats: UserStats = new UserStats(),
    public isPremium: boolean = false,
    public createdAt: Date = new Date()
  ) {}

  canGenerateStory(): boolean {
    // Los usuarios premium tienen generaciones ilimitadas
    if (this.isPremium) return true;
    
    // Los usuarios gratuitos tienen límite diario (esto vendría del backend)
    return true; // Simplificado por ahora
  }

  follow(): void {
    this.stats.followers++;
  }

  unfollow(): void {
    if (this.stats.followers > 0) {
      this.stats.followers--;
    }
  }
}

export class UserStats {
  constructor(
    public storiesCreated: number = 0,
    public totalLikes: number = 0,
    public followers: number = 0,
    public following: number = 0
  ) {}
}
