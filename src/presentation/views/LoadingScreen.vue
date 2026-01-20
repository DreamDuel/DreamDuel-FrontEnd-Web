<script setup lang="ts">
import { ref, onMounted } from 'vue';

const loadingTexts = [
  '✨ Creando tu historia...',
  '🎨 Generando imágenes...',
  '📖 Escribiendo narrativa...',
  '🎭 Dando vida a tus personajes...'
];

const currentTextIndex = ref(0);
const progress = ref(0);

onMounted(() => {
  // Cambiar texto cada 2.5 segundos
  const textInterval = setInterval(() => {
    currentTextIndex.value = (currentTextIndex.value + 1) % loadingTexts.length;
  }, 2500);

  // Incrementar progreso
  const progressInterval = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      // La navegación a story-viewer se hará desde el componente padre
    }
  }, 300); // 30 segundos total (100 * 300ms)

  return () => {
    clearInterval(textInterval);
    clearInterval(progressInterval);
  };
});
</script>

<template>
  <div class="fixed inset-0 bg-background-deep flex items-center justify-center z-50">
    <div class="text-center max-w-md px-6">
      <!-- Animated Spinner -->
      <div class="relative mb-8">
        <div class="w-24 h-24 mx-auto">
          <svg class="animate-spin" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-background-elevated"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-primary"
              :stroke-dasharray="`${progress * 2.83} 283`"
              stroke-linecap="round"
              style="transform: rotate(-90deg); transform-origin: 50% 50%;"
            />
          </svg>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-3xl animate-pulse">✨</span>
        </div>
      </div>

      <!-- Dynamic Loading Text -->
      <h2 class="text-2xl font-bold text-text-primary mb-4 transition-all duration-500">
        {{ loadingTexts[currentTextIndex] }}
      </h2>

      <!-- Progress Bar -->
      <div class="w-full bg-background-elevated rounded-full h-2 mb-4 overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- Progress Percentage -->
      <p class="text-text-secondary">{{ progress }}%</p>

      <!-- Info Text -->
      <p class="text-text-tertiary text-sm mt-6">
        Esto puede tomar 30-60 segundos
      </p>
    </div>
  </div>
</template>
