<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';
import StoryCard from '@/presentation/components/StoryCard.vue';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const storyStore = useStoryStore();

const searchQuery = ref('');
const showFilters = ref(false);
const selectedTags = ref<string[]>([]);
const selectedStyle = ref<string>('');
const sortBy = ref<'recent' | 'views' | 'likes'>('recent');

const availableTags = [
  'Romance', 'Thriller', 'Fantasía', 'Terror', 
  'Comedia', 'Drama', 'Ciencia Ficción', 'Acción'
];

const visualStyles = [
  { id: 'realistic', name: 'Realista' },
  { id: 'anime', name: 'Anime' },
  { id: 'illustration', name: 'Ilustración' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'fantasy', name: 'Fantasy Art' }
];

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  const filters = {
    tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
    visualStyle: selectedStyle.value || undefined,
    sortBy: sortBy.value
  };
  
  await storyStore.searchStories(searchQuery.value, filters);
};

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const applyFilters = () => {
  showFilters.value = false;
  handleSearch();
};

const clearFilters = () => {
  selectedTags.value = [];
  selectedStyle.value = '';
  sortBy.value = 'recent';
  handleSearch();
};

const clearSearch = () => {
  searchQuery.value = '';
  storyStore.stories = [];
};
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Search Header -->
      <div class="mb-8">
        <!-- Search Input -->
        <div class="flex items-center space-x-4 mb-4">
          <div class="flex-1 relative">
            <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-text-tertiary" />
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Buscar historias, autores, tags..."
              class="w-full pl-14 pr-12 py-4 bg-background-card border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </div>
          
          <!-- Filter Button -->
          <button
            @click="showFilters = !showFilters"
            class="p-4 bg-background-card hover:bg-background-elevated border border-white/10 rounded-xl transition-colors relative"
          >
            <AdjustmentsHorizontalIcon class="h-6 w-6 text-text-secondary" />
            <span
              v-if="selectedTags.length > 0 || selectedStyle"
              class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-white"
            >
              {{ selectedTags.length + (selectedStyle ? 1 : 0) }}
            </span>
          </button>
        </div>

        <!-- Filters Panel -->
        <div
          v-if="showFilters"
          class="bg-background-card rounded-xl p-6 border border-white/10 space-y-6"
        >
          <!-- Tags Filter -->
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-3">Géneros</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in availableTags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white'
                    : 'bg-background-elevated text-text-secondary hover:bg-background-elevated/80'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Visual Style Filter -->
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-3">Estilo Visual</label>
            <select
              v-model="selectedStyle"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            >
              <option value="">Todos los estilos</option>
              <option v-for="style in visualStyles" :key="style.id" :value="style.id">
                {{ style.name }}
              </option>
            </select>
          </div>

          <!-- Sort By -->
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-3">Ordenar por</label>
            <div class="flex space-x-4">
              <button
                @click="sortBy = 'recent'"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl font-medium transition-all',
                  sortBy === 'recent'
                    ? 'bg-primary text-white'
                    : 'bg-background-elevated text-text-secondary hover:bg-background-elevated/80'
                ]"
              >
                Más recientes
              </button>
              <button
                @click="sortBy = 'views'"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl font-medium transition-all',
                  sortBy === 'views'
                    ? 'bg-primary text-white'
                    : 'bg-background-elevated text-text-secondary hover:bg-background-elevated/80'
                ]"
              >
                Más vistos
              </button>
              <button
                @click="sortBy = 'likes'"
                :class="[
                  'flex-1 px-4 py-3 rounded-xl font-medium transition-all',
                  sortBy === 'likes'
                    ? 'bg-primary text-white'
                    : 'bg-background-elevated text-text-secondary hover:bg-background-elevated/80'
                ]"
              >
                Más likes
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex space-x-4">
            <button
              @click="applyFilters"
              class="flex-1 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-colors"
            >
              Aplicar
            </button>
            <button
              @click="clearFilters"
              class="px-6 py-3 bg-background-elevated hover:bg-background-elevated/80 text-text-secondary font-semibold rounded-xl transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-if="storyStore.loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>

      <div v-else-if="storyStore.stories.length > 0">
        <h2 class="text-2xl font-bold text-text-primary mb-6">
          {{ storyStore.stories.length }} resultados encontrados
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoryCard
            v-for="story in storyStore.stories"
            :key="story.id"
            :story="story"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="searchQuery" class="text-center py-20">
        <MagnifyingGlassIcon class="h-20 w-20 text-text-tertiary mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-text-primary mb-2">No encontramos historias</h3>
        <p class="text-text-secondary">Intenta con otros términos de búsqueda</p>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center py-20">
        <MagnifyingGlassIcon class="h-20 w-20 text-text-tertiary mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-text-primary mb-2">Busca historias increíbles</h3>
        <p class="text-text-secondary">Escribe para comenzar a buscar</p>
      </div>
    </div>
  </div>
</template>
