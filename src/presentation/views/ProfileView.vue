<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { useStoryStore } from '@/stores/storyStore';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import StoryCard from '@/presentation/components/StoryCard.vue';

const storyStore = useStoryStore();
const userStore = useUserStore();
const router = useRouter();
const currentTab = ref<'stories' | 'saved' | 'liked'>('stories');
const isEditingProfile = ref(false);
const editForm = ref({
  username: '',
  bio: ''
});

onMounted(async () => {
  // Cargar usuario desde localStorage si existe
  userStore.loadUserFromStorage();
  
  // Cargar historias
  await Promise.all([
    storyStore.fetchStories(),
    storyStore.fetchSavedStories()
  ]);
  
  // Inicializar formulario de edición
  if (userStore.currentUser) {
    editForm.value.username = userStore.currentUser.username;
    editForm.value.bio = userStore.currentUser.bio;
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
  return storyStore.stories.filter(s => userStore.currentUser?.myStories.includes(s.id));
});

const savedStoriesList = computed(() => {
  if (!userStore.currentUser?.savedStories) return [];
  return [...storyStore.stories, ...storyStore.savedStories].filter(s => 
    userStore.currentUser?.savedStories.includes(s.id)
  );
});

const likedStoriesList = computed(() => {
  if (!userStore.currentUser?.likedStories) return [];
  return [...storyStore.stories, ...storyStore.trendingStories, ...storyStore.newStories].filter(s => 
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
</script>

<template>
  <div class="min-h-screen bg-background-deep">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header del Perfil -->
      <div class="bg-background-card rounded-2xl p-8 mb-8">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-center space-x-6">
            <!-- Avatar -->
            <div>
              <img 
                :src="userStore.currentUser?.avatarUrl || 'https://ui-avatars.com/api/?name=Usuario&background=0099FF&color=fff&size=200'"
                alt="Avatar" 
                class="h-24 w-24 rounded-full border-4 border-primary/30 object-cover"
              />
            </div>

            <!-- Info -->
            <div class="flex-1">
              <div v-if="!isEditingProfile">
                <h1 class="text-3xl font-bold text-text-primary mb-2">{{ userStore.currentUser?.username || 'Usuario' }}</h1>
                <p class="text-text-secondary">{{ userStore.currentUser?.email || 'usuario@dreamduel.com' }}</p>
                <p v-if="userStore.currentUser?.bio" class="text-text-tertiary mt-2 text-sm">{{ userStore.currentUser.bio }}</p>
                <p v-else class="text-text-tertiary mt-2 text-sm italic">Sin biografía</p>
              </div>
              <div v-else class="space-y-3">
                <input
                  v-model="editForm.username"
                  type="text"
                  placeholder="Nombre de usuario"
                  class="w-full px-4 py-2 bg-background-elevated border border-white/10 rounded-lg text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <textarea
                  v-model="editForm.bio"
                  placeholder="Biografía (opcional)"
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
              :title="isEditingProfile ? 'Guardar cambios' : 'Editar perfil'"
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
              title="Cerrar sesión"
            >
              <ArrowRightOnRectangleIcon class="h-6 w-6 text-text-secondary group-hover:text-error transition-colors" />
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ userStats.storiesCreated }}</p>
            <p class="text-text-secondary text-sm">Historias</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-crimson">{{ userStats.totalLikes }}</p>
            <p class="text-text-secondary text-sm">Likes</p>
          </div>
          <div class="text-center">
            <p class="text-3xl font-bold text-accent-teal">{{ userStats.followers }}</p>
            <p class="text-text-secondary text-sm">Seguidores</p>
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
          Mis Historias ({{ myStories.length }})
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
          Guardadas ({{ savedStoriesList.length }})
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
          Me gusta ({{ likedStoriesList.length }})
        </button>
      </div>

      <!-- Content -->
      <div v-if="currentTab === 'stories'">
        <div v-if="myStories.length === 0" class="text-center py-20">
          <p class="text-text-secondary text-lg mb-4">Aún no has creado historias</p>
          <router-link
            to="/create"
            class="inline-flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors"
          >
            <span>Crear tu primera historia</span>
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
          <p class="text-text-secondary text-lg">No tienes historias guardadas</p>
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
          <p class="text-text-secondary text-lg">No has dado like a ninguna historia</p>
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
