<script setup lang="ts">
import { Cog6ToothIcon, PhotoIcon, StarIcon } from '@heroicons/vue/24/outline';
import BottomNavigation from '@/components/BottomNavigation.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <!-- Desktop Navbar (hidden on mobile) -->
    <nav class="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background-elevated/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2 group">
            <img src="/Logo.png" alt="DreamDuel Logo" class="h-12 w-auto transition-transform group-hover:scale-110" />
            <span class="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent drop-shadow-sm">
              DreamDuel
            </span>
          </router-link>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-8">
            <router-link
              to="/"
              class="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              {{ t('nav.home') }}
            </router-link>
            <router-link
              to="/images"
              class="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors font-medium mr-4"
            >
              <PhotoIcon class="h-5 w-5" />
              <span>{{ t('nav.images') }}</span>
            </router-link>
            <router-link
              to="/gallery"
              class="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors font-medium"
            >
              <StarIcon class="h-5 w-5" />
              <span>{{ t('nav.gallery') }}</span>
            </router-link>
          </div>

          <!-- Settings Button -->
          <div class="flex items-center">
            <router-link
              to="/settings"
              :aria-label="t('nav.settings')"
              class="p-2 text-text-secondary hover:text-primary transition-colors hover:bg-background-card rounded-lg"
            >
              <Cog6ToothIcon class="h-6 w-6" />
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Navbar (hidden on desktop) -->
    <nav class="md:hidden fixed top-0 left-0 right-0 z-50 bg-background-elevated/80 backdrop-blur-md border-b border-white/10">
      <div class="px-4 h-14 flex items-center justify-center">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="/Logo.png" alt="DreamDuel Logo" class="h-10 w-auto" />
          <span class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent drop-shadow-sm">
            DreamDuel
          </span>
        </router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-14 md:pt-16 pb-16 md:pb-0">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>
