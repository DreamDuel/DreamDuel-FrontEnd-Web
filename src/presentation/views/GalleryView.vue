<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BottomNavigation from '@/presentation/components/BottomNavigation.vue';

const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep flex flex-col pt-12 md:pt-20 px-4 pb-24">
    <div class="max-w-7xl mx-auto w-full flex-1">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent-teal text-transparent bg-clip-text inline-block mb-4">
          {{ t('nav.gallery') }}
        </h1>
        <p class="text-text-secondary text-lg max-w-2xl mx-auto">
          {{ t('nav.gallerySubtitle') }}
        </p>
      </div>

      <!-- Placeholder grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-background-card rounded-xl border border-white/5 overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-300">
          <div class="aspect-[4/5] bg-gradient-to-br from-background-elevated to-background-deep animate-pulse flex items-center justify-center relative">
            <div class="w-12 h-12 rounded-full bg-white/5 absolute"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div class="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
              <div class="h-3 w-1/2 bg-white/5 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BottomNavigation />
  </div>
</template>
