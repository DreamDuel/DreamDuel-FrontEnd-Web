<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ArrowLeftIcon, CheckCircleIcon, LanguageIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const { t, locale } = useI18n();

const currentLanguage = ref(locale.value);
const successMessage = ref('');

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const changeLanguage = (langCode: string) => {
  locale.value = langCode;
  currentLanguage.value = langCode;
  localStorage.setItem('locale', langCode);
  successMessage.value = langCode === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English';
  setTimeout(() => successMessage.value = '', 3000);
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-background-deep pb-20">
    <!-- Success Message -->
    <div v-if="successMessage" class="fixed top-4 right-4 z-50 max-w-md animate-fade-in">
      <div class="bg-accent-teal/20 border border-accent-teal text-white px-6 py-4 rounded-xl flex items-center space-x-3">
        <CheckCircleIcon class="h-6 w-6 text-accent-teal flex-shrink-0" />
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center space-x-4 mb-8">
        <button
          @click="goBack"
          class="p-2 hover:bg-background-card rounded-lg transition-colors"
        >
          <ArrowLeftIcon class="h-6 w-6 text-text-secondary" />
        </button>
        <h1 class="text-3xl font-bold text-text-primary">{{ t('settings.title') }}</h1>
      </div>

      <!-- Preferences Section -->
      <div class="bg-background-card rounded-2xl p-6 mb-6">
        <h2 class="text-xl font-bold text-text-primary mb-6">{{ t('settings.preferences.title') }}</h2>
        
        <div class="space-y-6">
          <!-- Language Selector -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <LanguageIcon class="h-5 w-5 text-text-secondary" />
                <div>
                  <p class="text-text-primary font-medium">{{ t('settings.preferences.language') }}</p>
                  <p class="text-text-tertiary text-sm">{{ t('settings.preferences.languageDesc') }}</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                :class="[
                  'flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all',
                  currentLanguage === lang.code
                    ? 'bg-primary text-white ring-2 ring-primary/50'
                    : 'bg-background-elevated text-text-secondary hover:bg-background-elevated/70 border border-white/10'
                ]"
              >
                <span class="text-2xl">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Section -->
      <div class="bg-background-card rounded-2xl p-6">
        <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('settings.legal.title') }}</h2>
        <div class="space-y-3">
          <button @click="router.push('/terms')" class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            {{ t('settings.legal.terms') }}
          </button>
          <button @click="router.push('/privacy')" class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            {{ t('settings.legal.privacy') }}
          </button>
          <a href="https://www.dreamduel.lat" target="_blank" class="block w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            {{ t('settings.legal.about') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
