<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { SparklesIcon, PlusCircleIcon, UserCircleIcon, MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import BottomNavigation from '@/presentation/components/BottomNavigation.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userStore = useUserStore();
const showUserMenu = ref(false);

onMounted(() => {
  userStore.loadUserFromStorage();
});
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <!-- Desktop Navbar (hidden on mobile) -->
    <nav class="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background-elevated/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/home" class="flex items-center space-x-2 group">
            <SparklesIcon class="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              DreamDuel
            </span>
          </router-link>

          <!-- Navigation Links (Centro) -->
          <div class="flex items-center space-x-8">
            <router-link 
              to="/home" 
              class="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Inicio
            </router-link>
            <router-link 
              to="/create" 
              class="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors font-medium"
            >
              <PlusCircleIcon class="h-5 w-5" />
              <span>Crear</span>
            </router-link>
            <router-link 
              to="/search" 
              class="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              <MagnifyingGlassIcon class="h-6 w-6" />
            </router-link>
          </div>

          <!-- User Avatar -->
          <div class="flex items-center space-x-4 relative">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors group"
            >
              <img 
                v-if="userStore.currentUser"
                :src="userStore.currentUser.avatarUrl"
                :alt="userStore.currentUser.username"
                class="h-8 w-8 rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors"
              />
              <UserCircleIcon v-else class="h-8 w-8" />
            </button>
            
            <!-- User Dropdown Menu -->
            <div 
              v-if="showUserMenu"
              @click="showUserMenu = false"
              class="absolute top-12 right-0 w-48 bg-background-card border border-white/10 rounded-lg shadow-xl overflow-hidden z-50"
            >
              <router-link 
                to="/profile" 
                class="block px-4 py-3 text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Mi Perfil
              </router-link>
              <router-link 
                to="/settings" 
                class="flex items-center space-x-2 px-4 py-3 text-text-secondary hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Cog6ToothIcon class="h-5 w-5" />
                <span>Configuración</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="md:pt-16 pb-16 md:pb-0">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNavigation />
  </div>
</template>
