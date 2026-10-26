<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { PhotoIcon, XMarkIcon, ArrowDownTrayIcon, SparklesIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/solid';
import { GenerationError, uploadReferenceImage, generateImage as requestImage, downloadImage as requestDownload } from '@/services/generationService';
import { openGumroadCheckout } from '@/utils/gumroad';
import { getSessionId } from '@/utils/session';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const LICENSE_KEY_STORAGE = 'gumroad_license_key';

const { t } = useI18n();
const route = useRoute();

const prompt = ref('');
const negativePrompt = ref('');
const isGenerating = ref(false);
const error = ref('');
const licenseKey = ref(localStorage.getItem(LICENSE_KEY_STORAGE) || '');
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref('');
const generatedImageUrl = ref('');
const generatedPrompt = ref('');
const showResultModal = ref(false);
const showHelpModal = ref(false);

// Cargar prompt desde query params si viene desde otra vista
onMounted(() => {
  if (typeof route.query.prompt === 'string') {
    prompt.value = route.query.prompt;
  }
});

watch(licenseKey, (newVal) => {
  localStorage.setItem(LICENSE_KEY_STORAGE, newVal);
});

const toErrorMessage = (err: unknown) => {
  if (err instanceof GenerationError) {
    if (err.code === 'license') return t('imageGenerator.errors.license');
    return err.detail || t(`imageGenerator.errors.${err.code}`);
  }
  return t('imageGenerator.errors.generate');
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    error.value = t('imageGenerator.errors.invalidFile');
    return;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    error.value = t('imageGenerator.errors.fileTooLarge');
    return;
  }

  characterImage.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      imagePreviewUrl.value = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  characterImage.value = null;
  imagePreviewUrl.value = '';
};

const canGenerate = computed(() => prompt.value.trim().length > 5 && !isGenerating.value);

const generateImage = async () => {
  if (!licenseKey.value.trim()) {
    error.value = t('imageGenerator.errors.licenseRequired');
    return;
  }
  if (!canGenerate.value) return;

  isGenerating.value = true;
  error.value = '';

  try {
    const characterImageUrl = characterImage.value
      ? await uploadReferenceImage(characterImage.value)
      : undefined;

    generatedImageUrl.value = await requestImage({
      prompt: prompt.value,
      negativePrompt: negativePrompt.value,
      sessionId: getSessionId(),
      licenseKey: licenseKey.value.trim(),
      characterImageUrl
    });
    generatedPrompt.value = prompt.value;
    showResultModal.value = true;
  } catch (err) {
    error.value = toErrorMessage(err);
  } finally {
    isGenerating.value = false;
  }
};

const downloadImage = async () => {
  if (!generatedImageUrl.value) return;
  try {
    await requestDownload(generatedImageUrl.value);
  } catch (err) {
    error.value = toErrorMessage(err);
  }
};

const closeResultModal = () => {
  showResultModal.value = false;
  generatedImageUrl.value = '';
  generatedPrompt.value = '';
  prompt.value = '';
  negativePrompt.value = '';
  removeImage();
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep flex items-center justify-center px-3 sm:px-4 py-12 sm:py-20">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-12 flex flex-col items-center">
        <img src="/Logo.png" alt="DreamDuel Logo" class="h-24 sm:h-32 w-auto mb-4 drop-shadow-xl animate-fade-in" />
        <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-2 sm:mb-4 flex items-center justify-center gap-3">
          {{ t('imageGenerator.title') }}
        </h1>
        <p class="text-text-secondary text-sm sm:text-base md:text-xl mb-4 sm:mb-6">
          {{ t('imageGenerator.subtitle') }}
        </p>
      </div>

      <!-- Main Input Card -->
      <div class="bg-background-card border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-8 shadow-2xl backdrop-blur-sm mb-6 sm:mb-8 relative mt-4">


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
              <span class="text-text-primary font-medium mb-1">{{ t('imageGenerator.uploadClick') }}</span>
              <span class="text-text-tertiary text-sm">{{ t('imageGenerator.maxSize') }}</span>
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

        <!-- Opciones de Generación -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-text-primary font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
            {{ t('imageGenerator.step2') }}
          </label>
          
          <!-- PROMPT -->
          <div class="mb-3 sm:mb-4">
            <label class="block text-text-secondary font-medium mb-2 text-xs sm:text-sm">
              {{ t('imageGenerator.promptLabel') }}
              <span class="text-accent-crimson">{{ t('imageGenerator.promptRequired') }}</span>
              <span class="ml-2 text-accent-crimson text-[10px] sm:text-xs font-bold bg-accent-crimson/10 border border-accent-crimson/30 px-1.5 py-0.5 rounded whitespace-nowrap">{{ t('imageGenerator.promptWarning') }}</span>
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
              <span class="ml-2 text-accent-crimson text-[10px] sm:text-xs font-bold bg-accent-crimson/10 border border-accent-crimson/30 px-1.5 py-0.5 rounded whitespace-nowrap">{{ t('imageGenerator.negativePromptWarning') }}</span>
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

        <!-- License Key Input -->
        <div class="mb-6 sm:mb-8 p-4 bg-background-elevated rounded-xl border border-white/5">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
            <label class="block text-text-primary font-semibold text-sm sm:text-base md:text-lg flex items-center gap-2">
              {{ t('imageGenerator.licenseTitle') }}
            </label>
            <button 
              type="button"
              @click="openGumroadCheckout"
              class="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
            >
              {{ t('imageGenerator.licenseButton') }}
            </button>
          </div>
          <div class="mb-1">
            <input
              type="text"
              v-model="licenseKey"
              :placeholder="t('imageGenerator.licensePlaceholder')"
              class="w-full px-3 py-2 sm:px-4 sm:py-3 bg-background-deep border border-white/10 rounded-xl text-text-primary text-sm placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all"
            />
          </div>
        </div>


        <!-- Generate Button -->
        <button
          type="button"
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

        <!-- Credit Refund Notice -->
        <p class="mt-3 text-center text-xs sm:text-sm text-text-secondary flex items-center justify-center gap-1.5">
          <span>{{ t('imageGenerator.creditRefundNotice') }}</span>
        </p>

        <!-- Help Button -->
        <div class="flex justify-center mt-3 mb-1">
          <button 
            @click="showHelpModal = true" 
            class="px-5 py-2 bg-gradient-to-r from-primary to-accent-teal hover:from-primary-light hover:to-primary text-white font-bold rounded-lg shadow-lg hover:shadow-primary/30 transition-all text-xs sm:text-sm flex items-center gap-1.5"
          >
            <QuestionMarkCircleIcon class="w-4 h-4 sm:w-5 sm:h-5" />
            {{ t('imageGenerator.helpButton') }}
          </button>
        </div>
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
                  {{ t('imageGenerator.resultModal.title') }}
                </h2>
              </div>
              <p class="text-text-secondary text-xs sm:text-sm mt-1 sm:mt-2">{{ t('imageGenerator.resultModal.subtitle') }}</p>
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
                <p class="text-xs font-semibold text-primary uppercase tracking-wider">{{ t('imageGenerator.resultModal.promptUsed') }}</p>
              </div>
              <p class="text-sm text-text-primary leading-relaxed">{{ generatedPrompt }}</p>
            </div>
            
            <!-- Botón de descarga mejorado -->
            <button
              @click="downloadImage"
              class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary via-primary-light to-accent-crimson hover:from-primary-light hover:via-accent-crimson hover:to-primary text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 active:scale-95 group"
            >
              <ArrowDownTrayIcon class="w-6 h-6 group-hover:animate-bounce" />
              {{ t('imageGenerator.resultModal.downloadButton') }}
            </button>
            
            <div class="text-center mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border-2 border-amber-500/30">
              <p class="text-sm font-semibold text-amber-400 flex items-center justify-center gap-2 mb-1">
                <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ t('imageGenerator.resultModal.warningTitle') }}
              </p>
              <p class="text-xs text-text-secondary">
                {{ t('imageGenerator.resultModal.warningText') }}
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
          <h3 class="text-xl font-bold text-error mb-4">⚠️ {{ t('common.error') }}</h3>
          <p class="text-text-secondary mb-6">{{ error }}</p>
          <button @click="error = ''" class="w-full px-6 py-3 bg-error hover:bg-error/80 text-white font-semibold rounded-xl transition-colors">{{ t('common.close') }}</button>
        </div>
      </div>
    </Transition>

    <!-- Modal de Ayuda -->
    <Transition name="modal">
      <div v-if="showHelpModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" @click="showHelpModal = false">
        <div class="bg-gradient-to-br from-background-card to-background-deep rounded-2xl p-6 max-w-md w-full border border-primary/20 shadow-2xl relative" @click.stop>
          <button @click="showHelpModal = false" class="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
            <XMarkIcon class="w-5 h-5 text-white" />
          </button>
          <h2 class="text-xl font-bold bg-gradient-to-r from-primary to-accent-teal text-transparent bg-clip-text mb-6">
            {{ t('imageGenerator.helpModalTitle') }}
          </h2>
          <div class="space-y-4 text-text-secondary text-sm">
            <p>{{ t('imageGenerator.helpStep1') }}</p>
            <p>{{ t('imageGenerator.helpStep2') }}</p>
            <p>{{ t('imageGenerator.helpStep3') }}</p>
            <p>{{ t('imageGenerator.helpStep4') }}</p>
            <p>{{ t('imageGenerator.helpStep5') }}</p>
          </div>
          <button @click="showHelpModal = false" class="mt-8 w-full py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-xl transition-colors">
            ✓ {{ t('imageGenerator.helpModalClose') }}
          </button>
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
