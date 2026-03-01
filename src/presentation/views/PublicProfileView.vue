<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import StoryCard from '@/presentation/components/StoryCard.vue';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();

// Datos del usuario público (simulados - en producción vendrían del backend)
const userProfile = ref({
  id: '',
  username: '',
  avatarUrl: ''
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
      avatarUrl: userStory.author.avatarUrl
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
