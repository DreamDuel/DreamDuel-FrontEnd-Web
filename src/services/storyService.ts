import type { Story } from '@/models/Story';

// Mock data para simular respuesta del backend
const mockStories: Story[] = [
  {
    id: '1',
    title: 'El Despertar de las Sombras',
    synopsis: 'En un mundo donde la oscuridad cobra vida, una joven descubre que puede controlar las sombras.',
    coverUrl: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=600&fit=crop',
    author: {
      id: 'a1',
      name: 'Luna Darkwind',
      avatarUrl: 'https://i.pravatar.cc/150?img=1'
    },
    stats: {
      views: 125000,
      likes: 8500
    },
    tags: ['Fantasía', 'Acción', 'Magia Oscura'],
    scenes: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&h=1200&fit=crop',
        text: 'Las sombras se movían a su alrededor, obedeciendo cada uno de sus pensamientos...'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=1200&fit=crop',
        text: 'Pero con gran poder, viene una oscuridad que amenaza con consumirlo todo.'
      }
    ]
  },
  {
    id: '2',
    title: 'Neón y Circuitos',
    synopsis: 'En una metrópolis cyberpunk, un hacker descubre una conspiración que cambiará el mundo digital.',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
    author: {
      id: 'a2',
      name: 'CyberNova',
      avatarUrl: 'https://i.pravatar.cc/150?img=2'
    },
    stats: {
      views: 98000,
      likes: 7200
    },
    tags: ['Cyberpunk', 'Thriller', 'Tecnología'],
    scenes: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=1200&fit=crop',
        text: 'Los neones iluminaban las calles mientras el código fluía por mis venas.'
      }
    ]
  },
  {
    id: '3',
    title: 'Ecos del Pasado',
    synopsis: 'Un viaje en el tiempo la lleva a conocer los secretos más oscuros de su familia.',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
    author: {
      id: 'a3',
      name: 'Temporal Writer',
      avatarUrl: 'https://i.pravatar.cc/150?img=3'
    },
    stats: {
      views: 76000,
      likes: 5400
    },
    tags: ['Sci-Fi', 'Drama', 'Misterio'],
    scenes: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop',
        text: 'El pasado no es lo que parece, y el futuro depende de mis decisiones.'
      }
    ]
  },
  {
    id: '4',
    title: 'La Última Guardiana',
    synopsis: 'Ella es la última en una línea ancestral de protectoras. Ahora debe salvar ambos mundos.',
    coverUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=600&fit=crop',
    author: {
      id: 'a4',
      name: 'Mystic Tales',
      avatarUrl: 'https://i.pravatar.cc/150?img=4'
    },
    stats: {
      views: 142000,
      likes: 11000
    },
    tags: ['Fantasía', 'Aventura', 'Romance'],
    scenes: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=1200&fit=crop',
        text: 'El portal entre mundos se abre solo una vez cada mil años...'
      }
    ]
  },
  {
    id: '5',
    title: 'Corazón de Acero',
    synopsis: 'En un futuro donde los humanos se fusionan con máquinas, ella debe elegir qué la hace humana.',
    coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    author: {
      id: 'a5',
      name: 'Steel Dreams',
      avatarUrl: 'https://i.pravatar.cc/150?img=5'
    },
    stats: {
      views: 89000,
      likes: 6800
    },
    tags: ['Sci-Fi', 'Acción', 'Filosófico'],
    scenes: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=1200&fit=crop',
        text: '¿Qué nos hace humanos cuando nuestros cuerpos son de metal?'
      }
    ]
  },
  {
    id: '6',
    title: 'Susurros Estelares',
    synopsis: 'Las estrellas le hablan, revelando secretos del universo que nadie debería conocer.',
    coverUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
    author: {
      id: 'a6',
      name: 'Cosmic Dreamer',
      avatarUrl: 'https://i.pravatar.cc/150?img=6'
    },
    stats: {
      views: 63000,
      likes: 4900
    },
    tags: ['Fantasía', 'Cósmico', 'Misterio'],
    scenes: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=1200&fit=crop',
        text: 'Las constelaciones dibujaban mensajes que solo yo podía entender.'
      }
    ]
  }
];

export const storyService = {
  /**
   * Simula una llamada a API para obtener historias
   * @returns Promise con array de historias
   */
  async getStories(): Promise<Story[]> {
    // Simular latencia de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockStories]);
      }, 1000);
    });
  },

  /**
   * Obtiene una historia por ID
   * @param id - ID de la historia
   * @returns Promise con la historia o undefined
   */
  async getStoryById(id: string): Promise<Story | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const story = mockStories.find(s => s.id === id);
        resolve(story);
      }, 500);
    });
  },

  /**
   * Obtiene historias en tendencia
   * @returns Promise con las historias más populares
   */
  async getTrendingStories(): Promise<Story[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trending = [...mockStories]
          .sort((a, b) => b.stats.views - a.stats.views)
          .slice(0, 4);
        resolve(trending);
      }, 800);
    });
  },

  /**
   * Obtiene historias nuevas
   * @returns Promise con las historias más recientes
   */
  async getNewStories(): Promise<Story[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newStories = [...mockStories].reverse().slice(0, 4);
        resolve(newStories);
      }, 800);
    });
  }
};
