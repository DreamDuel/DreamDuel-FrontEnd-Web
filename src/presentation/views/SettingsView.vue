<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

const formData = ref({
  username: 'Usuario',
  email: 'usuario@dreamduel.com',
  bio: '',
  notifications: true,
  theme: 'dark'
});

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
});

const showPasswordModal = ref(false);

const goBack = () => {
  router.push('/profile');
};

const saveProfile = () => {
  // TODO: Implementar guardado con el backend
  console.log('Saving profile:', formData.value);
};

const updatePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert(t('common.error'));
    return;
  }
  // TODO: Implementar cambio de contraseña
  console.log('Updating password');
  showPasswordModal.value = false;
  passwordForm.value = { current: '', new: '', confirm: '' };
};

const logout = () => {
  if (confirm(t('settings.confirmLogout'))) {
    localStorage.removeItem('authToken');
    router.push('/onboarding');
  }
};
</script>

<template>
  <div class="min-h-screen bg-background-deep">
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
              placeholder="Cuéntanos sobre ti..."
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
            {{ t('common.save') }}
          </button>
        </div>
      </div>

      <!-- Preferences Section -->
      <div class="bg-background-card rounded-2xl p-6 mb-6">
        <h2 class="text-xl font-bold text-text-primary mb-6">{{ t('settings.preferences.title') }}</h2>
        
        <div class="space-y-6">
          <!-- Notifications Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-primary font-medium">{{ t('settings.preferences.notifications') }}</p>
              <p class="text-text-tertiary text-sm">Recibe actualizaciones de tus historias</p>
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
              <h2 class="text-xl font-bold text-text-primary">Premium</h2>
            </div>
            <p class="text-text-secondary mb-4">Desbloquea funciones premium</p>
            <ul class="space-y-2 mb-6">
              <li class="flex items-center space-x-2 text-text-secondary">
                <span class="text-accent-teal">✓</span>
                <span>Sin límite de generaciones</span>
              </li>
              <li class="flex items-center space-x-2 text-text-secondary">
                <span class="text-accent-teal">✓</span>
                <span>Estilos visuales exclusivos</span>
              </li>
              <li class="flex items-center space-x-2 text-text-secondary">
                <span class="text-accent-teal">✓</span>
                <span>Sin anuncios</span>
              </li>
            </ul>
          </div>
        </div>
        <button class="w-full px-6 py-3 bg-gradient-to-r from-accent-purple to-primary hover:from-accent-purple/80 hover:to-primary/80 text-white font-semibold rounded-xl transition-all">
          Actualizar a Premium
        </button>
      </div>

      <!-- Legal Section -->
      <div class="bg-background-card rounded-2xl p-6 mb-6">
        <h2 class="text-xl font-bold text-text-primary mb-4">Legal</h2>
        <div class="space-y-3">
          <button class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            Términos y Condiciones
          </button>
          <button class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            Política de Privacidad
          </button>
          <button class="w-full text-left px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-colors">
            Sobre DreamDuel
          </button>
        </div>
      </div>

      <!-- Logout Section -->
      <button
        @click="logout"
        class="w-full px-6 py-4 bg-error/10 hover:bg-error/20 text-error font-semibold rounded-xl transition-colors border border-error/30"
      >
        Cerrar Sesión
      </button>
    </div>

    <!-- Password Modal -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="showPasswordModal = false"
    >
      <div class="bg-background-card rounded-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-text-primary mb-6">Cambiar Contraseña</h3>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Contraseña actual</label>
            <input
              v-model="passwordForm.current"
              type="password"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Nueva contraseña</label>
            <input
              v-model="passwordForm.new"
              type="password"
              class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2">Confirmar contraseña</label>
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
            Actualizar
          </button>
          <button
            @click="showPasswordModal = false"
            class="px-6 py-3 bg-background-elevated hover:bg-background-elevated/80 text-text-secondary font-semibold rounded-xl transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
