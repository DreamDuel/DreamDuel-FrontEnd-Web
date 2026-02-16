<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SparklesIcon, PhotoIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const { t } = useI18n();

const router = useRouter();
const prompt = ref('');
const negativePrompt = ref('');
const isGenerating = ref(false);
const showRegisterPrompt = ref(false);
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref<string>('');
const generatedImageUrl = ref<string>('');
const showAdvancedOptions = ref(false);

// El prompt ya no se genera automáticamente, el usuario lo escribe directamente

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 5MB');
      return;
    }
    
    characterImage.value = file;
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrl.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  characterImage.value = null;
  imagePreviewUrl.value = '';
};

const canGenerate = computed(() => {
  return prompt.value.trim().length > 0 && characterImage.value !== null && !isGenerating.value;
});

const generateStory = async () => {
  if (!canGenerate.value) return;
  
  isGenerating.value = true;
  
  // Simular generación de imagen única
  setTimeout(() => {
    console.log('Generating guest image:', {
      prompt: prompt.value,
      negativePrompt: negativePrompt.value,
      characterImage: characterImage.value?.name
    });
    
    // Simular URL de imagen generada
    generatedImageUrl.value = 'https://picsum.photos/800/1000';
    
    isGenerating.value = false;
    // Mostrar prompt para registrarse después de ver la imagen
    showRegisterPrompt.value = true;
  }, 3000);
};

const goToRegister = () => {
  // Guardar datos en sessionStorage para recuperar después del registro
  sessionStorage.setItem('guestStory', JSON.stringify({
    prompt: prompt.value,
    negativePrompt: negativePrompt.value,
    imageUrl: generatedImageUrl.value
  }));
  router.push('/register');
};

const skipToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep">
    <!-- Header con CTA -->
    <div class="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-md border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <SparklesIcon class="h-8 w-8 text-primary" />
          <span class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            DreamDuel
          </span>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="skipToLogin"
            class="px-4 py-2 text-text-secondary hover:text-primary transition-colors"
          >
            {{ t('guest.header.login') }}
          </button>
          <button
            @click="goToRegister"
            class="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all"
          >
            {{ t('guest.header.register') }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center px-4 py-20">
      <div class="w-full max-w-3xl">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center space-x-3 mb-4">
            <SparklesIcon class="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-text-primary mb-4">
            {{ t('guest.hero.title') }}
          </h1>
          <p class="text-text-secondary text-xl mb-6">
            {{ t('guest.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-text-tertiary">
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>{{ t('guest.hero.features.noCard') }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>{{ t('guest.hero.features.instant') }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>{{ t('guest.hero.features.free') }}</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Creación -->
        <div class="bg-background-card border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl backdrop-blur-sm mb-8">
          <!-- Upload de Imagen -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-base md:text-lg">
              1. {{ t('guest.steps.uploadImage') }}
            </label>
            
            <div v-if="!imagePreviewUrl" class="relative">
              <input
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
                id="characterImageInput"
              />
              <label
                for="characterImageInput"
                class="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-background-elevated/50 transition-all cursor-pointer group"
              >
                <PhotoIcon class="h-16 w-16 text-text-tertiary group-hover:text-primary transition-colors mb-3" />
                <span class="text-text-primary font-medium mb-1">{{ t('guest.steps.uploadClick') }}</span>
                <span class="text-text-tertiary text-sm">{{ t('guest.steps.maxSize') }}</span>
              </label>
            </div>
            
            <div v-else class="relative">
              <img :src="imagePreviewUrl" alt="Preview" class="w-full max-h-96 object-contain rounded-xl bg-background-elevated" />
              <button
                @click="removeImage"
                class="absolute top-3 right-3 p-2 bg-error/90 hover:bg-error text-white rounded-lg transition-colors"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Campos de PROMPT y NEGATIVE PROMPT -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-base md:text-lg">
              2. {{ t('guest.steps.promptLabel') }}
            </label>
            
            <!-- PROMPT -->
            <div class="mb-4">
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.steps.promptDescription') }}
                <span class="text-accent-crimson">*</span>
              </label>
              <textarea
                v-model="prompt"
                :placeholder="t('guest.steps.promptPlaceholder')"
                rows="4"
                class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              ></textarea>
              <p class="text-text-tertiary text-sm mt-2">
                💡 {{ t('guest.steps.promptExample') }}
              </p>
            </div>
            
            <!-- NEGATIVE PROMPT -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.steps.negativePromptDescription') }}
              </label>
              <textarea
                v-model="negativePrompt"
                :placeholder="t('guest.steps.negativePromptPlaceholder')"
                rows="3"
                class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              ></textarea>
              <p class="text-text-tertiary text-sm mt-2">
                💡 {{ t('guest.steps.negativePromptExample') }}
              </p>
            </div>
          </div>

          <!-- Opciones Avanzadas (Bloqueadas) -->
          <div class="mb-8">
            <button
              @click="showAdvancedOptions = !showAdvancedOptions"
              class="flex items-center justify-between w-full text-left text-text-primary font-semibold mb-3 text-base md:text-lg hover:text-primary transition-colors"
            >
              <span>⚙️ {{ t('guest.steps.advancedOptions') }}</span>
              <svg
                :class="['w-5 h-5 transition-transform', showAdvancedOptions ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <Transition name="slide-fade">
              <div v-if="showAdvancedOptions" class="space-y-6">
                <!-- Género del Personaje (Bloqueado) -->
                <div>
                  <label class="block text-text-secondary font-medium mb-3 text-sm">
                    {{ t('guest.steps.genderLabel') }}
                    <span class="ml-2 px-2 py-0.5 bg-accent-gold/20 text-accent-gold rounded text-xs">🔒 {{ t('guest.steps.registerRequired') }}</span>
                  </label>
                  
                  <button
                    @click="goToRegister"
                    class="w-full flex items-center justify-center space-x-3 py-6 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div class="text-center">
                      <div class="text-4xl mb-2">🔒</div>
                      <span class="text-primary font-semibold group-hover:text-primary-light transition-colors">
                        {{ t('guest.steps.registerToUnlockButton') }}
                      </span>
                    </div>
                  </button>
                  
                  <p class="text-text-tertiary text-sm mt-2">
                    💡 {{ t('guest.steps.genderDescription') }}
                  </p>
                </div>

                <!-- Tipo de Cuerpo (Bloqueado) -->
                <div>
                  <label class="block text-text-secondary font-medium mb-3 text-sm">
                    {{ t('guest.steps.bodyTypeLabel') }}
                    <span class="ml-2 px-2 py-0.5 bg-accent-gold/20 text-accent-gold rounded text-xs">🔒 {{ t('guest.steps.registerRequired') }}</span>
                  </label>
                  
                  <button
                    @click="goToRegister"
                    class="w-full flex items-center justify-center space-x-3 py-6 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div class="text-center">
                      <div class="text-4xl mb-2">🔒</div>
                      <span class="text-primary font-semibold group-hover:text-primary-light transition-colors">
                        {{ t('guest.steps.registerToUnlockButton') }}
                      </span>
                    </div>
                  </button>
                  
                  <p class="text-text-tertiary text-sm mt-2">
                    💡 {{ t('guest.steps.bodyTypeDescription') }}
                  </p>
                </div>

                <!-- Pose del Personaje (Bloqueada) -->
                <div>
                  <label class="block text-text-secondary font-medium mb-2 text-sm">
                    {{ t('guest.steps.poseLabelLocked') }}
                    <span class="ml-2 px-2 py-0.5 bg-accent-gold/20 text-accent-gold rounded text-xs">🔒 {{ t('guest.steps.registerRequired') }}</span>
                  </label>
                  
                  <button
                    @click="goToRegister"
                    class="w-full flex items-center justify-center space-x-3 py-6 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div class="text-center">
                      <div class="text-4xl mb-2">🔒</div>
                      <span class="text-primary font-semibold group-hover:text-primary-light transition-colors">
                        {{ t('guest.steps.registerToUnlockButton') }}
                      </span>
                    </div>
                  </button>
                  
                  <p class="text-text-tertiary text-sm mt-2">
                    💡 {{ t('guest.steps.poseExample') }}
                  </p>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Botón de Generar -->
          <button
            @click="generateStory"
            :disabled="!canGenerate"
            :class="[
              'w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3',
              !canGenerate
                ? 'bg-background-elevated text-text-tertiary cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-accent-teal text-white hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95'
            ]"
          >
            <template v-if="isGenerating">
              <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ t('guest.generate.generating') }}</span>
            </template>
            <template v-else>
              <SparklesIcon class="h-6 w-6" />
              <span>{{ t('guest.generate.button') }}</span>
            </template>
          </button>

          <p v-if="!canGenerate && !isGenerating" class="text-text-tertiary text-sm mt-3 text-center">
            {{ !characterImage ? t('guest.generate.uploadRequired') : t('guest.generate.descRequired') }}
          </p>
        </div>

        <!-- Beneficios de registrarse -->
        <div class="bg-gradient-to-r from-primary/10 to-accent-teal/10 rounded-xl p-6 border border-primary/20">
          <h3 class="font-bold text-text-primary mb-4 text-center">
            {{ t('guest.benefits.title') }}
          </h3>
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="text-center">
              <div class="text-2xl mb-2">🎁</div>
              <div class="text-text-primary font-semibold">{{ t('guest.benefits.freeImages') }}</div>
              <div class="text-text-tertiary">{{ t('guest.benefits.freeDesc') }}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">💾</div>
              <div class="text-text-primary font-semibold">{{ t('guest.benefits.saveCreations') }}</div>
              <div class="text-text-tertiary">{{ t('guest.benefits.saveDesc') }}</div>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">👥</div>
              <div class="text-text-primary font-semibold">{{ t('guest.benefits.inviteFriends') }}</div>
              <div class="text-text-tertiary">{{ t('guest.benefits.inviteDesc') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Vista Previa de Imagen Generada + Registrarse -->
    <Transition name="modal">
      <div v-if="showRegisterPrompt && generatedImageUrl" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <div class="relative w-full max-w-2xl bg-background-card rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          <button @click="showRegisterPrompt = false" class="absolute top-4 right-4 z-10 text-text-secondary hover:text-text-primary transition-colors bg-background-deep/80 p-2 rounded-lg">
            <XMarkIcon class="h-6 w-6" />
          </button>
          
          <div class="p-8">
            <div class="text-center mb-6">
              <div class="text-6xl mb-4">🎉</div>
              <h2 class="text-2xl font-bold text-text-primary mb-2">
                {{ t('guest.modal.ready') }}
              </h2>
              <p class="text-text-secondary">
                {{ t('guest.modal.subtitle') }}
              </p>
            </div>

            <!-- Imagen Generada -->
            <div class="mb-6">
              <img :src="generatedImageUrl" alt="Generated" class="w-full max-h-96 object-contain rounded-xl shadow-xl bg-background-elevated" />
            </div>
            
            <div class="space-y-3">
              <button
                @click="goToRegister"
                class="w-full px-6 py-4 bg-gradient-to-r from-primary to-accent-teal hover:from-primary-light hover:to-accent-teal/80 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{{ t('guest.modal.registerButton') }}</span>
                <ArrowRightIcon class="h-5 w-5" />
              </button>
              
              <button
                @click="skipToLogin"
                class="w-full px-6 py-3 bg-background-elevated hover:bg-background-card text-text-primary rounded-xl font-semibold transition-colors"
              >
                {{ t('guest.modal.haveAccount') }}
              </button>
            </div>

            <p class="text-xs text-text-tertiary mt-4 text-center">
              {{ t('guest.modal.noCard') }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-background-card,
.modal-leave-active .bg-background-card {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-background-card,
.modal-leave-to .bg-background-card {
  transform: scale(0.95);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
