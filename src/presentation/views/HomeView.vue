<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useStoryStore } from '@/stores/storyStore';
import StoryCard from '@/presentation/components/StoryCard.vue';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const storyStore = useStoryStore();

// Filtrar solo historias públicas
const publicTrendingStories = computed(() => 
  storyStore.trendingStories.filter(s => s.visibility === 'public')
);

const publicNewStories = computed(() => 
  storyStore.newStories.filter(s => s.visibility === 'public')
);

const publicFeaturedStory = computed(() => {
  const featured = storyStore.featuredStory;
  return featured?.visibility === 'public' ? featured : publicTrendingStories.value[0] || null;
});

onMounted(async () => {
  await Promise.all([
    storyStore.fetchTrendingStories(),
    storyStore.fetchNewStories()
  ]);
});

const scrollCarousel = (direction: 'left' | 'right', containerId: string) => {
  const container = document.getElementById(containerId);
  if (container) {
    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section v-if="publicFeaturedStory" class="relative h-[60vh] sm:h-[70vh] overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          :src="publicFeaturedStory.coverUrl" 
          :alt="publicFeaturedStory.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-background-deep via-background-deep/80 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-t from-background-deep via-transparent to-transparent" />
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div class="max-w-xl md:max-w-2xl">
          <!-- Badge -->
          <div class="inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full mb-4 sm:mb-6">
            <span class="text-primary text-xs sm:text-sm font-semibold">✨ MÁS POPULAR</span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-3 sm:mb-4 leading-tight">
            {{ publicFeaturedStory.title }}
          </h1>

          <!-- Synopsis -->
          <p class="text-base sm:text-lg md:text-xl text-text-secondary mb-4 sm:mb-6 leading-relaxed line-clamp-3">
            {{ publicFeaturedStory.synopsis }}
          </p>

          <!-- Author Info -->
          <div class="flex items-center space-x-3 mb-6 sm:mb-8">
            <img 
              :src="publicFeaturedStory.author.avatarUrl" 
              :alt="publicFeaturedStory.author.name"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-primary"
            />
            <div>
              <p class="text-text-primary font-medium text-sm sm:text-base">{{ publicFeaturedStory.author.name }}</p>
              <p class="text-text-tertiary text-xs sm:text-sm">
                {{ (publicFeaturedStory.stats.views / 1000).toFixed(0) }}K lecturas
              </p>
            </div>
          </div>

          <!-- CTA Button -->
          <router-link 
            :to="`/story/${publicFeaturedStory.id}`"
            class="inline-flex items-center space-x-2 sm:space-x-3 px-6 py-3 sm:px-8 sm:py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            <PlayIcon class="h-5 w-5 sm:h-6 sm:w-6" />
            <span>LEER AHORA</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Trending Stories Carousel -->
    <section class="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">🔥 En Tendencia</h2>
            <p class="text-text-secondary text-sm sm:text-base">Las historias más populares de la semana</p>
          </div>
          
          <!-- Carousel Controls -->
          <div class="hidden md:flex space-x-2">
            <button 
              @click="scrollCarousel('left', 'trending-carousel')"
              class="p-2 bg-background-card hover:bg-background-elevated rounded-lg transition-colors"
            >
              <ChevronLeftIcon class="h-6 w-6 text-text-secondary" />
            </button>
            <button 
              @click="scrollCarousel('right', 'trending-carousel')"
              class="p-2 bg-background-card hover:bg-background-elevated rounded-lg transition-colors"
            >
              <ChevronRightIcon class="h-6 w-6 text-text-secondary" />
            </button>
          </div>
        </div>

        <!-- Carousel -->
        <div v-if="storyStore.loading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <div 
          v-else
          id="trending-carousel"
          class="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-hide snap-x snap-mandatory"
          style="scroll-behavior: smooth;"
        >
          <div 
            v-for="story in publicTrendingStories" 
            :key="story.id"
            class="flex-shrink-0 w-48 sm:w-56 md:w-64 snap-start"
          >
            <StoryCard :story="story" />
          </div>
        </div>
      </div>
    </section>

    <!-- New Stories Carousel -->
    <section class="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background-elevated/30">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">✨ Recién Llegadas</h2>
            <p class="text-text-secondary text-sm sm:text-base">Descubre las últimas creaciones</p>
          </div>
          
          <!-- Carousel Controls -->
          <div class="hidden md:flex space-x-2">
            <button 
              @click="scrollCarousel('left', 'new-carousel')"
              class="p-2 bg-background-card hover:bg-background-elevated rounded-lg transition-colors"
            >
              <ChevronLeftIcon class="h-6 w-6 text-text-secondary" />
            </button>
            <button 
              @click="scrollCarousel('right', 'new-carousel')"
              class="p-2 bg-background-card hover:bg-background-elevated rounded-lg transition-colors"
            >
              <ChevronRightIcon class="h-6 w-6 text-text-secondary" />
            </button>
          </div>
        </div>

        <!-- Carousel -->
        <div 
          id="new-carousel"
          class="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-hide snap-x snap-mandatory"
          style="scroll-behavior: smooth;"
        >
          <div 
            v-for="story in publicNewStories" 
            :key="story.id"
            class="flex-shrink-0 w-48 sm:w-56 md:w-64 snap-start"
          >
            <StoryCard :story="story" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
