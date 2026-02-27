<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { 
  SparklesIcon, 
  PhotoIcon, 
  BoltIcon,
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

const stats = computed(() => [
  {
    icon: PhotoIcon,
    value: userStore.currentUser?.myImages?.length || 0,
    label: 'Imágenes Creadas',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    icon: BoltIcon,
    value: userStore.currentUser?.credits?.freeImagesLeft || 0,
    label: 'Créditos Disponibles',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10'
  }
]);

const recentImages = computed(() => {
  const images = userStore.currentUser?.myImages || [];
  return images.slice(0, 6);
});

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
            
            <router-link
              to="/profile"
              class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-background-card border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-background-elevated hover:border-primary/50 hover:scale-105 text-center text-sm sm:text-base"
            >
              Ver Mis Imágenes
            </router-link>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            :class="[
              'group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20 cursor-pointer overflow-hidden',
              'animate-fade-in-up'
            ]"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Background Gradient -->
            <div :class="['absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300', stat.bgGradient]"></div>
            
            <!-- Content -->
            <div class="relative">
              <div :class="['w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300', stat.gradient]">
                <component :is="stat.icon" class="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div :class="['text-3xl sm:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2', stat.gradient]">
                {{ stat.value }}
              </div>
              <div class="text-text-secondary text-sm sm:text-base font-medium">{{ stat.label }}</div>
            </div>

            <!-- Shine Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Images Gallery -->
    <section v-if="recentImages.length > 0" class="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background-deep to-background-card/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-12">
          <div class="inline-flex items-center space-x-2 mb-4">
            <FireIcon class="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Tus Creaciones Recientes</h2>
          </div>
          <p class="text-base sm:text-lg text-text-secondary">Las últimas imágenes que has generado con IA</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div
            v-for="(image, index) in recentImages"
            :key="index"
            class="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-background-elevated border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <img
              :src="image.imageUrl"
              :alt="`Imagen ${index + 1}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <div class="flex items-center justify-between text-white">
                  <span class="text-xs sm:text-sm font-medium truncate">{{ image.prompt?.slice(0, 30) || 'Imagen generada' }}...</span>
                  <HeartIcon class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-8 sm:mt-12">
          <router-link
            to="/profile"
            class="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-background-card border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-background-elevated hover:border-primary/50 hover:scale-105 text-sm sm:text-base"
          >
            <PhotoIcon class="w-5 h-5" />
            <span>Ver Todas Mis Imágenes</span>
          </router-link>
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
