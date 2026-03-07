<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PhotoIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid';

const { t } = useI18n();
const route = useRoute();

const API_URL = import.meta.env.VITE_API_URL || 'https://dreamduel-backend-web.onrender.com/api';

const prompt = ref('');
const negativePrompt = ref('');
const isGenerating = ref(false);
const error = ref('');
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref<string>('');
const poseImage = ref<File | null>(null);
const posePreviewUrl = ref<string>('');
const showAdvancedOptions = ref(false);
const selectedGender = ref<string>('');
const selectedBodyType = ref<string>('');
const generatedImageUrl = ref<string>('');
const generatedPrompt = ref<string>('');
const showResultModal = ref(false);

// Obtener o crear session_id
const getSessionId = () => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('guest_session_id', sessionId);
    console.log('🆔 Nueva sesión guest creada:', sessionId);
  }
  return sessionId;
};

// Cargar prompt desde query params si viene desde HomeView
onMounted(() => {
  if (route.query.prompt && typeof route.query.prompt === 'string') {
    prompt.value = route.query.prompt;
  }
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Tamaño máximo: 5MB');
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

const handlePoseFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Tamaño máximo: 5MB');
      return;
    }
    
    poseImage.value = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        posePreviewUrl.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};

const removePoseImage = () => {
  poseImage.value = null;
  posePreviewUrl.value = '';
};

const canGenerate = computed(() => {
  return prompt.value.trim().length > 5 && !isGenerating.value;
});

// Intentar generar imagen
const generateImage = async () => {
  if (!canGenerate.value) return;
  
  isGenerating.value = true;
  error.value = '';
  const sessionId = getSessionId();
  
  console.log('🎨 Intentando generar imagen...');
  console.log('🆔 Session ID:', sessionId);

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.value,
        negativePrompt: negativePrompt.value || undefined,
        style: 'fantasy',
        aspectRatio: '16:9',
        sessionId: sessionId
      })
    });

    if (response.status === 402) {
      // Necesita pagar - Redirigir a PayPal
      console.log('💳 Se requiere pago, iniciando compra...');
      await initiatePurchase();
      return;
    }

    if (response.status === 409) {
      // Ya generó con este pago
      error.value = 'Ya generaste tu imagen con este pago. Paga $1 para generar otra.';
      isGenerating.value = false;
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al generar imagen');
    }

    const data = await response.json();
    console.log('✅ Imagen generada:', data);
    
    generatedImageUrl.value = data.imageUrl;
    generatedPrompt.value = prompt.value;
    showResultModal.value = true;
    
  } catch (err: any) {
    console.error('❌ Error al generar:', err);
    error.value = err.message || 'Error al generar imagen';
  } finally {
    isGenerating.value = false;
  }
};

// Iniciar compra en PayPal
const initiatePurchase = async () => {
  const sessionId = getSessionId();
  
  console.log('💳 Iniciando compra de imagen...');
  
  try {
    const response = await fetch(`${API_URL}/payments/guest/purchase-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/images`
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear orden de pago');
    }

    const data = await response.json();
    console.log('✅ Orden creada, redirigiendo a PayPal...');
    console.log('🔗 Approval URL:', data.approvalUrl);
    
    // Redirigir a PayPal
    window.location.href = data.approvalUrl;
    
  } catch (err: any) {
    console.error('❌ Error al crear orden:', err);
    error.value = 'Error al crear orden de pago. Intenta nuevamente.';
    isGenerating.value = false;
  }
};

const downloadImage = async () => {
  if (!generatedImageUrl.value) return;
  
  try {
    const response = await fetch(generatedImageUrl.value);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dreamduel-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    alert('Error al descargar la imagen');
  }
};

const closeResultModal = () => {
  showResultModal.value = false;
  generatedImageUrl.value = '';
  generatedPrompt.value = '';
  
  // Limpiar campos del formulario
  prompt.value = '';
  negativePrompt.value = '';
  characterImage.value = null;
  imagePreviewUrl.value = '';
  poseImage.value = null;
  posePreviewUrl.value = '';
  selectedGender.value = '';
  selectedBodyType.value = '';
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep flex items-center justify-center px-3 sm:px-4 py-12 sm:py-20">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-12">
        <div class="inline-flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <PhotoIcon class="h-8 w-8 sm:h-12 sm:w-12 text-primary animate-pulse" />
        </div>
        <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-2 sm:mb-4">
          {{ t('imageGenerator.title') }}
        </h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-xl mb-4 sm:mb-6">
          {{ t('imageGenerator.subtitle') }}
        </p>
      </div>

      <!-- Main Input Card -->
      <div class="bg-background-card border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-8 shadow-2xl backdrop-blur-sm mb-6 sm:mb-8">
        <!-- Upload de Imagen -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-text-primary font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
            {{ t('imageGenerator.step1') }}
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

        <!-- Opciones de Generación (Desbloqueadas) -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-text-primary font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
            {{ t('imageGenerator.step2') }}
          </label>
          
          <!-- PROMPT -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-text-secondary font-medium mb-2 text-xs sm:text-sm">
              {{ t('imageGenerator.promptLabel') }}
              <span class="text-accent-crimson">{{ t('imageGenerator.promptRequired') }}</span>
            </label>
            <textarea
              v-model="prompt"
              :placeholder="t('imageGenerator.promptPlaceholder')"
              rows="3"
              class="w-full px-3 py-2 sm:px-5 sm:py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary text-xs sm:text-sm placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            ></textarea>
            <p class="text-text-tertiary text-xs mt-1 sm:mt-2">
              {{ t('imageGenerator.promptTip') }}
            </p>
          </div>
          
          <!-- NEGATIVE PROMPT -->
          <div>
            <label class="block text-text-secondary font-medium mb-2 text-xs sm:text-sm">
              {{ t('imageGenerator.negativePromptLabel') }}
            </label>
            <textarea
              v-model="negativePrompt"
              :placeholder="t('imageGenerator.negativePromptPlaceholder')"
              rows="2"
              class="w-full px-3 py-2 sm:px-5 sm:py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary text-xs sm:text-sm placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            ></textarea>
            <p class="text-text-tertiary text-xs mt-1 sm:mt-2">
              {{ t('imageGenerator.negativePromptTip') }}
            </p>
          </div>
        </div>

        <!-- Opciones Avanzadas (PREMIUM ONLY) -->
        <div class="mb-6 sm:mb-8">
          <button
            @click="showAdvancedOptions = !showAdvancedOptions"
            class="flex items-center justify-between w-full text-left text-text-primary font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg hover:text-primary transition-colors"
          >
            <span>{{ t('guest.steps.advancedOptions') }}</span>
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
            <div v-if="showAdvancedOptions" class="space-y-4 sm:space-y-6">
              <!-- Género del Personaje -->
              <div>
                <label class="block text-text-secondary font-medium mb-2 sm:mb-3 text-xs sm:text-sm">
                  {{ t('create.advancedOptions.genderLabel') }}
                </label>
                
                <div class="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    @click="selectedGender = selectedGender === 'female' ? '' : 'female'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-3 sm:py-4 px-2 sm:px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedGender === 'female'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-white/10 bg-background-elevated hover:border-primary/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-text-primary font-medium text-xs sm:text-sm md:text-base">{{ t('create.advancedOptions.female') }}</span>
                  </button>
                  <button
                    @click="selectedGender = selectedGender === 'male' ? '' : 'male'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-3 sm:py-4 px-2 sm:px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedGender === 'male'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-white/10 bg-background-elevated hover:border-primary/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-text-primary font-medium text-xs sm:text-sm md:text-base">{{ t('create.advancedOptions.male') }}</span>
                  </button>
                </div>
              </div>

              <!-- Tipo de Cuerpo -->
              <div>
                <label class="block text-text-secondary font-medium mb-2 sm:mb-3 text-xs sm:text-sm">
                  {{ t('create.advancedOptions.bodyTypeLabel') }}
                </label>
                
                <div class="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    @click="selectedBodyType = selectedBodyType === 'female' ? '' : 'female'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-3 sm:py-4 px-2 sm:px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedBodyType === 'female'
                        ? 'border-accent-teal bg-accent-teal/10 shadow-lg shadow-accent-teal/20'
                        : 'border-white/10 bg-background-elevated hover:border-accent-teal/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-text-primary font-medium text-xs sm:text-sm md:text-base">{{ t('create.advancedOptions.femaleBody') }}</span>
                  </button>
                  <button
                    @click="selectedBodyType = selectedBodyType === 'male' ? '' : 'male'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-3 sm:py-4 px-2 sm:px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedBodyType === 'male'
                        ? 'border-accent-teal bg-accent-teal/10 shadow-lg shadow-accent-teal/20'
                        : 'border-white/10 bg-background-elevated hover:border-accent-teal/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-text-primary font-medium text-xs sm:text-sm md:text-base">{{ t('create.advancedOptions.maleBody') }}</span>
                  </button>
                </div>
              </div>

              <!-- Pose del Personaje -->
              <div>
                <label class="block text-text-secondary font-medium mb-2 text-xs sm:text-sm">
                  {{ t('create.advancedOptions.poseLabel') }}
                </label>
                
                <div>
                  <div v-if="!posePreviewUrl" class="relative">
                    <input
                      type="file"
                      accept="image/*"
                      @change="handlePoseFileSelect"
                      class="hidden"
                      id="poseImageInput"
                    />
                    <label
                      for="poseImageInput"
                      class="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-background-elevated/50 transition-all cursor-pointer group"
                    >
                      <PhotoIcon class="h-8 w-8 sm:h-12 sm:w-12 text-text-tertiary group-hover:text-primary transition-colors mb-2" />
                      <span class="text-text-primary font-medium text-xs sm:text-sm mb-1">{{ t('create.advancedOptions.poseUpload') }}</span>
                      <span class="text-text-tertiary text-xs">{{ t('create.advancedOptions.poseMaxSize') }}</span>
                    </label>
                  </div>
                  
                  <div v-else class="relative">
                    <img :src="posePreviewUrl" alt="Pose Preview" class="w-full max-h-64 object-contain rounded-xl bg-background-elevated border border-white/10" />
                    <button
                      @click="removePoseImage"
                      class="absolute top-3 right-3 p-2 bg-error/90 hover:bg-error text-white rounded-lg transition-colors"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <p class="text-text-tertiary text-xs mt-1 sm:mt-2">
                  {{ t('create.advancedOptions.poseDescription') }}
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Generate Button -->
        <!-- Botón de Generar -->
        <button
          @click="generateImage"
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
            <span>Procesando...</span>
          </template>
          <template v-else>
            <PhotoIcon class="h-6 w-6" />
            <span>Generar Imagen - $1</span>
          </template>
        </button>

        <!-- Error Message Inline -->
        <p v-if="error" class="mt-4 p-4 bg-error/10 border border-error/30 rounded-lg text-error text-sm text-center">
          {{ error }}
        </p>
      </div>
    </div>

    <!-- Modal de imagen generada -->
    <Transition name="modal">
      <div v-if="showResultModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/90 backdrop-blur-sm">
        <div class="bg-gradient-to-br from-background-card via-background-elevated to-background-card rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col relative border-2 border-primary/20 shadow-2xl shadow-primary/10">
          <!-- Botón cerrar -->
          <button
            @click="closeResultModal"
            class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all hover:scale-110 group"
          >
            <XMarkIcon class="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-primary transition-colors" />
          </button>
          
          <!-- Contenido del modal -->
          <div class="p-4 sm:p-6 md:p-8 flex-1 flex flex-col overflow-y-auto">
            <div class="text-center mb-3 sm:mb-4">
              <div class="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary/20 to-accent-crimson/20 rounded-full border border-primary/30 mb-1 sm:mb-2">
                <SparklesIcon class="w-4 h-4 sm:w-6 sm:h-6 text-primary animate-pulse" />
                <h2 class="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent-crimson bg-clip-text text-transparent">
                  {{ t('guest.resultModal.title') }}
                </h2>
              </div>
              <p class="text-text-secondary text-xs sm:text-sm mt-1 sm:mt-2">{{ t('guest.resultModal.subtitle') }}</p>
            </div>
            
            <!-- Imagen con marco elegante - se ajusta automáticamente -->
            <div class="relative mb-3 sm:mb-4 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white/5 shadow-2xl flex-shrink-0">
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-crimson/5"></div>
              <img 
                :src="generatedImageUrl" 
                :alt="generatedPrompt"
                class="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain relative z-10"
              />
            </div>
            
            <!-- Prompt usado con diseño mejorado -->
            <div class="mb-6 p-5 bg-gradient-to-br from-background-elevated to-background-card rounded-xl border border-white/10 backdrop-blur-sm">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <p class="text-xs font-semibold text-primary uppercase tracking-wider">{{ t('guest.resultModal.promptUsed') }}</p>
              </div>
              <p class="text-sm text-text-primary leading-relaxed">{{ generatedPrompt }}</p>
            </div>
            
            <!-- Botón de descarga mejorado -->
            <button
              @click="downloadImage"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary via-primary-light to-accent-crimson hover:from-primary-light hover:via-accent-crimson hover:to-primary text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 group"
            >
              <ArrowDownTrayIcon class="w-6 h-6 group-hover:animate-bounce" />
              {{ t('guest.resultModal.downloadButton') }}
            </button>
            
            <div class="text-center mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border-2 border-amber-500/30">
              <p class="text-sm font-semibold text-amber-400 flex items-center justify-center gap-2 mb-1">
                <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ t('guest.resultModal.warningTitle') }}
              </p>
              <p class="text-xs text-text-secondary">
                {{ t('guest.resultModal.warningText') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Error Message -->
    <Transition name="modal">
      <div v-if="error" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="error = ''">
        <div class="bg-background-card rounded-2xl p-6 max-w-md border-2 border-error/50" @click.stop>
          <h3 class="text-xl font-bold text-error mb-4">⚠️ Error</h3>
          <p class="text-text-secondary mb-6">{{ error }}</p>
          <button
            @click="error = ''"
            class="w-full px-6 py-3 bg-error hover:bg-error/80 text-white font-semibold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
