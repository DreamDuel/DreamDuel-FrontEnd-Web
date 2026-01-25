<script setup lang="ts">
import { EyeIcon, HeartIcon, BookmarkIcon } from '@heroicons/vue/24/outline';
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from '@heroicons/vue/24/solid';
import { computed } from 'vue';
import { useStoryStore } from '@/stores/storyStore';
import type { Story } from '@/models/Story';

const props = defineProps<{
  story: Story;
}>();

const storyStore = useStoryStore();

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
  
  const userId = 'current-user-id';
  await storyStore.saveStory(props.story.id, userId);
};

const toggleLike = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  
  const userId = 'current-user-id';
  await storyStore.likeStory(props.story.id, userId);
};
</script>

<template>
  <router-link 
    :to="`/story/${story.id}`"
    class="group block bg-background-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
  >
    <!-- Cover Image -->
    <div class="relative aspect-[2/3] overflow-hidden">
      <img 
        :src="story.coverUrl" 
        :alt="story.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <!-- Tags -->
      <div class="absolute top-2 left-2 flex flex-wrap gap-1">
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
    <div class="p-4">
      <!-- Title -->
      <h3 class="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
