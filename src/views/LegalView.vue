<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LanguageIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { SUPPORTED_LOCALES, setLocale, type AppLocale } from '@/i18n';

const props = defineProps<{
  doc: 'terms' | 'privacy';
}>();

// Fecha de la última modificación del contenido legal
const LAST_UPDATED = new Date(2026, 9, 26);

const DOCS = {
  terms: { sections: 7, email: 'support@dreamduel.com' },
  privacy: { sections: 6, email: 'privacy@dreamduel.com' }
} as const;

const router = useRouter();
const { t, locale } = useI18n();
const showLanguageMenu = ref(false);

const doc = computed(() => DOCS[props.doc]);
const currentLanguageName = computed(() => SUPPORTED_LOCALES.find((l) => l.code === locale.value)?.name);
const lastUpdated = computed(() => LAST_UPDATED.toLocaleDateString(locale.value));

const changeLanguage = (code: AppLocale) => {
  setLocale(code);
  showLanguageMenu.value = false;
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
            @click="router.back()"
            class="flex items-center space-x-2 px-4 py-2 bg-background-elevated border border-white/10 rounded-lg hover:bg-background-elevated/80 transition-all text-text-secondary"
          >
            <ArrowLeftIcon class="h-5 w-5" />
            <span class="text-sm">{{ t('common.back') }}</span>
          </button>
          <div class="relative">
            <button
              @click="showLanguageMenu = !showLanguageMenu"
              class="flex items-center space-x-2 px-4 py-2 bg-background-elevated border border-white/10 rounded-lg hover:bg-background-elevated/80 transition-all text-text-secondary"
            >
              <LanguageIcon class="h-5 w-5" />
              <span class="text-sm">{{ currentLanguageName }}</span>
            </button>

            <div
              v-if="showLanguageMenu"
              class="absolute right-0 mt-2 w-40 bg-background-card border border-white/10 rounded-lg shadow-xl overflow-hidden z-10"
            >
              <button
                v-for="lang in SUPPORTED_LOCALES"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                class="w-full px-4 py-2 text-left hover:bg-primary/10 transition-colors text-text-secondary hover:text-primary"
                :class="{ 'bg-primary/20 text-primary': locale === lang.code }"
              >
                {{ lang.name }}
              </button>
            </div>
          </div>
        </div>

        <h1 class="text-4xl font-bold text-text-primary mb-2">
          {{ t(`legal.${props.doc}.title`) }}
        </h1>
        <p class="text-text-secondary">
          {{ t('legal.lastUpdated') }}: {{ lastUpdated }}
        </p>
      </div>

      <!-- Content -->
      <div class="bg-background-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div class="space-y-6">
          <section v-for="n in doc.sections" :key="n">
            <h2 class="text-2xl font-bold text-text-primary mb-4">{{ n }}. {{ t(`legal.${props.doc}.section${n}.title`) }}</h2>
            <p class="text-text-secondary leading-relaxed">
              {{ t(`legal.${props.doc}.section${n}.content`) }}
            </p>
          </section>
        </div>
      </div>

      <!-- Contact -->
      <div class="mt-8 text-center text-text-tertiary text-sm">
        <p>{{ t('legal.contact') }}: <a :href="`mailto:${doc.email}`" class="hover:text-primary transition-colors">{{ doc.email }}</a></p>
      </div>
    </div>
  </div>
</template>
