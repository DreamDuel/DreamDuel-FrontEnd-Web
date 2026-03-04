<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useI18n } from 'vue-i18n';
import { PhotoIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid';
import { SparklesIcon } from '@heroicons/vue/24/outline';
import ImageLimitModal from '@/presentation/components/ImageLimitModal.vue';
import UpgradeSlideout from '@/presentation/components/UpgradeSlideout.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const prompt = ref('');
const negativePrompt = ref('');
const isGenerating = ref(false);
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref<string>('');
const showLimitModal = ref(false);
const showUpgradeSlideout = ref(false);
const poseImage = ref<File | null>(null);
const posePreviewUrl = ref<string>('');
const showAdvancedOptions = ref(false);
const selectedGender = ref<string>('');
const selectedBodyType = ref<string>('');
const generatedImageUrl = ref<string>('');
const generatedPrompt = ref<string>('');
const showResultModal = ref(false);

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
      alert(t('profile.avatar.errorFormat'));
      return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('profile.avatar.errorSize'));
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
    
    poseImage.value = file;
    
    // Crear preview
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
  return prompt.value.trim().length > 5 && 
         characterImage.value !== null &&
         !isGenerating.value;
});

const generateImage = async () => {
  if (!canGenerate.value) return;
  
  // Verificar si es la primera generación (gratis)
  const isFreeGeneration = userStore.canGenerateFreeImage();
  
  if (!isFreeGeneration) {
    // No es gratis, mostrar modal de pago
    showLimitModal.value = true;
    return;
  }
  
  isGenerating.value = true;
  
  // Usar la generación gratis
  userStore.useFreeGeneration();
  
  // Rastrear la generación para PQL
  userStore.trackGeneration();
  
  // Simular generación (3-5 segundos)
  setTimeout(() => {
    console.log('Generating image with:', {
      prompt: prompt.value,
      negativePrompt: negativePrompt.value,
      gender: selectedGender.value,
      bodyType: selectedBodyType.value,
      characterImage: characterImage.value?.name,
      poseImage: poseImage.value?.name
    });
    
    // Generar URL de imagen simulada (en producción, esto vendría de la API)
    const simulatedImageUrl = `https://picsum.photos/seed/${Date.now()}/800/800`;
    
    // Guardar datos para mostrar en modal
    generatedImageUrl.value = simulatedImageUrl;
    generatedPrompt.value = prompt.value;
    
    // Mostrar modal de resultado
    isGenerating.value = false;
    showResultModal.value = true;
  }, 4000);
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

const handleUpgrade = () => {
  showLimitModal.value = false;
  showUpgradeSlideout.value = false;
  router.push('/pricing');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center space-x-3 mb-4">
          <PhotoIcon class="h-12 w-12 text-primary animate-pulse" />
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-text-primary mb-4">
          {{ t('imageGenerator.title') }}
        </h1>
        <p class="text-text-secondary text-xl mb-6">
          {{ t('imageGenerator.subtitle') }}
        </p>
      </div>

      <!-- Main Input Card -->
      <div class="bg-background-card border border-white/10 rounded-2xl p-4 md:p-8 shadow-2xl backdrop-blur-sm mb-8">
        <!-- Upload de Imagen -->
        <div class="mb-8">
          <label class="block text-text-primary font-semibold mb-3 text-base md:text-lg">
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
        <div class="mb-8">
          <label class="block text-text-primary font-semibold mb-3 text-base md:text-lg">
            {{ t('imageGenerator.step2') }}
          </label>
          
          <!-- PROMPT -->
          <div class="mb-4">
            <label class="block text-text-secondary font-medium mb-2 text-sm">
              {{ t('imageGenerator.promptLabel') }}
              <span class="text-accent-crimson">{{ t('imageGenerator.promptRequired') }}</span>
            </label>
            <textarea
              v-model="prompt"
              :placeholder="t('imageGenerator.promptPlaceholder')"
              rows="4"
              class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            ></textarea>
            <p class="text-text-tertiary text-sm mt-2">
              {{ t('imageGenerator.promptTip') }}
            </p>
          </div>
          
          <!-- NEGATIVE PROMPT -->
          <div>
            <label class="block text-text-secondary font-medium mb-2 text-sm">
              {{ t('imageGenerator.negativePromptLabel') }}
            </label>
            <textarea
              v-model="negativePrompt"
              :placeholder="t('imageGenerator.negativePromptPlaceholder')"
              rows="3"
              class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            ></textarea>
            <p class="text-text-tertiary text-sm mt-2">
              {{ t('imageGenerator.negativePromptTip') }}
            </p>
          </div>
        </div>

        <!-- Opciones Avanzadas (PREMIUM ONLY) -->
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
              <!-- Género del Personaje -->
              <div>
                <label class="block text-text-secondary font-medium mb-3 text-sm">
                  {{ t('create.advancedOptions.genderLabel') }}
                </label>
                
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="selectedGender = selectedGender === 'female' ? '' : 'female'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-4 px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedGender === 'female'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-white/10 bg-background-elevated hover:border-primary/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-2xl mb-1 md:mb-0">👩</span>
                    <span class="text-text-primary font-medium text-sm md:text-base">{{ t('create.advancedOptions.female') }}</span>
                  </button>
                  <button
                    @click="selectedGender = selectedGender === 'male' ? '' : 'male'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-4 px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedGender === 'male'
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                        : 'border-white/10 bg-background-elevated hover:border-primary/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-2xl mb-1 md:mb-0">👨</span>
                    <span class="text-text-primary font-medium text-sm md:text-base">{{ t('create.advancedOptions.male') }}</span>
                  </button>
                </div>
              </div>

              <!-- Tipo de Cuerpo -->
              <div>
                <label class="block text-text-secondary font-medium mb-3 text-sm">
                  {{ t('create.advancedOptions.bodyTypeLabel') }}
                </label>
                
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="selectedBodyType = selectedBodyType === 'female' ? '' : 'female'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-4 px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedBodyType === 'female'
                        ? 'border-accent-teal bg-accent-teal/10 shadow-lg shadow-accent-teal/20'
                        : 'border-white/10 bg-background-elevated hover:border-accent-teal/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-2xl mb-1 md:mb-0">💃</span>
                    <span class="text-text-primary font-medium text-sm md:text-base">{{ t('create.advancedOptions.femaleBody') }}</span>
                  </button>
                  <button
                    @click="selectedBodyType = selectedBodyType === 'male' ? '' : 'male'"
                    :class="[
                      'flex flex-col md:flex-row items-center justify-center md:space-x-2 py-4 px-3 md:px-6 rounded-xl border-2 transition-all duration-300',
                      selectedBodyType === 'male'
                        ? 'border-accent-teal bg-accent-teal/10 shadow-lg shadow-accent-teal/20'
                        : 'border-white/10 bg-background-elevated hover:border-accent-teal/50 hover:bg-background-elevated/80'
                    ]"
                  >
                    <span class="text-2xl mb-1 md:mb-0">💪</span>
                    <span class="text-text-primary font-medium text-sm md:text-base">{{ t('create.advancedOptions.maleBody') }}</span>
                  </button>
                </div>
              </div>

              <!-- Pose del Personaje -->
              <div>
                <label class="block text-text-secondary font-medium mb-2 text-sm">
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
                      class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-background-elevated/50 transition-all cursor-pointer group"
                    >
                      <PhotoIcon class="h-12 w-12 text-text-tertiary group-hover:text-primary transition-colors mb-2" />
                      <span class="text-text-primary font-medium mb-1">{{ t('create.advancedOptions.poseUpload') }}</span>
                      <span class="text-text-tertiary text-sm">{{ t('create.advancedOptions.poseMaxSize') }}</span>
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
                
                <p class="text-text-tertiary text-sm mt-2">
                  💡 {{ t('create.advancedOptions.poseDescription') }}
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
            <span>{{ t('imageGenerator.generating') }}</span>
          </template>
          <template v-else>
            <PhotoIcon class="h-6 w-6" />
            <span>{{ t('imageGenerator.generateButton') }}</span>
          </template>
        </button>

        <p v-if="!canGenerate && !isGenerating" class="text-text-tertiary text-sm mt-3 text-center">
          {{ !characterImage ? 'Sube una imagen para comenzar' : 'Escribe un prompt descriptivo' }}
        </p>
      </div>
    </div>

    <!-- Modal de imagen generada -->
    <Transition name="modal">
      <div v-if="showResultModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <div class="bg-gradient-to-br from-background-card via-background-elevated to-background-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border-2 border-primary/20 shadow-2xl shadow-primary/10">
          <!-- Botón cerrar -->
          <button
            @click="closeResultModal"
            class="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all hover:scale-110 group"
          >
            <XMarkIcon class="w-5 h-5 text-white group-hover:text-primary transition-colors" />
          </button>
          
          <!-- Contenido del modal -->
          <div class="p-8">
            <div class="text-center mb-6">
              <div class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-accent-crimson/20 rounded-full border border-primary/30 mb-2">
                <SparklesIcon class="w-6 h-6 text-primary animate-pulse" />
                <h2 class="text-2xl font-bold bg-gradient-to-r from-primary to-accent-crimson bg-clip-text text-transparent">
                  ¡Imagen Generada!
                </h2>
              </div>
              <p class="text-text-secondary text-sm mt-2">Tu creación está lista para descargar</p>
            </div>
            
            <!-- Imagen con marco elegante -->
            <div class="relative mb-6 rounded-2xl overflow-hidden border-4 border-white/5 shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-crimson/5"></div>
              <img 
                :src="generatedImageUrl" 
                :alt="generatedPrompt"
                class="w-full h-auto relative z-10"
              />
            </div>
            
            <!-- Prompt usado con diseño mejorado -->
            <div class="mb-6 p-5 bg-gradient-to-br from-background-elevated to-background-card rounded-xl border border-white/10 backdrop-blur-sm">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <p class="text-xs font-semibold text-primary uppercase tracking-wider">Prompt usado</p>
              </div>
              <p class="text-sm text-text-primary leading-relaxed">{{ generatedPrompt }}</p>
            </div>
            
            <!-- Botón de descarga mejorado -->
            <button
              @click="downloadImage"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary via-primary-light to-accent-crimson hover:from-primary-light hover:via-accent-crimson hover:to-primary text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 group"
            >
              <ArrowDownTrayIcon class="w-6 h-6 group-hover:animate-bounce" />
              Descargar Imagen
            </button>
            
            <div class="text-center mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border-2 border-amber-500/30">
              <p class="text-sm font-semibold text-amber-400 flex items-center justify-center gap-2 mb-1">
                <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                ¡No olvides descargar tu imagen!
              </p>
              <p class="text-xs text-text-secondary">
                La imagen solo estará disponible en esta ventana. Descárgala ahora para conservarla.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modals -->
    <ImageLimitModal 
      :show="showLimitModal" 
      @close="showLimitModal = false"
      @upgrade="handleUpgrade"
    />
    
    <UpgradeSlideout
      :show="showUpgradeSlideout"
      trigger="feature"
      @close="showUpgradeSlideout = false"
      @upgrade="handleUpgrade"
    />
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
