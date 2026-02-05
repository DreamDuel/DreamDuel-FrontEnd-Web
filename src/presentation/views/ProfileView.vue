<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon, PencilIcon, SparklesIcon, ClockIcon, GiftIcon } from '@heroicons/vue/24/outline';
import { useStoryStore } from '@/stores/storyStore';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import StoryCard from '@/presentation/components/StoryCard.vue';

const { t } = useI18n();
const storyStore = useStoryStore();
const userStore = useUserStore();
const router = useRouter();
const currentTab = ref<'stories' | 'saved' | 'liked'>('stories');
const isEditingProfile = ref(false);
const editForm = ref({
  username: '',
  bio: ''
});

const timeUntilReset = ref('12:00:00');

let timeUpdateInterval: number | null = null;

onMounted(async () => {
  // Cargar usuario desde localStorage si existe
  userStore.loadUserFromStorage();
  
  // Cargar historias
  await Promise.all([
    storyStore.fetchStories(),
    storyStore.fetchTrendingStories(),
    storyStore.fetchNewStories()
  ]);
  
  // Inicializar formulario de edición
  if (userStore.currentUser) {
    editForm.value.username = userStore.currentUser.username;
    editForm.value.bio = userStore.currentUser.bio;
  }
  
  // Actualizar el tiempo cada segundo
  const updateTime = () => {
    try {
      timeUntilReset.value = userStore.getTimeUntilReset();
    } catch {
      timeUntilReset.value = '12:00:00';
    }
  };
  
  updateTime();
  timeUpdateInterval = window.setInterval(updateTime, 1000);
  
  // Verificar créditos cada minuto
  window.setInterval(() => {
    userStore.checkAndResetCredits();
  }, 60000);
});

onBeforeUnmount(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
  }
});

const userStats = computed(() => {
  if (userStore.currentUser) {
    return userStore.currentUser.stats;
  }
  return {
    storiesCreated: 0,
    totalLikes: 0,
    followers: 0,
    following: 0
  };
});

const myStories = computed(() => {
  if (!userStore.currentUser?.myStories) return [];
  const allStories = [...storyStore.stories, ...storyStore.trendingStories, ...storyStore.newStories];
  const uniqueMap = new Map();
  allStories.forEach(s => uniqueMap.set(s.id, s));
  return Array.from(uniqueMap.values()).filter(s => 
    userStore.currentUser?.myStories.includes(s.id)
  );
});

const savedStoriesList = computed(() => {
  if (!userStore.currentUser?.savedStories) return [];
  const allStories = [...storyStore.stories, ...storyStore.trendingStories, ...storyStore.newStories, ...storyStore.savedStories];
  const uniqueMap = new Map();
  allStories.forEach(s => uniqueMap.set(s.id, s));
  return Array.from(uniqueMap.values()).filter(s => 
    userStore.currentUser?.savedStories.includes(s.id)
  );
});

const likedStoriesList = computed(() => {
  if (!userStore.currentUser?.likedStories) return [];
  const allStories = [...storyStore.stories, ...storyStore.trendingStories, ...storyStore.newStories, ...storyStore.savedStories];
  const uniqueMap = new Map();
  allStories.forEach(s => uniqueMap.set(s.id, s));
  return Array.from(uniqueMap.values()).filter(s => 
    userStore.currentUser?.likedStories.includes(s.id)
  );
});

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

const toggleEditProfile = () => {
  if (isEditingProfile.value) {
    // Guardar cambios
    userStore.updateProfile({
      username: editForm.value.username,
      bio: editForm.value.bio
    });
  } else {
    // Iniciar edición
    if (userStore.currentUser) {
      editForm.value.username = userStore.currentUser.username;
      editForm.value.bio = userStore.currentUser.bio;
    }
  }
  isEditingProfile.value = !isEditingProfile.value;
};

const copyReferralCode = () => {
  if (!userStore.currentUser?.credits?.referralCode) return;
  const referralLink = `https://dreamduel.com/ref/${userStore.currentUser.credits.referralCode}`;
  navigator.clipboard.writeText(referralLink);
  alert(t('profile.credits.referralCopied'));
};

const fileInput = ref<HTMLInputElement | null>(null);
const isUploadingAvatar = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleAvatarChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    alert(t('profile.avatar.errorFormat'));
    return;
  }
  
  // Validar tamaño (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert(t('profile.avatar.errorSize'));
    return;
  }
  
  isUploadingAvatar.value = true;
  
  try {
    await userStore.updateAvatar(file);
    // Éxito - no mostrar nada, el avatar se actualiza automáticamente
  } catch (error: any) {
    console.error('Error al actualizar avatar:', error);
    alert(error?.message || 'Error al actualizar la foto de perfil. Intenta de nuevo.');
  } finally {
    isUploadingAvatar.value = false;
    // Limpiar input
    if (target) target.value = '';
  }
};
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header del Perfil -->
      <div class="bg-background-card rounded-2xl p-8 mb-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center space-x-6">
            <!-- Avatar -->
            <div class="relative group">
              <img 
                :src="userStore.currentUser?.avatarUrl || 'https://ui-avatars.com/api/?name=Usuario&background=0099FF&color=fff&size=200'"
                alt="Avatar" 
                class="h-24 w-24 rounded-full border-4 border-primary/30 object-cover cursor-pointer"
                @click="triggerFileInput"
              />
              <div 
                @click="triggerFileInput"
                class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div v-if="isUploadingAvatar" class="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleAvatarChange"
              />
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div v-if="!isEditingProfile">
                <h1 class="text-3xl font-bold text-text-primary mb-2">{{ userStore.currentUser?.username || 'Usuario' }}</h1>
                <p class="text-text-secondary">{{ userStore.currentUser?.email || 'usuario@dreamduel.com' }}</p>
                <p v-if="userStore.currentUser?.bio" class="text-text-tertiary mt-2 text-sm">{{ userStore.currentUser.bio }}</p>
                <p v-else class="text-text-tertiary mt-2 text-sm italic">{{ t('profile.edit.noBio') }}</p>
              </div>
              <div v-else class="space-y-3">
                <input
                  v-model="editForm.username"
                  type="text"
                  :placeholder="t('profile.edit.username')"
                  class="w-full px-4 py-2 bg-background-elevated border border-white/10 rounded-lg text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <textarea
                  v-model="editForm.bio"
                  :placeholder="t('profile.edit.bioPlaceholder')"
                  rows="2"
                  class="w-full px-4 py-2 bg-background-elevated border border-white/10 rounded-lg text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <!-- Settings, Edit and Logout Buttons -->
          <div class="flex items-start space-x-2">
            <button
              @click="toggleEditProfile"
              :class="[
                'p-3 rounded-xl transition-colors',
                isEditingProfile 
                  ? 'bg-primary text-white hover:bg-primary-light' 
                  : 'bg-background-elevated hover:bg-background-elevated/80'
              ]"
              :title="isEditingProfile ? t('profile.edit.saveChanges') : t('profile.edit.editProfile')"
            >
              <PencilIcon v-if="!isEditingProfile" class="h-6 w-6 text-text-secondary hover:text-primary transition-colors" />
              <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <router-link
              to="/settings"
              class="p-3 bg-background-elevated hover:bg-background-elevated/80 rounded-xl transition-colors"
            >
              <Cog6ToothIcon class="h-6 w-6 text-text-secondary hover:text-primary transition-colors" />
            </router-link>
            <button
              @click="handleLogout"
              class="p-3 bg-background-elevated hover:bg-error/20 rounded-xl transition-colors group"
              :title="t('profile.logout')"
            >
              <ArrowRightOnRectangleIcon class="h-6 w-6 text-text-secondary group-hover:text-error transition-colors" />
            </button>
          </div>
        </div>

        <!-- Credits & Premium Status -->
        <div v-if="!userStore.currentUser?.isPremium" class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Credits Remaining -->
          <div class="bg-gradient-to-br from-primary/10 to-accent-teal/10 rounded-xl p-4 border border-primary/20">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <SparklesIcon class="h-5 w-5 text-primary" />
                <span class="font-semibold text-text-primary">{{ t('profile.credits.freeImages') }}</span>
              </div>
              <span class="text-2xl font-bold text-primary">{{ userStore.currentUser?.credits.freeImagesLeft || 0 }}</span>
            </div>
            <div class="flex items-center space-x-2 text-xs text-text-secondary">
              <ClockIcon class="h-4 w-4" />
              <span>{{ t('profile.credits.resetIn') }} {{ timeUntilReset }}</span>
            </div>
          </div>

          <!-- Referral Code -->
          <div class="bg-gradient-to-br from-accent-gold/10 to-accent-crimson/10 rounded-xl p-4 border border-accent-gold/20">
            <div class="flex items-center space-x-2 mb-2">
              <GiftIcon class="h-5 w-5 text-accent-gold" />
              <span class="font-semibold text-text-primary">{{ t('profile.credits.referralCode') }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <code class="flex-1 px-3 py-2 bg-background-deep rounded-lg text-primary font-mono text-sm">
                {{ userStore.currentUser?.credits.referralCode }}
              </code>
              <button 
                @click="copyReferralCode"
                class="px-3 py-2 bg-accent-gold hover:bg-accent-gold/80 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {{ t('profile.credits.copy') }}
              </button>
            </div>
            <p class="text-xs text-text-tertiary mt-2">
              {{ t('profile.credits.referralDesc') }} ({{ userStore.currentUser?.credits.referralsCount || 0 }} {{ t('profile.credits.referrals') }})
            </p>
          </div>
        </div>

        <!-- Premium Badge -->
        <div v-else class="mt-6">
          <div class="bg-gradient-to-r from-primary to-accent-gold rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <SparklesIcon class="h-6 w-6 text-white" />
              <div>
                <h3 class="font-bold text-white">{{ t('profile.premium.active') }}</h3>
                <p class="text-white/80 text-sm">{{ t('profile.premium.features') }}</p>
              </div>
            </div>
            <router-link 
              to="/settings"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {{ t('profile.premium.manage') }}
            </router-link>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6 mt-6">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ userStats.storiesCreated }}</p>
            <p class="text-text-secondary text-sm">{{ t('profile.stats.stories') }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-crimson">{{ userStats.totalLikes }}</p>
            <p class="text-text-secondary text-sm">{{ t('profile.stats.totalLikes') }}</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-teal">{{ userStats.followers }}</p>
            <p class="text-text-secondary text-sm">{{ t('profile.stats.followers') }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-4 mb-6">
        <button
          @click="currentTab = 'stories'"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all',
            currentTab === 'stories'
              ? 'bg-primary text-white'
              : 'bg-background-card text-text-secondary hover:text-text-primary'
          ]"
        >
          {{ t('profile.tabs.myStories') }} ({{ myStories.length }})
        </button>
        <button
          @click="currentTab = 'saved'"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all',
            currentTab === 'saved'
              ? 'bg-primary text-white'
              : 'bg-background-card text-text-secondary hover:text-text-primary'
          ]"
        >
          {{ t('profile.tabs.saved') }} ({{ savedStoriesList.length }})
        </button>
        <button
          @click="currentTab = 'liked'"
          :class="[
            'px-6 py-3 rounded-xl font-semibold transition-all',
            currentTab === 'liked'
              ? 'bg-primary text-white'
              : 'bg-background-card text-text-secondary hover:text-text-primary'
          ]"
        >
          {{ t('profile.tabs.liked') }} ({{ likedStoriesList.length }})
        </button>
      </div>

      <!-- Content -->
      <div v-if="currentTab === 'stories'">
        <div v-if="myStories.length === 0" class="text-center py-20">
          <p class="text-text-secondary text-lg mb-4">{{ t('profile.empty.noStories') }}</p>
          <router-link
            to="/create"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors"
          >
            <span>{{ t('profile.empty.createFirst') }}</span>
          </router-link>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StoryCard
            v-for="story in myStories"
            :key="story.id"
            :story="story"
          />
        </div>
      </div>

      <div v-if="currentTab === 'saved'">
        <div v-if="savedStoriesList.length === 0" class="text-center py-20">
          <p class="text-text-secondary text-lg">{{ t('profile.empty.noSaved') }}</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StoryCard
            v-for="story in savedStoriesList"
            :key="story.id"
            :story="story"
          />
        </div>
      </div>

      <div v-if="currentTab === 'liked'">
        <div v-if="likedStoriesList.length === 0" class="text-center py-20">
          <p class="text-text-secondary text-lg">{{ t('profile.empty.noLiked') }}</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StoryCard
            v-for="story in likedStoriesList"
            :key="story.id"
            :story="story"
          />
        </div>
      </div>
    </div>
  </div>
</template>
