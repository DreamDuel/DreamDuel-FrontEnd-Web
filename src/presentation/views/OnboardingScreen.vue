<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const currentSlide = ref(0);

const slides = [
  {
    title: 'Crea Historias Únicas',
    description: 'Describe tu fantasía y la IA generará una historia visual personalizada',
    emoji: '✨',
    gradient: 'from-primary to-primary-light'
  },
  {
    title: 'Personaliza Personajes',
    description: 'Sube fotos de tus personajes favoritos y dales vida en tu historia',
    emoji: '🎭',
    gradient: 'from-accent-purple to-primary'
  },
  {
    title: 'Descubre Infinitas Historias',
    description: 'Explora creaciones de otros usuarios y encuentra tu próxima lectura favorita',
    emoji: '📚',
    gradient: 'from-accent-teal to-primary'
  },
  {
    title: '¡Empieza a Soñar!',
    description: 'Únete a miles de creadores y lectores en DreamDuel',
    emoji: '🚀',
    gradient: 'from-accent-crimson to-primary'
  }
];

const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++;
  } else {
    completeOnboarding();
  }
};

const skipOnboarding = () => {
  completeOnboarding();
};

const completeOnboarding = () => {
  localStorage.setItem('hasSeenOnboarding', 'true');
  router.push('/home');
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};
</script>

<template>
  <div class="fixed inset-0 bg-background-deep overflow-hidden">
    <!-- Skip Button -->
    <button
      v-if="currentSlide < slides.length - 1"
      @click="skipOnboarding"
      class="absolute top-6 right-6 z-10 text-text-secondary hover:text-primary transition-colors text-sm font-medium"
    >
      Saltar
    </button>

    <!-- Slides Container -->
    <div class="h-full flex items-center justify-center px-6">
      <div class="max-w-2xl w-full text-center">
        <!-- Emoji/Icon -->
        <div 
          class="text-9xl mb-8 transition-all duration-500 transform"
          :class="{ 'scale-110': true }"
          :key="currentSlide"
        >
          {{ slides[currentSlide].emoji }}
        </div>

        <!-- Title -->
        <h1 
          class="text-4xl md:text-5xl font-bold mb-6 transition-all duration-500"
          :key="`title-${currentSlide}`"
        >
          <span 
            class="bg-gradient-to-r bg-clip-text text-transparent"
            :class="slides[currentSlide].gradient"
          >
            {{ slides[currentSlide].title }}
          </span>
        </h1>

        <!-- Description -->
        <p 
          class="text-xl text-text-secondary mb-12 leading-relaxed max-w-xl mx-auto transition-all duration-500"
          :key="`desc-${currentSlide}`"
        >
          {{ slides[currentSlide].description }}
        </p>

        <!-- Dots Indicators -->
        <div class="flex items-center justify-center space-x-2 mb-12">
          <button
            v-for="(slide, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            class="transition-all duration-300"
            :class="[
              currentSlide === index 
                ? 'w-8 h-2 bg-primary rounded-full' 
                : 'w-2 h-2 bg-text-tertiary rounded-full hover:bg-text-secondary'
            ]"
          />
        </div>

        <!-- Next/Start Button -->
        <button
          @click="nextSlide"
          class="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
        >
          <span>{{ currentSlide < slides.length - 1 ? 'Siguiente' : 'Empezar' }}</span>
          <ChevronRightIcon class="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </div>
</template>
