<script setup lang="ts">
import { HomeIcon, PhotoIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { HomeIcon as HomeIconSolid, PhotoIcon as PhotoIconSolid, Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const route = useRoute();
const { t } = useI18n();

const currentTab = computed(() => {
  const path = route.path;
  if (path === '/' || path.startsWith('/home')) return 'home';
  if (path === '/images') return 'images';
  if (path === '/settings') return 'settings';
  return 'home';
});

const navItems = computed(() => [
  { id: 'home', label: t('nav.home'), icon: HomeIcon, iconSolid: HomeIconSolid, path: '/home' },
  { id: 'images', label: 'Imágenes', icon: PhotoIcon, iconSolid: PhotoIconSolid, path: '/images' },
  { id: 'settings', label: t('nav.settings'), icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, path: '/settings' }
]);
</script>

<template>
  <!-- Mobile Bottom Navigation (visible only on mobile) -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-elevated/95 backdrop-blur-lg border-t border-white/10">
    <div class="flex items-center justify-around h-16">
      <router-link
        v-for="item in navItems"
        :key="item.id"
        :to="item.path"
        class="flex flex-col items-center justify-center flex-1 h-full transition-colors relative"
        :class="[
          currentTab === item.id 
            ? 'text-primary' 
            : 'text-text-tertiary hover:text-text-secondary'
        ]"
      >
        <!-- Active indicator -->
        <div 
          v-if="currentTab === item.id"
          class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
        />
        
        <!-- Icon -->
        <component 
          :is="currentTab === item.id ? item.iconSolid : item.icon" 
          class="h-6 w-6 mb-1"
        />
        
        <!-- Label -->
        <span class="text-xs font-medium">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>
