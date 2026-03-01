// Pinia Store: Story Store (Presentation Layer Adapter)
// Adapta los casos de uso DDD para ser usados en componentes Vue

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Story } from '@/domain/stories/entities/Story.entity';
import type { StoryCreationRequest } from '@/domain/stories/value-objects/StoryCreationRequest.vo';
import { container } from '@/infrastructure/di/container';

export const useStoryStore = defineStore('story', () => {
  // State
  const stories = ref<Story[]>([]);
  const trendingStories = ref<Story[]>([]);
  const newStories = ref<Story[]>([]);
  const savedStories = ref<Story[]>([]);
  const currentStory = ref<Story | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const hasStories = computed(() => stories.value.length > 0);
  const featuredStory = computed(() => trendingStories.value[0] || stories.value[0] || null);

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



  async function fetchSavedStories() {
    // Reserved for future - saved stories feature removed
    savedStories.value = [];
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
    // Reserved for future story sync logic
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
    featuredStory,
    // Actions
    fetchStories,
    fetchTrendingStories,
    fetchNewStories,
    fetchSavedStories,
    fetchStoryById,
    createStory,
    updateStoryVisibility,
    searchStories,
    syncUserData,
    clearError
  };
});
