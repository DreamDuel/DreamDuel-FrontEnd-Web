<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';
import { useUserStore } from '@/stores/userStore';
import { ArrowLeftIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/vue/24/outline';
import StoryCard from '@/presentation/components/StoryCard.vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();
const userStore = useUserStore();

// Datos del usuario público (simulados - en producción vendrían del backend)
const userProfile = ref({
  id: '',
  username: '',
  avatarUrl: '',
  bio: '',
  stats: {
    storiesCreated: 0,
    totalLikes: 0,
    followers: 0
  }
});

const isFollowing = computed(() => {
  return userStore.isFollowing(userProfile.value.id);
});

onMounted(async () => {
  const userId = route.params.userId as string;
  
  // Cargar historias
  await storyStore.fetchStories();
  
  // Simular carga de perfil público (en producción sería una llamada al backend)
  loadPublicProfile(userId);
});

const loadPublicProfile = (userId: string) => {
  // Por ahora, buscamos el primer autor que coincida en las historias
  const userStory = storyStore.stories.find(s => s.author.id === userId);
  
  if (userStory) {
    userProfile.value = {
      id: userStory.author.id,
      username: userStory.author.name,
      avatarUrl: userStory.author.avatarUrl,
      bio: userStory.author.bio || 'Sin biografía',
      stats: {
        storiesCreated: publicStories.value.length,
        totalLikes: publicStories.value.reduce((sum, s) => sum + s.stats.likes, 0),
        followers: 0
      }
    };
  }
};

// Solo historias PÚBLICAS del usuario
const publicStories = computed(() => {
  const userId = route.params.userId as string;
  return storyStore.stories.filter(s => 
    s.author.id === userId && s.visibility === 'public'
  );
});

const toggleFollow = () => {
  userStore.toggleFollowUser(userProfile.value.id);
  
  // Actualizar contador de seguidores localmente
  if (isFollowing.value) {
    userProfile.value.stats.followers++;
  } else {
    userProfile.value.stats.followers--;
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-background-deep pb-20">
    <!-- Header con botón atrás -->
    <div class="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-sm border-b border-white/5">
      <div class="max-w-5xl mx-auto px-4 py-4">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5" />
          <span>Atrás</span>
        </button>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Header del Perfil Público -->
      <div class="bg-background-card rounded-2xl p-8 mb-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center space-x-6">
            <!-- Avatar -->
            <img 
              :src="userProfile.avatarUrl || 'https://ui-avatars.com/api/?name=Usuario&background=0099FF&color=fff&size=200'"
              alt="Avatar" 
              class="h-24 w-24 rounded-full border-4 border-primary/30 object-cover"
            />

            <!-- Info -->
            <div>
              <h1 class="text-3xl font-bold text-text-primary mb-2">{{ userProfile.username }}</h1>
              <p class="text-text-tertiary text-sm">{{ userProfile.bio }}</p>
            </div>
          </div>

          <!-- Botón Seguir/Siguiendo -->
          <button
            @click="toggleFollow"
            :class="[
              'flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all',
              isFollowing
                ? 'bg-background-elevated text-text-primary hover:bg-error/20 hover:text-error'
                : 'bg-primary text-white hover:bg-primary-light'
            ]"
          >
            <UserMinusIcon v-if="isFollowing" class="h-5 w-5" />
            <UserPlusIcon v-else class="h-5 w-5" />
            <span>{{ isFollowing ? 'Siguiendo' : 'Seguir' }}</span>
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ userProfile.stats.storiesCreated }}</p>
            <p class="text-text-secondary text-sm">Historias Públicas</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-crimson">{{ userProfile.stats.totalLikes }}</p>
            <p class="text-text-secondary text-sm">Likes Totales</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-teal">{{ userProfile.stats.followers }}</p>
            <p class="text-text-secondary text-sm">Seguidores</p>
          </div>
        </div>
      </div>

      <!-- Historias Públicas -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-text-primary mb-4">Historias Públicas</h2>
      </div>

      <div v-if="publicStories.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📚</div>
        <p class="text-text-secondary text-lg">Este usuario aún no tiene historias públicas</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StoryCard
          v-for="story in publicStories"
          :key="story.id"
          :story="story"
        />
      </div>
    </div>
  </div>
</template>
