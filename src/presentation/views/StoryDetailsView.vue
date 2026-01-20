<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';
import { ArrowLeftIcon, ShareIcon, HeartIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
import { PlayIcon } from '@heroicons/vue/24/solid';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();

onMounted(async () => {
  const storyId = route.params.id as string;
  await storyStore.fetchStoryById(storyId);
});

const goBack = () => {
  router.back();
};

const readStory = () => {
  router.push(`/story/${route.params.id}`);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <!-- Header -->
    <div class="fixed top-0 left-0 right-0 z-40 bg-background-elevated/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          @click="goBack"
          class="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5" />
          <span class="hidden sm:inline">Volver</span>
        </button>
        
        <button class="text-text-secondary hover:text-primary transition-colors">
          <ShareIcon class="h-6 w-6" />
        </button>
      </div>
    </div>

    <div v-if="storyStore.currentStory" class="pt-20 pb-20">
      <div class="max-w-5xl mx-auto px-4">
        <!-- Cover & Info -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Cover Image -->
          <div class="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
            <img
              :src="storyStore.currentStory.coverUrl"
              :alt="storyStore.currentStory.title"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <!-- Info -->
          <div class="flex flex-col justify-center">
            <h1 class="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              {{ storyStore.currentStory.title }}
            </h1>

            <!-- Author -->
            <div class="flex items-center space-x-4 mb-6">
              <img
                :src="storyStore.currentStory.author.avatarUrl"
                :alt="storyStore.currentStory.author.name"
                class="w-14 h-14 rounded-full border-2 border-primary"
              />
              <div class="flex-1">
                <p class="text-text-primary font-semibold text-lg">
                  {{ storyStore.currentStory.author.name }}
                </p>
                <p class="text-text-tertiary text-sm">Autor</p>
              </div>
              <button class="px-6 py-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors">
                Seguir
              </button>
            </div>

            <!-- Synopsis -->
            <p class="text-text-secondary text-lg leading-relaxed mb-6">
              {{ storyStore.currentStory.synopsis }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in storyStore.currentStory.tags"
                :key="tag"
                class="px-4 py-2 bg-primary/20 border border-primary/40 text-primary text-sm font-medium rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Stats -->
            <div class="flex items-center space-x-6 text-text-tertiary mb-8">
              <div class="flex items-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{{ formatNumber(storyStore.currentStory.stats.views) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <HeartIcon class="h-5 w-5" />
                <span>{{ formatNumber(storyStore.currentStory.stats.likes) }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{{ formatNumber(storyStore.currentStory.stats.comments) }}</span>
              </div>
            </div>

            <!-- Main CTA -->
            <button
              @click="readStory"
              class="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105 mb-4"
            >
              <PlayIcon class="h-7 w-7" />
              <span>Leer Historia</span>
            </button>

            <!-- Secondary Actions -->
            <div class="flex space-x-3">
              <button class="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-background-card hover:bg-background-elevated border border-white/10 rounded-xl transition-colors">
                <HeartIcon class="h-5 w-5" />
                <span>Like</span>
              </button>
              <button class="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-background-card hover:bg-background-elevated border border-white/10 rounded-xl transition-colors">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Guardar</span>
              </button>
              <button class="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-background-card hover:bg-background-elevated border border-white/10 rounded-xl transition-colors">
                <ShareIcon class="h-5 w-5" />
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Scene Previews -->
        <div class="mb-12">
          <h2 class="text-2xl font-bold text-text-primary mb-6">Escenas de esta historia</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              v-for="(scene, index) in storyStore.currentStory.scenes"
              :key="scene.id"
              @click="readStory"
              class="group relative aspect-[2/3] rounded-xl overflow-hidden"
            >
              <img
                :src="scene.imageUrl"
                :alt="`Escena ${index + 1}`"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <p class="text-white text-sm font-medium">Escena {{ index + 1 }}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="storyStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
    </div>
  </div>
</template>
