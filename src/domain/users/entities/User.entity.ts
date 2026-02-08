// Domain Entity: User
// Representa un usuario del sistema

export class User {
  readonly id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  stats: UserStats;
  isPremium: boolean;
  createdAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    avatarUrl: string,
    bio: string = '',
    stats: UserStats = new UserStats(),
    isPremium: boolean = false,
    createdAt: Date = new Date()
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.avatarUrl = avatarUrl;
    this.bio = bio;
    this.stats = stats;
    this.isPremium = isPremium;
    this.createdAt = createdAt;
  }

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
  storiesCreated: number;
  totalLikes: number;
  followers: number;
  following: number;

  constructor(
    storiesCreated: number = 0,
    totalLikes: number = 0,
    followers: number = 0,
    following: number = 0
  ) {
    this.storiesCreated = storiesCreated;
    this.totalLikes = totalLikes;
    this.followers = followers;
    this.following = following;
  }
}
