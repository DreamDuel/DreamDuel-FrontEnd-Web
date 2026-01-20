export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface StoryStats {
  views: number;
  likes: number;
}

export interface Scene {
  imageUrl: string;
  text: string;
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  author: Author;
  stats: StoryStats;
  tags: string[];
  scenes: Scene[];
}
