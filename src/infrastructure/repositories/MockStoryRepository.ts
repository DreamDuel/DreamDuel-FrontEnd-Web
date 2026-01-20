// Mock Repository: Story Repository
// Simulación de datos para desarrollo (será reemplazado por ApiStoryRepository)

import type { IStoryRepository, StoryFilters } from '@/domain/stories/repositories/IStoryRepository';
import { Story, Author, StoryStats, Scene } from '@/domain/stories/entities/Story.entity';
import type { StoryCreationRequest } from '@/domain/stories/value-objects/StoryCreationRequest.vo';

export class MockStoryRepository implements IStoryRepository {
  private stories: Story[] = [];
  private likedStories: Set<string> = new Set();
  private savedStories: Set<string> = new Set();

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    this.stories = [
      new Story(
        '1',
        'El Despertar de las Sombras',
        'En un mundo donde la oscuridad cobra vida, una joven descubre que puede controlar las sombras.',
        'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=600&fit=crop',
        new Author('a1', 'Luna Darkwind', 'https://i.pravatar.cc/150?img=1'),
        new StoryStats(125000, 8500, 234),
        ['Fantasía', 'Acción', 'Magia Oscura'],
        [
          new Scene('s1', 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&h=1200&fit=crop', 'Las sombras se movían a su alrededor, obedeciendo cada uno de sus pensamientos...', 1),
          new Scene('s2', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=1200&fit=crop', 'Pero con gran poder, viene una oscuridad que amenaza con consumirlo todo.', 2)
        ],
        'public'
      ),
      new Story(
        '2',
        'Neón y Circuitos',
        'En una metrópolis cyberpunk, un hacker descubre una conspiración que cambiará el mundo digital.',
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
        new Author('a2', 'CyberNova', 'https://i.pravatar.cc/150?img=2'),
        new StoryStats(98000, 7200, 189),
        ['Cyberpunk', 'Thriller', 'Tecnología'],
        [
          new Scene('s3', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=1200&fit=crop', 'Los neones iluminaban las calles mientras el código fluía por mis venas.', 1)
        ]
      ),
      new Story(
        '3',
        'Ecos del Pasado',
        'Un viaje en el tiempo la lleva a conocer los secretos más oscuros de su familia.',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
        new Author('a3', 'Temporal Writer', 'https://i.pravatar.cc/150?img=3'),
        new StoryStats(76000, 5400, 156),
        ['Sci-Fi', 'Drama', 'Misterio'],
        [
          new Scene('s4', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop', 'El pasado no es lo que parece, y el futuro depende de mis decisiones.', 1)
        ]
      ),
      new Story(
        '4',
        'La Última Guardiana',
        'Ella es la última en una línea ancestral de protectoras. Ahora debe salvar ambos mundos.',
        'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=600&fit=crop',
        new Author('a4', 'Mystic Tales', 'https://i.pravatar.cc/150?img=4'),
        new StoryStats(142000, 11000, 445),
        ['Fantasía', 'Aventura', 'Romance'],
        [
          new Scene('s5', 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=1200&fit=crop', 'El portal entre mundos se abre solo una vez cada mil años...', 1)
        ]
      ),
      new Story(
        '5',
        'Corazón de Acero',
        'En un futuro donde los humanos se fusionan con máquinas, ella debe elegir qué la hace humana.',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
        new Author('a5', 'Steel Dreams', 'https://i.pravatar.cc/150?img=5'),
        new StoryStats(89000, 6800, 278),
        ['Sci-Fi', 'Acción', 'Filosófico'],
        [
          new Scene('s6', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=1200&fit=crop', '¿Qué nos hace humanos cuando nuestros cuerpos son de metal?', 1)
        ]
      ),
      new Story(
        '6',
        'Susurros Estelares',
        'Las estrellas le hablan, revelando secretos del universo que nadie debería conocer.',
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        new Author('a6', 'Cosmic Dreamer', 'https://i.pravatar.cc/150?img=6'),
        new StoryStats(63000, 4900, 167),
        ['Fantasía', 'Cósmico', 'Misterio'],
        [
          new Scene('s7', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=1200&fit=crop', 'Las constelaciones dibujaban mensajes que solo yo podía entender.', 1)
        ]
      )
    ];
  }

  async getAll(): Promise<Story[]> {
    return this.delay([...this.stories]);
  }

  async getById(id: string): Promise<Story | null> {
    const story = this.stories.find(s => s.id === id);
    return this.delay(story || null);
  }

  async getTrending(): Promise<Story[]> {
    const trending = [...this.stories]
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, 4);
    return this.delay(trending);
  }

  async getNew(): Promise<Story[]> {
    const newStories = [...this.stories].reverse().slice(0, 4);
    return this.delay(newStories);
  }

  async getByAuthor(authorId: string): Promise<Story[]> {
    const authorStories = this.stories.filter(s => s.author.id === authorId);
    return this.delay(authorStories);
  }

  async search(query: string, filters?: StoryFilters): Promise<Story[]> {
    let results = [...this.stories];

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(s => 
        s.title.toLowerCase().includes(lowerQuery) ||
        s.synopsis.toLowerCase().includes(lowerQuery) ||
        s.author.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (filters?.tags && filters.tags.length > 0) {
      results = results.filter(s => 
        filters.tags!.some(tag => s.tags.includes(tag))
      );
    }

    if (filters?.authorId) {
      results = results.filter(s => s.author.id === filters.authorId);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'views':
          results.sort((a, b) => b.stats.views - a.stats.views);
          break;
        case 'likes':
          results.sort((a, b) => b.stats.likes - a.stats.likes);
          break;
        case 'recent':
          results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }

    return this.delay(results);
  }

  async create(request: StoryCreationRequest): Promise<Story> {
    const newId = (this.stories.length + 1).toString();
    
    // Simular generación de IA con delay largo
    await this.delay(null, 3000);
    
    const newStory = new Story(
      newId,
      `Historia generada: ${request.prompt.substring(0, 30)}...`,
      request.prompt,
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=600&fit=crop',
      new Author('current-user', 'Usuario Actual', 'https://i.pravatar.cc/150?img=10'),
      new StoryStats(0, 0, 0),
      request.tags,
      [
        new Scene('new-s1', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=1200&fit=crop', 'Esta es la primera escena de tu historia generada por IA.', 1),
        new Scene('new-s2', 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&h=1200&fit=crop', 'La historia continúa con más aventuras emocionantes.', 2)
      ],
      request.isPublic ? 'public' : 'private'
    );
    
    this.stories.unshift(newStory);
    return newStory;
  }

  async update(id: string, data: Partial<Story>): Promise<Story> {
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Historia no encontrada');
    
    this.stories[index] = { ...this.stories[index], ...data };
    return this.delay(this.stories[index]);
  }

  async delete(id: string): Promise<void> {
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Historia no encontrada');
    
    this.stories.splice(index, 1);
    return this.delay(undefined);
  }

  async incrementViews(id: string): Promise<void> {
    const story = this.stories.find(s => s.id === id);
    if (story) {
      story.view();
    }
  }

  async toggleLike(id: string, userId: string): Promise<boolean> {
    const key = `${id}-${userId}`;
    const story = this.stories.find(s => s.id === id);
    
    if (!story) throw new Error('Historia no encontrada');
    
    if (this.likedStories.has(key)) {
      this.likedStories.delete(key);
      story.stats.likes--;
      return this.delay(false);
    } else {
      this.likedStories.add(key);
      story.like();
      return this.delay(true);
    }
  }

  async toggleSave(id: string, userId: string): Promise<boolean> {
    const key = `${id}-${userId}`;
    
    if (this.savedStories.has(key)) {
      this.savedStories.delete(key);
      return this.delay(false);
    } else {
      this.savedStories.add(key);
      return this.delay(true);
    }
  }

  private delay<T>(data: T, ms: number = 800): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), ms));
  }
}
