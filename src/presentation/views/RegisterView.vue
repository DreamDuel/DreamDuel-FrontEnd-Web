<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import { SparklesIcon, UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { googleTokenLogin } from 'vue3-google-login';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const acceptTerms = ref(false);
const isLoading = ref(false);
const isWarmingUp = ref(false);
const error = ref('');

// Validaciones en tiempo real
const hasMinLength = computed(() => password.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(password.value));
const hasLowercase = computed(() => /[a-z]/.test(password.value));
const hasNumber = computed(() => /\d/.test(password.value));
const passwordsMatch = computed(() => password.value === confirmPassword.value && confirmPassword.value.length > 0);

const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return t('auth.register.errorPasswordMin8');
  }
  if (!/[A-Z]/.test(password)) {
    return t('auth.register.errorPasswordUppercase');
  }
  if (!/[a-z]/.test(password)) {
    return t('auth.register.errorPasswordLowercase');
  }
  if (!/\d/.test(password)) {
    return t('auth.register.errorPasswordNumber');
  }
  return null; // Válida
};

const handleRegister = async () => {
  error.value = '';
  
  // Validar formato de contraseña
  const passwordError = validatePassword(password.value);
  if (passwordError) {
    error.value = passwordError;
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = t('auth.register.errorPasswordMismatch');
    return;
  }
  
  if (!acceptTerms.value) {
    error.value = t('auth.register.errorAcceptTerms');
    return;
  }

  isLoading.value = true;
  
  // Mostrar "warming up" después de 8 segundos (backend en Render free tier tarda ~30-60s en despertar)
  const warmingTimer = setTimeout(() => {
    isWarmingUp.value = true;
  }, 8000);
  
  const result = await userStore.register(username.value, email.value, password.value);
  clearTimeout(warmingTimer);
  isLoading.value = false;
  isWarmingUp.value = false;
  
  if (result.success) {
    router.push('/home');
  } else {
    // Detectar error de cuenta duplicada
    if (result.error === 'ACCOUNT_EXISTS') {
      error.value = t('auth.register.errorAccountExists');
    } else {
      error.value = result.error || t('auth.register.errorPasswordMismatch');
    }
  }
};

const handleGoogleLogin = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    // Usar googleAuthCodeLogin en lugar de googleTokenLogin
    const { googleAuthCodeLogin } = await import('vue3-google-login');
    
    const response: any = await googleAuthCodeLogin({
      clientId: '1014759548576-i6n3bgji9aq8ejmrr6666a698p9alsfa.apps.googleusercontent.com',
    });
    
    console.log('🔍 GOOGLE RESPONSE:', response);
    
    // Obtener el ID token del credential
    const googleToken = response.credential;
    
    if (!googleToken) {
      error.value = 'No se pudo obtener el token de Google';
      return;
    }
    
    console.log('✅ Token obtenido:', googleToken.substring(0, 50) + '...');
    
    const result = await userStore.loginWithGoogle(googleToken);
    
    if (result.success) {
      router.push('/home');
    } else {
      error.value = result.error || t('auth.register.errorGeneric');
    }
  } catch (err: any) {
    console.error('Google login error:', err);
    error.value = t('auth.register.errorGoogle');
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background-deep via-background-elevated to-background-deep px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Logo y Título -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center space-x-3 mb-4">
          <SparklesIcon class="h-12 w-12 text-primary animate-pulse" />
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent-teal bg-clip-text text-transparent">
            DreamDuel
          </h1>
        </div>
        <p class="text-text-secondary text-lg">
          {{ t('auth.register.joinCommunity') }}
        </p>
      </div>

      <!-- Formulario de Registro -->
      <div class="bg-background-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <h2 class="text-2xl font-bold text-text-primary mb-6 text-center">
          {{ t('auth.register.title') }}
        </h2>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 bg-error/20 border-2 border-error rounded-xl p-4 animate-shake">
          <p class="text-error text-sm font-semibold">{{ error }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-text-secondary mb-2">
              {{ t('auth.register.username') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 bg-background-elevated border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                :placeholder="t('auth.register.usernamePlaceholder')"
              />
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-text-secondary mb-2">
              {{ t('auth.register.email') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 bg-background-elevated border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                :placeholder="t('auth.register.emailPlaceholder')"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-text-secondary mb-2">
              {{ t('auth.register.password') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="8"
                class="w-full pl-10 pr-12 py-3 bg-background-elevated border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                :placeholder="t('auth.register.passwordPlaceholder')"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <EyeSlashIcon v-if="showPassword" class="h-5 w-5" />
                <EyeIcon v-else class="h-5 w-5" />
              </button>
            </div>
            
            <!-- Requisitos de contraseña -->
            <div v-if="password.length > 0" class="mt-3 space-y-1.5 text-sm">
              <div class="flex items-center" :class="hasMinLength ? 'text-green-400' : 'text-text-tertiary'">
                <CheckCircleIcon v-if="hasMinLength" class="h-4 w-4 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 mr-2" />
                <span>{{ t('auth.register.reqMin8') }}</span>
              </div>
              <div class="flex items-center" :class="hasUppercase ? 'text-green-400' : 'text-text-tertiary'">
                <CheckCircleIcon v-if="hasUppercase" class="h-4 w-4 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 mr-2" />
                <span>{{ t('auth.register.reqUppercase') }}</span>
              </div>
              <div class="flex items-center" :class="hasLowercase ? 'text-green-400' : 'text-text-tertiary'">
                <CheckCircleIcon v-if="hasLowercase" class="h-4 w-4 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 mr-2" />
                <span>{{ t('auth.register.reqLowercase') }}</span>
              </div>
              <div class="flex items-center" :class="hasNumber ? 'text-green-400' : 'text-text-tertiary'">
                <CheckCircleIcon v-if="hasNumber" class="h-4 w-4 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 mr-2" />
                <span>{{ t('auth.register.reqNumber') }}</span>
              </div>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-text-secondary mb-2">
              {{ t('auth.register.confirmPassword') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-text-tertiary" />
              </div>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 bg-background-elevated border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                :placeholder="t('auth.register.confirmPasswordPlaceholder')"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <EyeSlashIcon v-if="showConfirmPassword" class="h-5 w-5" />
                <EyeIcon v-else class="h-5 w-5" />
              </button>
            </div>
            
            <!-- Indicador de coincidencia -->
            <div v-if="confirmPassword.length > 0" class="mt-3 text-sm">
              <div class="flex items-center" :class="passwordsMatch ? 'text-green-400' : 'text-error'">
                <CheckCircleIcon v-if="passwordsMatch" class="h-4 w-4 mr-2" />
                <XCircleIcon v-else class="h-4 w-4 mr-2" />
                <span v-if="passwordsMatch">{{ t('auth.register.passwordsMatch') }}</span>
                <span v-else>{{ t('auth.register.passwordsDontMatch') }}</span>
              </div>
            </div>
          </div>

          <!-- Términos y Condiciones -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 mt-1 rounded border-white/10 bg-background-elevated text-primary focus:ring-primary focus:ring-offset-0 transition-all"
            />
            <label for="terms" class="ml-3 text-sm text-text-secondary">
              {{ t('auth.register.acceptTerms') }} 
              <router-link to="/terms" class="text-primary hover:text-primary-light underline">{{ t('auth.register.terms') }}</router-link>
              {{ t('auth.register.and') }} 
              <router-link to="/privacy" class="text-primary hover:text-primary-light underline">{{ t('auth.register.privacy') }}</router-link>
            </label>
          </div>

          <!-- Botón Register -->
          <button
            type="submit"
            :disabled="isLoading || !acceptTerms"
            class="w-full py-3 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span v-if="!isLoading">{{ t('auth.register.button') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span v-if="isWarmingUp">{{ t('auth.register.warmingUp') }}</span>
              <span v-else>{{ t('auth.register.creating') }}</span>
            </span>
          </button>
        </form>

        <!-- Separador -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-background-card text-text-tertiary">{{ t('auth.register.orRegisterWith') }}</span>
          </div>
        </div>

        <!-- Social Register -->
        <button 
          @click="handleGoogleLogin"
          :disabled="isLoading"
          type="button"
          class="w-full flex items-center justify-center space-x-3 py-3 bg-background-elevated border border-white/10 rounded-lg hover:bg-background-elevated/80 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#4285F4" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#34A853" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="text-text-primary font-medium">{{ t('auth.register.continueWithGoogle') }}</span>
        </button>

        <!-- Login -->
        <div class="mt-6 text-center">
          <p class="text-text-secondary">
            {{ t('auth.register.haveAccount') }}
            <button 
              @click="goToLogin"
              class="text-primary hover:text-primary-light font-semibold ml-1 transition-colors"
            >
              {{ t('auth.register.signIn') }}
            </button>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-text-tertiary text-sm">
        <p>{{ t('auth.register.footer') }}</p>
      </div>
    </div>
  </div>
</template>
