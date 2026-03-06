<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

const { t } = useI18n();
const router = useRouter();

const goToRegister = () => {
  router.push('/register');
};

const goToLogin = () => {
  router.push('/login');
};

// Ejemplos de imágenes generadas para mostrar
const showcaseImages = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
];
</script>

<template>
  <div class="min-h-screen bg-background-deep flex flex-col">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <div class="flex items-center space-x-2 sm:space-x-3">
          <SparklesIcon class="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span class="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            DreamDuel
          </span>
        </div>
        <div class="flex items-center space-x-2 sm:space-x-3">
          <button 
            @click="goToLogin"
            class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-text-secondary hover:text-primary transition-colors"
          >
            {{ t('guest.header.login') }}
          </button>
          <button
            @click="goToRegister"
            class="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all"
          >
            {{ t('guest.header.register') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div class="text-center mb-6 sm:mb-10">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-3 sm:mb-4">
          {{ t('guest.hero.title') }}
        </h1>
        
        <p class="text-text-secondary text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
          {{ t('guest.hero.subtitle') }}
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-text-tertiary mb-4 sm:mb-6">
          <div class="flex items-center space-x-2">
            <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-teal" />
            <span>Generación rápida</span>
          </div>
          <div class="flex items-center space-x-2">
            <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-teal" />
            <span>Resultados profesionales</span>
          </div>
          <div class="flex items-center space-x-2">
            <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-teal" />
            <span>IA de última generación</span>
          </div>
        </div>
      </div>

      <!-- Ejemplos Rápidos -->
      <div class="mb-6 sm:mb-10">
        <div class="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xl mx-auto">
          <div
            v-for="(image, index) in showcaseImages.slice(0, 3)"
            :key="index"
            class="aspect-[3/4] rounded-lg overflow-hidden"
          >
            <img
              :src="image"
              :alt="`Ejemplo ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <p class="text-center text-text-tertiary text-xs sm:text-sm mt-2 sm:mt-3">
          Ejemplos de transformaciones
        </p>
      </div>

      <!-- Beneficios -->
      <div class="bg-background-card/30 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-6 sm:mb-10">
        <div class="grid sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div>
            <div class="text-primary font-bold text-base sm:text-lg md:text-xl mb-1">{{ t('guestBenefits.noCensorship') }}</div>
            <p class="text-text-tertiary text-xs sm:text-sm">{{ t('guestBenefits.noCensorshipDesc') }}</p>
          </div>
          <div>
            <div class="text-primary font-bold text-base sm:text-lg md:text-xl mb-1">{{ t('guestBenefits.instant') }}</div>
            <p class="text-text-tertiary text-xs sm:text-sm">{{ t('guestBenefits.instantDesc') }}</p>
          </div>
          <div>
            <div class="text-primary font-bold text-base sm:text-lg md:text-xl mb-1">{{ t('guestBenefits.private') }}</div>
            <p class="text-text-tertiary text-xs sm:text-sm">{{ t('guestBenefits.privateDesc') }}</p>
          </div>
        </div>
      </div>

      <!-- CTA Simple -->
      <div class="text-center">
        <button
          @click="goToRegister"
          class="inline-flex items-center space-x-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-primary to-accent-teal text-white font-bold text-sm sm:text-base rounded-xl transition-all hover:scale-105"
        >
          <span>{{ t('guestBenefits.createAccount') }}</span>
          <ArrowRightIcon class="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <p class="text-text-tertiary text-xs sm:text-sm mt-2 sm:mt-3">
          {{ t('guestBenefits.alreadyHaveAccount') }} <button @click="goToLogin" class="text-primary hover:underline">{{ t('guestBenefits.login') }}</button>
        </p>
      </div>
    </div>

    <!-- Footer Simple -->
    <div class="border-t border-white/10 mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-text-tertiary">
          <button @click="() => router.push('/terms')" class="hover:text-primary transition-colors">
            Términos
          </button>
          <span class="hidden sm:inline">•</span>
          <button @click="() => router.push('/privacy')" class="hover:text-primary transition-colors">
            Privacidad
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles mínimos */
</style>
