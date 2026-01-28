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
        
        // Agregar a likedStories del usuario si no está
        if (userStore.currentUser && !userStore.currentUser.likedStories.includes(storyId)) {
          userStore.currentUser.likedStories.push(storyId);
          userStore.currentUser.stats.totalLikes++;
          localStorage.setItem('dreamduel_user', JSON.stringify(userStore.currentUser));
        }
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
        
        // Quitar de likedStories del usuario
        if (userStore.currentUser) {
          const index = userStore.currentUser.likedStories.indexOf(storyId);
          if (index > -1) {
            userStore.currentUser.likedStories.splice(index, 1);
            if (userStore.currentUser.stats.totalLikes > 0) {
              userStore.currentUser.stats.totalLikes--;
            }
            localStorage.setItem('dreamduel_user', JSON.stringify(userStore.currentUser));
          }
        }
      }
      
      return liked;
    } catch (err) {
      console.error('Error liking story:', err);
      return false;
    }
  }

  async function updateStoryVisibility(storyId: string, isPublic: boolean): Promise<boolean> {
    try {
      const repository = container.getStoryRepository();
      const story = await repository.getById(storyId);
      
      if (!story) {
        throw new Error('Historia no encontrada');
      }
      
      // Actualizar visibilidad
      const visibility = isPublic ? 'public' : 'private';
      await repository.update(storyId, { visibility } as any);
      
      // Actualizar en el estado local de forma reactiva
      const updateVisibility = (storyList: Story[]) => {
        const storyInList = storyList.find(s => s.id === storyId);
        if (storyInList) {
          // Forzar reactividad completa
          Object.assign(storyInList, { visibility });
        }
      };
      
      updateVisibility(stories.value);
      updateVisibility(trendingStories.value);
      updateVisibility(newStories.value);
      updateVisibility(savedStories.value);
      
      if (currentStory.value?.id === storyId) {
        Object.assign(currentStory.value, { visibility });
      }
      
      // Actualizar localStorage si es historia del usuario
      const userStoriesData = localStorage.getItem('dreamduel_user_stories');
      if (userStoriesData) {
        const userStories = JSON.parse(userStoriesData);
        const userStory = userStories.find((s: any) => s.id === storyId);
        if (userStory) {
          userStory.visibility = visibility;
          localStorage.setItem('dreamduel_user_stories', JSON.stringify(userStories));
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error updating story visibility:', err);
      return false;
    }
  }

  async function saveStory(storyId: string, userId: string): Promise<boolean> {
    const userStore = useUserStore();
    
    try {
      const useCase = container.saveStoryUseCase();
      const saved = await useCase.execute(storyId, userId);
      
      if (saved) {
        // Agregar a guardadas
        savedStoryIds.value.add(storyId);
        
        // Agregar a savedStories del usuario si no está
        if (userStore.currentUser && !userStore.currentUser.savedStories.includes(storyId)) {
          userStore.currentUser.savedStories.push(storyId);
          localStorage.setItem('dreamduel_user', JSON.stringify(userStore.currentUser));
        }
      } else {
        // Quitar de guardadas
        savedStoryIds.value.delete(storyId);
        
        // Quitar de savedStories del usuario
        if (userStore.currentUser) {
          const index = userStore.currentUser.savedStories.indexOf(storyId);
          if (index > -1) {
            userStore.currentUser.savedStories.splice(index, 1);
            localStorage.setItem('dreamduel_user', JSON.stringify(userStore.currentUser));
          }
        }
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

  // Sincronizar likes y saves desde el userStore
  function syncUserData() {
    const userStore = useUserStore();
    if (userStore.currentUser) {
      // Sincronizar liked stories
      likedStoryIds.value.clear();
      if (userStore.currentUser.likedStories) {
        userStore.currentUser.likedStories.forEach(id => {
          likedStoryIds.value.add(id);
        });
      }
      
      // Sincronizar saved stories
      savedStoryIds.value.clear();
      if (userStore.currentUser.savedStories) {
        userStore.currentUser.savedStories.forEach(id => {
          savedStoryIds.value.add(id);
        });
      }
    }
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
    updateStoryVisibility,
    likeStory,
    saveStory,
    searchStories,
    syncUserData,
    clearError
  };
});
