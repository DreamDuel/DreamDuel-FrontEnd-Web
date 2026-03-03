<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LanguageIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const { t, locale } = useI18n();
const showLanguageMenu = ref(false);

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('locale', lang);
  showLanguageMenu.value = false;
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <!-- Back Button and Language Selector -->
        <div class="flex justify-between items-center mb-6">
          <button
            @click="goBack"
            class="flex items-center space-x-2 px-4 py-2 bg-background-elevated border border-white/10 rounded-lg hover:bg-background-elevated/80 transition-all text-text-secondary"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            <span class="text-sm">{{ locale === 'es' ? 'Volver' : 'Back' }}</span>
          </button>
          <div class="relative">
          <div class="relative">
            <button
              @click="showLanguageMenu = !showLanguageMenu"
              class="flex items-center space-x-2 px-4 py-2 bg-background-elevated border border-white/10 rounded-lg hover:bg-background-elevated/80 transition-all text-text-secondary"
            >
              <LanguageIcon class="h-5 w-5" />
              <span class="text-sm">{{ locale === 'es' ? 'Español' : 'English' }}</span>
            </button>
            
            <div
              v-if="showLanguageMenu"
              class="absolute right-0 mt-2 w-40 bg-background-card border border-white/10 rounded-lg shadow-xl overflow-hidden z-10"
            >
              <button
                @click="changeLanguage('es')"
                class="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors text-text-secondary hover:text-primary"
                :class="{ 'bg-primary/20 text-primary': locale === 'es' }"
              >
                Español
              </button>
              <button
                @click="changeLanguage('en')"
                class="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors text-text-secondary hover:text-primary"
                :class="{ 'bg-primary/20 text-primary': locale === 'en' }"
              >
                English
              </button>
            </div>
          </div>
          </div>
        </div>
        
        <h1 class="text-4xl font-bold text-text-primary mb-2">
          {{ t('legal.privacy.title') }}
        </h1>
        <p class="text-text-secondary">
          {{ t('legal.privacy.lastUpdated') }}: {{ new Date().toLocaleDateString() }}
        </p>
      </div>

      <!-- Content -->
      <div class="bg-background-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div class="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">1. {{ t('legal.privacy.section1.title') }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy.section1.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">2. {{ t('legal.privacy.section2.title') }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy.section2.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">3. {{ t('legal.privacy.section3.title') }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy.section3.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">4. {{ t('legal.privacy.section4.title') }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy.section4.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">5. {{ t('legal.privacy.section5.title') }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy.section5.content') }}
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-bold text-text-primary mb-4">6. {{ t('legal.privacy.section6.title') }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t('legal.privacy.section6.content') }}
            </p>
          </section>
        </div>
      </div>

      <!-- Contact -->
      <div class="mt-8 text-center text-text-tertiary text-sm">
        <p>{{ t('legal.privacy.contact') }}: privacy@dreamduel.com</p>
      </div>
    </div>
  </div>
</template>
