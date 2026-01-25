<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SparklesIcon } from '@heroicons/vue/24/solid';

const router = useRouter();

onMounted(() => {
  // Simular carga inicial (verificar auth, etc.)
  setTimeout(() => {
    // Por ahora va directo a home, luego verificar si es primera vez → onboarding
    const isFirstTime = localStorage.getItem('hasSeenOnboarding');
    if (!isFirstTime) {
      router.push('/onboarding');
    } else {
      router.push('/home');
    }
  }, 2500);
});
</script>

<template>
  <div class="fixed inset-0 bg-gradient-to-br from-background-deep via-background-elevated to-background-deep flex items-center justify-center">
    <div class="text-center animate-fade-in">
      <!-- Logo -->
      <div class="mb-8 animate-bounce-slow">
        <SparklesIcon class="h-24 w-24 text-primary mx-auto animate-pulse" />
      </div>
      
      <!-- Brand Name -->
      <h1 class="text-6xl font-bold mb-4">
        <span class="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
          DreamDuel
        </span>
      </h1>
      
      <!-- Tagline -->
      <p class="text-text-secondary text-lg animate-fade-in-delay">
        Tus historias cobran vida
      </p>
      
      <!-- Loading indicator -->
      <div class="mt-12">
        <div class="flex items-center justify-center space-x-2">
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.8s ease-out 0.3s both;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
