// Domain Entity: Story
// Representa una historia en el sistema

export class Story {
  constructor(
    public readonly id: string,
    public title: string,
    public synopsis: string,
    public coverUrl: string,
    public author: Author,
    public stats: StoryStats,
    public tags: string[],
    public scenes: Scene[],
    public visibility: 'public' | 'private' = 'public',
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // Domain methods
  like(): void {
    this.stats.likes++;
  }

  view(): void {
    this.stats.views++;
  }

  addComment(): void {
    this.stats.comments++;
  }

  isPublic(): boolean {
    return this.visibility === 'public';
  }

  canBeEditedBy(userId: string): boolean {
    return this.author.id === userId;
  }
}

export class Author {
  constructor(
    public readonly id: string,
    public name: string,
    public avatarUrl: string,
    public bio?: string
  ) {}
}

export class StoryStats {
  constructor(
    public views: number = 0,
    public likes: number = 0,
    public comments: number = 0,
    public saves: number = 0
  ) {}
}

export class Scene {
  constructor(
    public readonly id: string,
    public imageUrl: string,
    public text: string,
    public order: number
  ) {}
}
