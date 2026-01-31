<script setup lang="ts">
import { EyeIcon, HeartIcon, BookmarkIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/vue/24/solid';
import { computed } from 'vue';
import { useStoryStore } from '@/stores/storyStore';
import { useUserStore } from '@/stores/userStore';
import type { Story } from '@/models/Story';

const props = defineProps<{
  story: Story;
}>();

const storyStore = useStoryStore();
const userStore = useUserStore();

const isSaved = computed(() => storyStore.isStorySaved(props.story.id));
const isLiked = computed(() => storyStore.isStoryLiked(props.story.id));

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const toggleSave = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!userStore.currentUser) {
    console.warn('User not logged in');
    return;
  }
  
  await storyStore.saveStory(props.story.id, userStore.currentUser.id);
};

const toggleLike = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  
  if (!userStore.currentUser) {
    console.warn('User not logged in');
    return;
  }
  
  await storyStore.likeStory(props.story.id, userStore.currentUser.id);
};
</script>

<template>
  <router-link 
    :to="`/story/${story.id}`"
    class="group block bg-background-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] md:hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
  >
    <!-- Cover Image -->
    <div class="relative w-full h-[280px] sm:h-[320px] md:h-[360px] overflow-hidden">
      <img 
        :src="story.coverUrl" 
        :alt="story.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <!-- Tags -->
      <div class="absolute top-2 left-2 flex flex-wrap gap-1">
        <!-- Badge de Privado -->
        <span 
          v-if="story.visibility === 'private'"
          class="px-2 py-1 text-xs bg-accent-crimson/90 backdrop-blur-sm text-white rounded-full font-semibold flex items-center space-x-1"
        >
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <span>PRIVADA</span>
        </span>
        <span 
          v-for="tag in story.tags.slice(0, 2)" 
          :key="tag"
          class="px-2 py-1 text-xs bg-background-elevated/90 backdrop-blur-sm text-text-secondary rounded-full"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Save Button -->
      <button
        @click="toggleSave"
        class="absolute top-2 right-2 p-2 bg-background-elevated/90 backdrop-blur-sm rounded-full text-text-secondary hover:text-primary hover:bg-background-card transition-all opacity-0 group-hover:opacity-100"
      >
        <component :is="isSaved ? BookmarkIconSolid : BookmarkIcon" class="h-5 w-5" />
      </button>
    </div>

    <!-- Info Section -->
    <div class="p-3 sm:p-4">
      <!-- Title -->
      <h3 class="text-base sm:text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {{ story.title }}
      </h3>

      <!-- Author -->
      <router-link 
        :to="`/user/${story.author.id}`"
        class="flex items-center space-x-2 mb-3 hover:opacity-80 transition-opacity w-fit"
        @click.stop
      >
        <img 
          :src="story.author.avatarUrl" 
          :alt="story.author.name"
          class="w-6 h-6 rounded-full"
        />
        <span class="text-sm text-text-secondary hover:text-primary transition-colors">{{ story.author.name }}</span>
      </router-link>

      <!-- Stats -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4 text-text-tertiary text-sm">
          <div class="flex items-center space-x-1">
            <EyeIcon class="h-4 w-4" />
            <span>{{ formatNumber(story.stats.views) }}</span>
          </div>
          <button
            @click="toggleLike"
            class="flex items-center space-x-1 hover:text-accent-crimson transition-colors"
            :class="{ 'text-accent-crimson': isLiked }"
          >
            <component :is="isLiked ? HeartIconSolid : HeartIcon" class="h-4 w-4" />
            <span>{{ formatNumber(story.stats.likes) }}</span>
          </button>
        </div>
      </div>
    </div>
  </router-link>
</template>
