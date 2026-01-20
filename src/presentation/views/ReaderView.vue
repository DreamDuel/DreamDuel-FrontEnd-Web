<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';
import { HeartIcon, ShareIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();

const isLiked = computed(() => {
  if (!storyStore.currentStory) return false;
  return storyStore.isStoryLiked(storyStore.currentStory.id);
});

onMounted(async () => {
  const storyId = route.params.id as string;
  await storyStore.fetchStoryById(storyId);
});

const goBack = () => {
  router.push('/');
};

const toggleLike = async () => {
  if (!storyStore.currentStory) return;
  const userId = 'current-user-id';
  await storyStore.likeStory(storyStore.currentStory.id, userId);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
</script>

<template>
  <div class="min-h-screen bg-background-deep pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-sm border-b border-white/5">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5" />
          <span>Atrás</span>
        </button>
        <div class="flex items-center space-x-4">
          <button class="text-text-secondary hover:text-text-primary transition-colors">
            <ShareIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="storyStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-white text-lg">Cargando historia...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="storyStore.error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-error text-xl mb-4">{{ storyStore.error }}</p>
        <button 
          @click="goBack"
          class="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>

    <!-- Story Content -->
    <div v-else-if="storyStore.currentStory" class="max-w-4xl mx-auto px-4 py-8">
      <!-- Story Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          {{ storyStore.currentStory.title }}
        </h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-text-secondary text-sm">
            <span>{{ storyStore.currentStory.author.name }}</span>
            <span>•</span>
            <span>{{ formatNumber(storyStore.currentStory.stats.views) }} lecturas</span>
          </div>
          <button 
            @click="toggleLike"
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
            :class="isLiked ? 'bg-accent-crimson text-white' : 'bg-background-elevated text-text-primary hover:bg-background-card'"
          >
            <component :is="isLiked ? HeartIconSolid : HeartIcon" class="h-5 w-5" />
            <span>{{ formatNumber(storyStore.currentStory.stats.likes) }}</span>
          </button>
        </div>
      </div>

      <!-- Scenes -->
      <div class="space-y-8">
        <div 
          v-for="(scene, index) in storyStore.currentStory.scenes" 
          :key="scene.id"
          class="bg-background-elevated rounded-xl overflow-hidden shadow-lg"
        >
          <img 
            :src="scene.imageUrl" 
            :alt="`Escena ${index + 1}`"
            class="w-full h-auto"
          />
          <div class="p-6">
            <p class="text-text-primary text-lg leading-relaxed">
              {{ scene.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- End Card -->
      <div class="mt-12 text-center bg-background-elevated rounded-xl p-8">
        <div class="text-5xl mb-4">✨</div>
        <h3 class="text-2xl font-bold text-text-primary mb-4">Fin del Capítulo</h3>
        <p class="text-text-secondary mb-6">¿Te gustó esta historia?</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            @click="toggleLike"
            :class="[
              'flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
              isLiked 
                ? 'bg-accent-crimson text-white' 
                : 'bg-background-card text-text-primary hover:bg-accent-crimson/20'
            ]"
          >
            <component :is="isLiked ? HeartIconSolid : HeartIcon" class="h-5 w-5" />
            <span>{{ isLiked ? 'Te gusta' : 'Me gusta' }}</span>
          </button>
          <button 
            @click="goBack"
            class="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all"
          >
            Explorar más historias
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed */
</style>
