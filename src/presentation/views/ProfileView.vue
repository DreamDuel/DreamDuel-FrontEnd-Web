<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { UserCircleIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
import { useStoryStore } from '@/stores/storyStore';
import StoryCard from '@/presentation/components/StoryCard.vue';

const storyStore = useStoryStore();
const currentTab = ref<'stories' | 'saved'>('stories');

onMounted(async () => {
  // Cargar historias del usuario
  // TODO: Implementar cuando haya autenticación
  // await storyStore.fetchStories({ authorId: currentUserId });
  
  // Por ahora usar las existentes en el store
});

const userStats = {
  storiesCreated: 0,
  totalLikes: 0,
  followers: 0
};
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header del Perfil -->
      <div class="bg-background-card rounded-2xl p-8 mb-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center space-x-6">
            <!-- Avatar -->
            <div class="relative">
              <UserCircleIcon class="h-24 w-24 text-primary" />
              <button class="absolute bottom-0 right-0 bg-primary hover:bg-primary-light text-white rounded-full p-2 transition-colors">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <!-- Info -->
            <div>
              <h1 class="text-3xl font-bold text-text-primary mb-2">Usuario</h1>
              <p class="text-text-secondary">Creador de historias épicas</p>
            </div>
          </div>

          <!-- Settings Button -->
          <router-link
            to="/settings"
            class="p-3 bg-background-elevated hover:bg-background-elevated/80 rounded-xl transition-colors"
          >
            <Cog6ToothIcon class="h-6 w-6 text-text-secondary hover:text-primary transition-colors" />
          </router-link>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ userStats.storiesCreated }}</p>
            <p class="text-text-secondary text-sm">Historias</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-crimson">{{ userStats.totalLikes }}</p>
            <p class="text-text-secondary text-sm">Likes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-teal">{{ userStats.followers }}</p>
            <p class="text-text-secondary text-sm">Seguidores</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-6">
        <button
          @click="currentTab = 'stories'"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all',
            currentTab === 'stories'
              ? 'bg-primary text-white'
              : 'bg-background-card text-text-secondary hover:text-text-primary'
          ]"
        >
          Mis Historias
        </button>
        <button
          @click="currentTab = 'saved'"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all',
            currentTab === 'saved'
              ? 'bg-primary text-white'
              : 'bg-background-card text-text-secondary hover:text-text-primary'
          ]"
        >
          Guardadas
        </button>
      </div>

      <!-- Content -->
      <div v-if="currentTab === 'stories'">
        <div v-if="storyStore.stories.length === 0" class="text-center py-20">
          <p class="text-text-secondary text-lg mb-4">Aún no has creado historias</p>
          <router-link
            to="/create"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors"
          >
            <span>Crear tu primera historia</span>
          </router-link>
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoryCard
            v-for="story in storyStore.stories"
            :key="story.id"
            :story="story"
          />
        </div>
      </div>

      <div v-if="currentTab === 'saved'">
        <div v-if="!storyStore.hasSavedStories" class="text-center py-20">
          <div class="text-6xl mb-4">📚</div>
          <p class="text-text-secondary text-lg mb-2">No tienes historias guardadas</p>
          <p class="text-text-tertiary text-sm mb-6">Guarda historias que te gusten para leerlas más tarde</p>
          <router-link
            to="/"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-background-card hover:bg-background-elevated text-text-primary rounded-xl transition-colors"
          >
            <span>Explorar historias</span>
          </router-link>
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <StoryCard
            v-for="story in storyStore.savedStories"
            :key="story.id"
            :story="story"
          />
        </div>
      </div>
    </div>
  </div>
</template>
