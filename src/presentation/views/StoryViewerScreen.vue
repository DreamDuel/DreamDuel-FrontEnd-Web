<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();

onMounted(async () => {
  const storyId = route.params.id as string;
  await storyStore.fetchStoryById(storyId);
});

const readNow = () => {
  router.push(`/story/${route.params.id}`);
};

const viewDetails = () => {
  router.push(`/story-details/${route.params.id}`);
};

const createAnother = () => {
  router.push('/create');
};
</script>

<template>
  <div class="fixed inset-0 bg-background-deep flex items-center justify-center z-50 overflow-hidden">
    <!-- Confetti Animation (simplified with CSS) -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="confetti"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-2xl mx-auto px-6 text-center">
      <!-- Celebration Icon -->
      <div class="mb-8 animate-bounce-slow">
        <span class="text-8xl">🎉</span>
      </div>

      <!-- Success Message -->
      <div class="bg-background-card rounded-2xl p-8 mb-8 border border-primary/30 shadow-2xl shadow-primary/20">
        <h1 class="text-4xl font-bold text-text-primary mb-4">
          ¡Tu historia está lista!
        </h1>
        <p class="text-xl text-text-secondary mb-8">
          Ya puedes leerla o compartirla con el mundo
        </p>

        <!-- Story Preview -->
        <div v-if="storyStore.currentStory" class="bg-background-elevated rounded-xl p-6 mb-6">
          <div class="flex items-start space-x-4">
            <img
              :src="storyStore.currentStory.coverUrl"
              :alt="storyStore.currentStory.title"
              class="w-24 h-36 object-cover rounded-lg"
            />
            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-text-primary mb-2">
                {{ storyStore.currentStory.title }}
              </h3>
              <p class="text-text-secondary text-sm line-clamp-3">
                {{ storyStore.currentStory.synopsis }}
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <button
            @click="readNow"
            class="w-full px-8 py-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
          >
            Leer Ahora
          </button>
          
          <div class="flex space-x-4">
            <button
              @click="viewDetails"
              class="flex-1 px-6 py-3 bg-background-elevated hover:bg-background-elevated/80 text-text-primary font-semibold rounded-xl transition-colors"
            >
              Ver Detalles
            </button>
            <button
              @click="createAnother"
              class="flex-1 px-6 py-3 bg-background-elevated hover:bg-background-elevated/80 text-text-primary font-semibold rounded-xl transition-colors"
            >
              Crear Otra
            </button>
          </div>
        </div>
      </div>

      <!-- Skip to Home -->
      <button
        @click="router.push('/')"
        class="text-text-tertiary hover:text-text-secondary transition-colors text-sm"
      >
        Volver al inicio
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.1);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Simplified confetti effect */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #0099FF;
  animation: confetti-fall 3s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
</style>
