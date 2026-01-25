// Pinia Store: Story Store (Presentation Layer Adapter)
// Adapta los casos de uso DDD para ser usados en componentes Vue

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Story } from '@/domain/stories/entities/Story.entity';
import type { StoryCreationRequest } from '@/domain/stories/value-objects/StoryCreationRequest.vo';
import { container } from '@/infrastructure/di/container';
import { useUserStore } from './userStore';

export const useStoryStore = defineStore('story', () => {
  // State
  const stories = ref<Story[]>([]);
  const trendingStories = ref<Story[]>([]);
  const newStories = ref<Story[]>([]);
  const savedStories = ref<Story[]>([]);
  const currentStory = ref<Story | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // IDs de historias guardadas y con like (para verificación rápida)
  const savedStoryIds = ref<Set<string>>(new Set());
  const likedStoryIds = ref<Set<string>>(new Set());

  // Getters
  const hasStories = computed(() => stories.value.length > 0);
  const featuredStory = computed(() => trendingStories.value[0] || stories.value[0] || null);
  const hasSavedStories = computed(() => savedStories.value.length > 0);
  
  // Verificar si una historia está guardada o con like
  const isStorySaved = (storyId: string) => savedStoryIds.value.has(storyId);
  const isStoryLiked = (storyId: string) => likedStoryIds.value.has(storyId);

  // Actions
  async function fetchStories(filters?: any) {
    loading.value = true;
    error.value = null;
    
    try {
      const useCase = container.getStoriesUseCase();
      stories.value = await useCase.execute(filters);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar las historias';
      console.error('Error fetching stories:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchTrendingStories() {
    loading.value = true;
    error.value = null;
    
    try {
      const useCase = container.getTrendingStoriesUseCase();
      trendingStories.value = await useCase.execute();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar tendencias';
      console.error('Error fetching trending stories:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchNewStories() {
    loading.value = true;
    error.value = null;
    
    try {
      const useCase = container.getNewStoriesUseCase();
      newStories.value = await useCase.execute();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar nuevas historias';
      console.error('Error fetching new stories:', err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchStoryById(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const useCase = container.getStoryByIdUseCase();
      const story = await useCase.execute(id);
      if (story) {
        currentStory.value = story;
      } else {
        error.value = 'Historia no encontrada';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar la historia';
      console.error('Error fetching story:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createStory(request: StoryCreationRequest): Promise<Story | null> {
    loading.value = true;
    error.value = null;
    
    try {
      const useCase = container.createStoryUseCase();
      const story = await useCase.execute(request);
      stories.value.unshift(story);
      return story;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear la historia';
      console.error('Error creating story:', err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function likeStory(storyId: string, userId: string): Promise<boolean> {
    const userStore = useUserStore();
    
    try {
      const useCase = container.likeStoryUseCase();
      const liked = await useCase.execute(storyId, userId);
      
      if (liked) {
        // Agregar a likes
        likedStoryIds.value.add(storyId);
        
        // Actualizar contador en la historia si está en alguno de los stores
        const updateStoryLikes = (storyList: Story[]) => {
          const story = storyList.find(s => s.id === storyId);
          if (story) {
            story.stats.likes++;
          }
        };
        
        updateStoryLikes(stories.value);
        updateStoryLikes(trendingStories.value);
        updateStoryLikes(newStories.value);
        updateStoryLikes(savedStories.value);
        
        if (currentStory.value?.id === storyId) {
          currentStory.value.stats.likes++;
        }
        
        // Actualizar perfil del usuario
        userStore.toggleLikeStory(storyId);
      } else {
        // Quitar like
        likedStoryIds.value.delete(storyId);
        
        const updateStoryLikes = (storyList: Story[]) => {
          const story = storyList.find(s => s.id === storyId);
          if (story && story.stats.likes > 0) {
            story.stats.likes--;
          }
        };
        
        updateStoryLikes(stories.value);
        updateStoryLikes(trendingStories.value);
        updateStoryLikes(newStories.value);
        updateStoryLikes(savedStories.value);
        
        if (currentStory.value?.id === storyId && currentStory.value.stats.likes > 0) {
          currentStory.value.stats.likes--;
        }
        
        // Actualizar perfil del usuario
        userStore.toggleLikeStory(storyId);
      }
      
      return liked;
    } catch (err) {
      console.error('Error liking story:', err);
      return false;
    }
  }

  async function saveStory(storyId: string, userId: string): Promise<boolean> {
    const userStore = useUserStore();
    
    try {
      const useCase = container.saveStoryUseCase();
      const saved = await useCase.execute(storyId, userId);
      
      if (saved) {
        // Agregar a guardadas si no está
        if (!savedStoryIds.value.has(storyId)) {
          savedStoryIds.value.add(storyId);
          
          // Buscar la historia completa en los stores existentes
          const story = [...stories.value, ...trendingStories.value, ...newStories.value]
            .find(s => s.id === storyId);
          
          if (story) {
            savedStories.value.unshift(story);
          }
          
          // Actualizar perfil del usuario
          userStore.toggleSaveStory(storyId);
        }
      } else {
        // Quitar de guardadas
        savedStoryIds.value.delete(storyId);
        savedStories.value = savedStories.value.filter(s => s.id !== storyId);
        
        // Actualizar perfil del usuario
        userStore.toggleSaveStory(storyId);
      }
      
      return saved;
    } catch (err) {
      console.error('Error saving story:', err);
      return false;
    }
  }

  async function fetchSavedStories(userId: string) {
    loading.value = true;
    error.value = null;
    
    try {
      // TODO: Cuando el backend esté listo, implementar endpoint de historias guardadas
      // Por ahora, las guardadas están en memoria
      const useCase = container.getStoriesUseCase();
      const allStories = await useCase.execute();
      
      // Filtrar solo las guardadas
      savedStories.value = allStories.filter(s => savedStoryIds.value.has(s.id));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar historias guardadas';
      console.error('Error fetching saved stories:', err);
    } finally {
      loading.value = false;
    }
  }

  async function searchStories(query: string, filters?: any) {
    loading.value = true;
    error.value = null;
    
    try {
      const useCase = container.searchStoriesUseCase();
      stories.value = await useCase.execute(query, filters);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al buscar historias';
      console.error('Error searching stories:', err);
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    stories,
    trendingStories,
    newStories,
    savedStories,
    currentStory,
    loading,
    error,
    // Getters
    hasStories,
    hasSavedStories,
    featuredStory,
    isStorySaved,
    isStoryLiked,
    // Actions
    fetchStories,
    fetchTrendingStories,
    fetchNewStories,
    fetchSavedStories,
    fetchStoryById,
    createStory,
    likeStory,
    saveStory,
    searchStories,
    clearError
  };
});
