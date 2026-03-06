<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon, PencilIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const isEditingProfile = ref(false);
const editForm = ref({
  username: ''
});

onMounted(async () => {
  // Cargar usuario desde localStorage si existe
  userStore.loadUserFromStorage();
  
  // Inicializar formulario de edición
  if (userStore.currentUser) {
    editForm.value.username = userStore.currentUser.username;
  }
});

const handleLogout = async () => {
  await userStore.logout();
  router.push('/');
};

const toggleEditProfile = () => {
  if (isEditingProfile.value) {
    // Guardar cambios
    userStore.updateProfile({
      username: editForm.value.username
    });
  } else {
    // Iniciar edición
    if (userStore.currentUser) {
      editForm.value.username = userStore.currentUser.username;
    }
  }
  isEditingProfile.value = !isEditingProfile.value;
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
              </div>
              <div v-else class="space-y-3">
                <input
                  v-model="editForm.username"
                  type="text"
                  :placeholder="t('profile.edit.username')"
                  class="w-full px-4 py-2 bg-background-elevated border border-white/10 rounded-lg text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
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
      </div>

      <!-- Profile Stats -->
      <div class="bg-background-card rounded-2xl p-6 border border-white/5">
        <h2 class="text-lg font-semibold text-text-primary mb-4">{{ t('profile.stats.title') }}</h2>
        <div class="grid grid-cols-1 gap-4">
          <div class="bg-background-elevated rounded-xl p-4">
            <p class="text-text-tertiary text-sm mb-1">{{ t('profile.stats.memberSince') }}</p>
            <p class="text-text-primary text-lg font-semibold">
              {{ userStore.currentUser?.createdAt ? new Date(userStore.currentUser.createdAt).toLocaleDateString() : 'N/A' }}
            </p>
          </div>
          <div class="bg-background-elevated rounded-xl p-4">
            <p class="text-text-tertiary text-sm mb-1">{{ t('profile.stats.email') }}</p>
            <p class="text-text-primary text-lg font-semibold">
              {{ userStore.currentUser?.email || 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
