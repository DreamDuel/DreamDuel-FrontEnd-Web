<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { 
  SparklesIcon, 
  PhotoIcon, 
  FireIcon
} from '@heroicons/vue/24/outline';
import { HeartIcon } from '@heroicons/vue/24/solid';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  userStore.loadUserFromStorage();
});

// CODIGO DE HISTORIAS - Comentado temporalmente (futuro uso)
/*
import { useStoryStore } from '@/stores/storyStore';
import StoryCard from '@/presentation/components/StoryCard.vue';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';

const storyStore = useStoryStore();

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
*/

const navigateToGenerator = () => {
  router.push('/images');
};

</script>

<template>
  <div class="min-h-screen bg-background-deep overflow-hidden">
    <!-- Hero Section -->
    <section class="relative py-12 sm:py-16 md:py-24 lg:py-32">
      <!-- Animated Background Blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
        <div class="absolute top-1/3 right-1/4 w-72 h-72 sm:w-[500px] sm:h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-0 left-1/3 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <!-- Content -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <!-- Badge -->
          <div class="inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 sm:mb-8 backdrop-blur-sm animate-fade-in">
            <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
            <span class="text-primary font-semibold text-sm sm:text-base">Generador de Imágenes con IA</span>
          </div>

          <!-- Main Heading -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2 animate-slide-up">
            Transforma tus ideas en
            <span class="block mt-2 bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
              imágenes increíbles
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg sm:text-xl md:text-2xl text-text-secondary mb-8 sm:mb-12 max-w-2xl mx-auto px-4 animate-fade-in-delay">
            Crea imágenes únicas con inteligencia artificial. Simple, rápido y poderoso.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 animate-slide-up-delay">
            <button
              @click="navigateToGenerator"
              class="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50 overflow-hidden"
            >
              <span class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              <span class="relative flex items-center justify-center space-x-2">
                <PhotoIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                <span class="text-sm sm:text-base">Crear Imagen Ahora</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIONES DE HISTORIAS - Comentadas temporalmente (futuro uso)
    <section v-if="publicFeaturedStory" class="relative h-[70vh] min-h-[600px] overflow-hidden">
      <div class="absolute inset-0">
        <img
          v-if="publicFeaturedStory.frames?.[0]?.imageUrl"
          :src="publicFeaturedStory.frames[0].imageUrl"
          :alt="publicFeaturedStory.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-background-deep via-background-deep/60 to-transparent"></div>
      </div>

      <div class="relative h-full max-w-7xl mx-auto px-4 flex items-end pb-16">
        <div class="max-w-2xl">
          <div class="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary text-sm font-semibold mb-4">
            ⭐ {{ t('home.featured') }}
          </div>
          <h1 class="text-5xl md:text-7xl font-bold text-white mb-4">
            {{ publicFeaturedStory.title }}
          </h1>
          <p class="text-xl text-gray-300 mb-6 line-clamp-2">
            {{ publicFeaturedStory.synopsis }}
          </p>
          <div class="flex items-center space-x-4 mb-6">
            <div class="flex items-center space-x-2">
              <img
                :src="publicFeaturedStory.authorAvatar || 'https://via.placeholder.com/40'"
                :alt="publicFeaturedStory.authorName"
                class="w-10 h-10 rounded-full border-2 border-primary"
              />
              <span class="text-gray-300">{{ publicFeaturedStory.authorName }}</span>
            </div>
            <span class="text-gray-400">•</span>
            <span class="text-gray-400">{{ publicFeaturedStory.views?.toLocaleString() }} {{ t('home.views') }}</span>
          </div>
          <router-link
            :to="`/reader/${publicFeaturedStory.id}`"
            class="inline-flex items-center space-x-2 px-8 py-4 bg-primary hover:bg-primary-light text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
          >
            <PlayIcon class="w-6 h-6" />
            <span>{{ t('home.readNow') }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-text-primary">🔥 {{ t('home.trending') }}</h2>
        <div class="flex space-x-2">
          <button
            @click="scrollCarousel('left', 'trending-carousel')"
            class="p-2 bg-background-card hover:bg-background-elevated border border-white/10 rounded-lg transition-colors"
          >
            <ChevronLeftIcon class="w-6 h-6 text-text-secondary" />
          </button>
          <button
            @click="scrollCarousel('right', 'trending-carousel')"
            class="p-2 bg-background-card hover:bg-background-elevated border border-white/10 rounded-lg transition-colors"
          >
            <ChevronRightIcon class="w-6 h-6 text-text-secondary" />
          </button>
        </div>
      </div>

      <div
        id="trending-carousel"
        class="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
      >
        <StoryCard
          v-for="story in publicTrendingStories"
          :key="story.id"
          :story="story"
          class="flex-shrink-0 w-80"
        />
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold text-text-primary">✨ {{ t('home.new') }}</h2>
        <div class="flex space-x-2">
          <button
            @click="scrollCarousel('left', 'new-carousel')"
            class="p-2 bg-background-card hover:bg-background-elevated border border-white/10 rounded-lg transition-colors"
          >
            <ChevronLeftIcon class="w-6 h-6 text-text-secondary" />
          </button>
          <button
            @click="scrollCarousel('right', 'new-carousel')"
            class="p-2 bg-background-card hover:bg-background-elevated border border-white/10 rounded-lg transition-colors"
          >
            <ChevronRightIcon class="w-6 h-6 text-text-secondary" />
          </button>
        </div>
      </div>

      <div
        id="new-carousel"
        class="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
      >
        <StoryCard
          v-for="story in publicNewStories"
          :key="story.id"
          :story="story"
          class="flex-shrink-0 w-80"
        />
      </div>
    </section>
    -->
  </div>
</template>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animate-slide-up-delay {
  animation: slide-up 0.8s ease-out 0.4s both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
