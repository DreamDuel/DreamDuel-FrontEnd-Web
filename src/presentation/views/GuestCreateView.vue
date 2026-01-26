<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SparklesIcon, PhotoIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const prompt = ref('');
const selectedStyle = ref<string | null>(null);
const selectedGenre = ref<string | null>(null);
const isGenerating = ref(false);
const showRegisterPrompt = ref(false);

const styles = [
  { id: 'anime', name: 'Anime', emoji: '🎌' },
  { id: 'realistic', name: 'Realista', emoji: '📸' },
  { id: 'noir', name: 'Noir', emoji: '🎬' },
  { id: 'watercolor', name: 'Acuarela', emoji: '🎨' },
  { id: 'comic', name: 'Cómic', emoji: '💥' },
  { id: 'fantasy', name: 'Fantasía', emoji: '🔮' }
];

const genres = [
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'action', name: 'Acción', emoji: '⚔️' },
  { id: 'mystery', name: 'Misterio', emoji: '🔍' },
  { id: 'scifi', name: 'Sci-Fi', emoji: '🚀' },
  { id: 'horror', name: 'Terror', emoji: '👻' },
  { id: 'fantasy', name: 'Fantasía', emoji: '🧙' }
];

const toggleStyle = (styleId: string) => {
  selectedStyle.value = selectedStyle.value === styleId ? null : styleId;
};

const toggleGenre = (genreId: string) => {
  selectedGenre.value = selectedGenre.value === genreId ? null : genreId;
};

const canGenerate = computed(() => {
  return prompt.value.trim().length > 0 && !isGenerating.value;
});

const generateStory = async () => {
  if (!canGenerate.value) return;
  
  isGenerating.value = true;
  
  // Simular generación
  setTimeout(() => {
    console.log('Generating guest story:', {
      prompt: prompt.value,
      style: selectedStyle.value,
      genre: selectedGenre.value
    });
    
    isGenerating.value = false;
    // Mostrar prompt para registrarse después de ver el preview
    showRegisterPrompt.value = true;
  }, 2000);
};

const goToRegister = () => {
  // Guardar datos de la historia en sessionStorage para recuperar después del registro
  sessionStorage.setItem('guestStory', JSON.stringify({
    prompt: prompt.value,
    style: selectedStyle.value,
    genre: selectedGenre.value
  }));
  router.push('/register');
};

const skipToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep">
    <!-- Header con CTA -->
    <div class="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <SparklesIcon class="h-8 w-8 text-primary" />
          <span class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            DreamDuel
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="skipToLogin"
            class="px-4 py-2 text-text-secondary hover:text-primary transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            @click="goToRegister"
            class="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all"
          >
            Registrarse Gratis
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-3xl">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center space-x-3 mb-4">
            <SparklesIcon class="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-text-primary mb-4">
            Crea tu Primera Historia
          </h1>
          <p class="text-text-secondary text-xl mb-6">
            Prueba gratis sin registro. Convierte tus ideas en historias visuales con IA.
          </p>
          <div class="flex items-center justify-center space-x-6 text-sm text-text-tertiary">
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>Sin tarjeta</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>Instantáneo</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>100% gratis</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Creación -->
        <div class="bg-background-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm mb-8">
          <!-- Prompt Input -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-lg">
              ¿Qué historia quieres crear?
            </label>
            <textarea
              v-model="prompt"
              placeholder="Ej: Una aventura épica sobre un joven mago que descubre un portal mágico en su sótano..."
              rows="4"
              class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none text-lg"
            ></textarea>
            <p class="text-text-tertiary text-sm mt-2">
              💡 Sé específico: personajes, lugar, conflicto
            </p>
          </div>

          <!-- Estilos Visuales -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3">
              Estilo Visual
            </label>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
              <button
                v-for="style in styles"
                :key="style.id"
                @click="toggleStyle(style.id)"
                :class="[
                  'p-4 rounded-xl border-2 transition-all hover:scale-105',
                  selectedStyle === style.id
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 bg-background-elevated hover:border-primary/50'
                ]"
              >
                <div class="text-3xl mb-2">{{ style.emoji }}</div>
                <div class="text-text-primary text-xs font-medium">{{ style.name }}</div>
              </button>
            </div>
          </div>

          <!-- Géneros -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3">
              Género
            </label>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
              <button
                v-for="genre in genres"
                :key="genre.id"
                @click="toggleGenre(genre.id)"
                :class="[
                  'p-4 rounded-xl border-2 transition-all hover:scale-105',
                  selectedGenre === genre.id
                    ? 'border-accent-crimson bg-accent-crimson/10'
                    : 'border-white/10 bg-background-elevated hover:border-accent-crimson/50'
                ]"
              >
                <div class="text-3xl mb-2">{{ genre.emoji }}</div>
                <div class="text-text-primary text-xs font-medium">{{ genre.name }}</div>
              </button>
            </div>
          </div>

          <!-- Botón de Generar -->
          <button
            @click="generateStory"
            :disabled="!canGenerate"
            :class="[
              'w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3',
              !canGenerate
                ? 'bg-background-elevated text-text-tertiary cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-accent-teal text-white hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95'
            ]"
          >
            <template v-if="isGenerating">
              <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>CREANDO TU HISTORIA...</span>
            </template>
            <template v-else>
              <SparklesIcon class="h-6 w-6" />
              <span>CREAR HISTORIA GRATIS</span>
            </template>
          </button>
        </div>

        <!-- Beneficios de registrarse -->
        <div class="bg-gradient-to-r from-primary/10 to-accent-teal/10 rounded-xl p-6 border border-primary/20">
          <h3 class="font-bold text-text-primary mb-4 text-center">
            ✨ Regístrate y obtén:
          </h3>
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="text-center">
              <div class="text-2xl mb-2">🎁</div>
              <div class="text-text-primary font-semibold">3 Imágenes Gratis</div>
              <div class="text-text-tertiary">Pack de bienvenida</div>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">💾</div>
              <div class="text-text-primary font-semibold">Guardar Historias</div>
              <div class="text-text-tertiary">Acceso desde cualquier lugar</div>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">👥</div>
              <div class="text-text-primary font-semibold">Invita Amigos</div>
              <div class="text-text-tertiary">+3 créditos por invitación</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Registrarse para guardar -->
    <Transition name="modal">
      <div v-if="showRegisterPrompt" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="relative w-full max-w-md bg-background-card rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <button @click="showRegisterPrompt = false" class="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
          
          <div class="p-8 text-center">
            <div class="text-6xl mb-4">🎉</div>
            <h2 class="text-2xl font-bold text-text-primary mb-3">
              ¡Tu historia está lista!
            </h2>
            <p class="text-text-secondary mb-6">
              Regístrate gratis para guardarla, compartirla y crear más historias increíbles.
            </p>
            
            <div class="space-y-3">
              <button
                @click="goToRegister"
                class="w-full px-6 py-4 bg-gradient-to-r from-primary to-accent-teal hover:from-primary-light hover:to-accent-teal/80 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Registrarse Gratis</span>
                <ArrowRightIcon class="h-5 w-5" />
              </button>
              
              <button
                @click="skipToLogin"
                class="w-full px-6 py-3 bg-background-elevated hover:bg-background-card text-text-primary rounded-xl font-semibold transition-colors"
              >
                Ya tengo cuenta
              </button>
            </div>

            <p class="text-xs text-text-tertiary mt-4">
              Sin tarjeta requerida • Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-background-card,
.modal-leave-active .bg-background-card {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-background-card,
.modal-leave-to .bg-background-card {
  transform: scale(0.95);
}
</style>
