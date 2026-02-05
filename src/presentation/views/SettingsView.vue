<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useI18n } from 'vue-i18n';
import { ArrowLeftIcon, CheckCircleIcon, LanguageIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const userStore = useUserStore();
const { t, locale } = useI18n();

const formData = ref({
  username: '',
  email: '',
  bio: '',
  notifications: true,
  theme: 'dark'
});

const currentLanguage = ref(locale.value);

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

const showPasswordModal = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

onMounted(() => {
  if (userStore.currentUser) {
    formData.value.username = userStore.currentUser.username;
    formData.value.email = userStore.currentUser.email;
    formData.value.bio = userStore.currentUser.bio;
  }
});

const changeLanguage = (langCode: string) => {
  locale.value = langCode;
  currentLanguage.value = langCode;
  localStorage.setItem('locale', langCode);
  successMessage.value = langCode === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English';
  setTimeout(() => successMessage.value = '', 3000);
};

const goBack = () => {
  router.push('/profile');
};

const saveProfile = () => {
  userStore.updateProfile({
    username: formData.value.username,
    email: formData.value.email,
    bio: formData.value.bio
  });
  successMessage.value = t('settings.account.saved');
  setTimeout(() => successMessage.value = '', 3000);
};

const updatePassword = () => {
  errorMessage.value = '';
  
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    errorMessage.value = t('settings.account.passwordMismatch');
    return;
  }
  
  if (passwordForm.value.new.length < 6) {
    errorMessage.value = t('settings.account.passwordTooShort');
    return;
  }
  
  // En una implementación real, validarías la contraseña actual
  successMessage.value = t('settings.account.passwordUpdated');
  showPasswordModal.value = false;
  passwordForm.value = { current: '', new: '', confirm: '' };
  setTimeout(() => successMessage.value = '', 3000);
};

const logout = () => {
  if (confirm(t('settings.confirmLogout'))) {
    userStore.logout();
    router.push('/login');
  }
};
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="fixed top-4 right-4 z-50 max-w-md animate-fade-in">
      <div class="bg-accent-teal/20 border border-accent-teal text-white px-6 py-4 rounded-xl flex items-center space-x-3">
        <CheckCircleIcon class="h-6 w-6 text-accent-teal flex-shrink-0" />
        <p>{{ successMessage }}</p>
      </div>
    </div>
    
    <div v-if="errorMessage" class="fixed top-4 right-4 z-50 max-w-md animate-fade-in">
      <div class="bg-error/20 border border-error text-white px-6 py-4 rounded-xl flex items-center space-x-3">
        <svg class="h-6 w-6 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{{ errorMessage }}</p>
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

      <!-- Account Section -->
      <div class="bg-background-card rounded-2xl p-6 mb-6">
        <h2 class="text-xl font-bold text-text-primary mb-6">{{ t('settings.account.title') }}</h2>
        
        <div class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">{{ t('settings.account.username') }}</label>
            <input
              v-model="formData.username"
              type="text"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          <!-- Email (readonly) -->
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">{{ t('settings.account.email') }}</label>
            <input
              v-model="formData.email"
              type="email"
              readonly
              class="w-full px-4 py-3 bg-background-deep border border-white/5 rounded-xl text-text-tertiary cursor-not-allowed"
            />
          </div>

          <!-- Bio -->
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">{{ t('settings.account.bio') }}</label>
            <textarea
              v-model="formData.bio"
              rows="3"
              :placeholder="t('settings.account.bioPlaceholder')"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
            />
          </div>

          <!-- Change Password -->
          <button
            @click="showPasswordModal = true"
            class="text-primary hover:text-primary-light font-medium transition-colors"
          >
            {{ t('settings.account.changePassword') }}
          </button>

          <!-- Save Button -->
          <button
            @click="saveProfile"
            class="w-full px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-colors"
          >
            {{ t('settings.account.saveChanges') }}
          </button>
        </div>
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

          <!-- Notifications Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-primary font-medium">{{ t('settings.preferences.notifications') }}</p>
              <p class="text-text-tertiary text-sm">{{ t('settings.preferences.notificationsDesc') }}</p>
            </div>
            <button
              @click="formData.notifications = !formData.notifications"
              :class="[
                'relative w-14 h-8 rounded-full transition-colors',
                formData.notifications ? 'bg-primary' : 'bg-background-elevated'
              ]"
            >
              <span
                :class="[
                  'absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform',
                  formData.notifications ? 'translate-x-6' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Premium Section -->
      <div class="bg-gradient-to-r from-accent-purple/20 to-primary/20 rounded-2xl p-6 mb-6 border border-accent-purple/30">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-2xl">💎</span>
              <h2 class="text-xl font-bold text-text-primary">{{ t('settings.premium.title') }}</h2>
            </div>
            <p class="text-text-secondary mb-4">{{ t('settings.premium.description') }}</p>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center space-x-2 text-text-secondary">
                <span class="text-accent-teal">✓</span>
                <span>{{ t('settings.premium.features.unlimited') }}</span>
              </li>
              <li class="flex items-center space-x-2 text-text-secondary">
                <span class="text-accent-teal">✓</span>
                <span>{{ t('settings.premium.features.exclusiveStyles') }}</span>
              </li>
              <li class="flex items-center space-x-2 text-text-secondary">
                <span class="text-accent-teal">✓</span>
                <span>{{ t('settings.premium.features.noAds') }}</span>
              </li>
            </ul>
          </div>
        </div>
        <button class="w-full px-6 py-3 bg-gradient-to-r from-accent-purple to-primary hover:from-accent-purple/80 hover:to-primary/80 text-white font-semibold rounded-xl transition-all">
          {{ t('settings.premium.upgradeButton') }}
        </button>
      </div>

      <!-- Legal Section -->
      <div class="bg-background-card rounded-2xl p-6 mb-6">
        <h2 class="text-xl font-bold text-text-primary mb-4">{{ t('settings.legal.title') }}</h2>
        <div class="space-y-3">
          <button class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            {{ t('settings.legal.terms') }}
          </button>
          <button class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            {{ t('settings.legal.privacy') }}
          </button>
          <button class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            {{ t('settings.legal.about') }}
          </button>
        </div>
      </div>

      <!-- Logout Section -->
      <button
        @click="logout"
        class="w-full px-6 py-4 bg-error/10 hover:bg-error/20 text-error font-semibold rounded-xl transition-colors border border-error/30"
      >
        {{ t('settings.logout') }}
      </button>
    </div>

    <!-- Password Modal -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="showPasswordModal = false"
    >
      <div class="bg-background-card rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-text-primary mb-6">{{ t('settings.account.changePassword') }}</h3>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">{{ t('settings.account.currentPassword') }}</label>
            <input
              v-model="passwordForm.current"
              type="password"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">{{ t('settings.account.newPassword') }}</label>
            <input
              v-model="passwordForm.new"
              type="password"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">{{ t('settings.account.confirmPassword') }}</label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex space-x-4">
          <button
            @click="updatePassword"
            class="flex-1 px-6 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl transition-colors"
          >
            {{ t('settings.account.update') }}
          </button>
          <button
            @click="showPasswordModal = false"
            class="px-6 py-3 bg-background-elevated hover:bg-background-elevated/80 text-text-secondary font-semibold rounded-xl transition-colors"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
