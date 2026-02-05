<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SparklesIcon, PhotoIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const { t } = useI18n();

const router = useRouter();
const prompt = ref('');
const manualPrompt = ref(''); // Texto que el usuario escribe manualmente
const isGenerating = ref(false);
const showRegisterPrompt = ref(false);
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref<string>('');
const generatedImageUrl = ref<string>('');

// Opciones de personalización física (solo del cuerpo - cuello para abajo)
const selectedBodyType = ref('');
const selectedClothing = ref('');
const selectedPose = ref('');
const selectedMuscle = ref('');
const selectedHeight = ref('');

// Catálogo de opciones físicas del cuerpo (las traducciones se obtienen dinámicamente)
const bodyTypeOptions = computed(() => [
  { value: 'atletico', label: t('guest.bodyTypes.athletic'), description: 'athletic and toned body' },
  { value: 'delgado', label: t('guest.bodyTypes.slim'), description: 'slim and slender body' },
  { value: 'promedio', label: t('guest.bodyTypes.average'), description: 'average build body' },
  { value: 'robusto', label: t('guest.bodyTypes.robust'), description: 'robust and strong body' },
  { value: 'curvilíneo', label: t('guest.bodyTypes.curvy'), description: 'body with defined curves' },
  { value: 'musculoso', label: t('guest.bodyTypes.muscular'), description: 'very muscular and defined body' },
]);

const muscleOptions = computed(() => [
  { value: 'definido', label: t('guest.muscles.defined'), description: 'very defined and marked muscles' },
  { value: 'tonificado', label: t('guest.muscles.toned'), description: 'toned muscles' },
  { value: 'normal', label: t('guest.muscles.normal'), description: 'normal muscle tone' },
]);

const heightOptions = computed(() => [
  { value: 'alto', label: t('guest.heights.tall'), description: 'tall height' },
  { value: 'promedio', label: t('guest.heights.average'), description: 'average height' },
  { value: 'bajo', label: t('guest.heights.short'), description: 'short height' },
]);

const clothingOptions = computed(() => [
  { value: 'deportivo', label: t('guest.clothing.sport'), description: 'wearing sportswear' },
  { value: 'casual', label: t('guest.clothing.casual'), description: 'wearing modern casual clothes' },
  { value: 'formal', label: t('guest.clothing.formal'), description: 'wearing elegant formal attire' },
  { value: 'traje_baño', label: t('guest.clothing.swimsuit'), description: 'wearing swimsuit' },
  { value: 'superheroe', label: t('guest.clothing.superhero'), description: 'wearing superhero suit' },
  { value: 'elegante', label: t('guest.clothing.elegant'), description: 'wearing gala attire' },
  { value: 'streetwear', label: t('guest.clothing.streetwear'), description: 'wearing urban streetwear' },
]);

const poseOptions = computed(() => [
  { value: 'parado', label: t('guest.poses.standing'), description: 'standing in natural pose' },
  { value: 'sentado', label: t('guest.poses.sitting'), description: 'sitting on a chair' },
  { value: 'echado', label: t('guest.poses.lying'), description: 'lying down' },
  { value: 'selfie', label: t('guest.poses.selfie'), description: 'taking a selfie' },
  { value: 'corriendo', label: t('guest.poses.running'), description: 'running in action' },
  { value: 'saltando', label: t('guest.poses.jumping'), description: 'jumping in the air' },
  { value: 'pose_poder', label: t('guest.poses.powerPose'), description: 'in heroic power pose' },
  { value: 'brazos_cruzados', label: t('guest.poses.crossedArms'), description: 'with crossed arms' },
  { value: 'meditando', label: t('guest.poses.meditating'), description: 'in meditation position' },
  { value: 'bailando', label: t('guest.poses.dancing'), description: 'dancing with energy' },
]);

// Construir prompt automático basado en selecciones
const selectedTags = computed(() => {
  const tags: Array<{key: string, label: string, description: string}> = [];
  
  if (selectedBodyType.value) {
    const option = bodyTypeOptions.value.find(o => o.value === selectedBodyType.value);
    if (option) tags.push({key: 'body', label: option.label, description: option.description});
  }
  
  if (selectedMuscle.value) {
    const option = muscleOptions.value.find(o => o.value === selectedMuscle.value);
    if (option) tags.push({key: 'muscle', label: option.label, description: option.description});
  }
  
  if (selectedHeight.value) {
    const option = heightOptions.value.find(o => o.value === selectedHeight.value);
    if (option) tags.push({key: 'height', label: option.label, description: option.description});
  }
  
  if (selectedClothing.value) {
    const option = clothingOptions.value.find(o => o.value === selectedClothing.value);
    if (option) tags.push({key: 'clothing', label: option.label, description: option.description});
  }
  
  if (selectedPose.value) {
    const option = poseOptions.value.find(o => o.value === selectedPose.value);
    if (option) tags.push({key: 'pose', label: option.label, description: option.description});
  }
  
  return tags;
});

const buildPromptFromSelections = () => {
  return selectedTags.value.map(tag => tag.description).join(', ');
};

const removeTag = (key: string) => {
  switch(key) {
    case 'body':
      selectedBodyType.value = '';
      break;
    case 'muscle':
      selectedMuscle.value = '';
      break;
    case 'height':
      selectedHeight.value = '';
      break;
    case 'clothing':
      selectedClothing.value = '';
      break;
    case 'pose':
      selectedPose.value = '';
      break;
  }
};

// Actualizar prompt cuando cambien las selecciones o el texto manual
watch([selectedBodyType, selectedMuscle, selectedHeight, selectedClothing, selectedPose, manualPrompt], () => {
  const autoPrompt = buildPromptFromSelections();
  const parts: string[] = [];
  
  if (autoPrompt) parts.push(autoPrompt);
  if (manualPrompt.value.trim()) parts.push(manualPrompt.value.trim());
  
  prompt.value = parts.join(', ');
});

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
          <div class="flex items-center justify-center space-x-6 text-sm text-text-tertiary">
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
        <div class="bg-background-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm mb-8">
          <!-- Upload de Imagen -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-lg">
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

          <!-- Opciones de Personalización Física del Cuerpo -->
          <div class="mb-8 space-y-6">
            <div class="text-center">
              <h3 class="text-text-primary font-semibold mb-2 text-lg">
                2. {{ t('guest.steps.customizePhysical') }}
              </h3>
              <p class="text-text-tertiary text-sm">
                {{ t('guest.steps.customizeDesc') }}
              </p>
            </div>

            <!-- Tipo de Cuerpo -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.physicalOptions.bodyType') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="option in bodyTypeOptions"
                  :key="option.value"
                  @click="selectedBodyType = selectedBodyType === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedBodyType === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Definición Muscular -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.physicalOptions.muscleDefinition') }}
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="option in muscleOptions"
                  :key="option.value"
                  @click="selectedMuscle = selectedMuscle === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedMuscle === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Estatura -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.physicalOptions.height') }}
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="option in heightOptions"
                  :key="option.value"
                  @click="selectedHeight = selectedHeight === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedHeight === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Vestimenta -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.physicalOptions.clothing') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="option in clothingOptions"
                  :key="option.value"
                  @click="selectedClothing = selectedClothing === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedClothing === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Pose/Acción -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                {{ t('guest.physicalOptions.poseAction') }}
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="option in poseOptions"
                  :key="option.value"
                  @click="selectedPose = selectedPose === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedPose === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Prompt Input -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-lg">
              3. {{ t('guest.steps.finalDescription') }}
            </label>
            
            <!-- Chips/Burbujas de opciones seleccionadas -->
            <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-3 p-3 bg-background-elevated/50 rounded-lg border border-white/10">
              <TransitionGroup name="tag">
                <div
                  v-for="tag in selectedTags"
                  :key="tag.key"
                  class="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary/20 border border-primary/40 rounded-full text-sm text-primary font-medium group hover:bg-primary/30 transition-all"
                >
                  <span>{{ tag.label }}</span>
                  <button
                    @click="removeTag(tag.key)"
                    class="ml-1 hover:bg-primary/40 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </div>
              </TransitionGroup>
            </div>
            
            <!-- Textarea para texto manual adicional -->
            <div class="mb-3">
              <textarea
                v-model="manualPrompt"
                :placeholder="t('guest.steps.additionalDetails')"
                rows="3"
                class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
              ></textarea>
              <p class="text-text-tertiary text-sm mt-2">
                💡 {{ t('guest.steps.additionalExample') }}
              </p>
            </div>
            
            <!-- Prompt final combinado (solo lectura) -->
            <div class="p-4 bg-background-deep/50 rounded-xl border border-white/10">
              <label class="block text-text-secondary text-xs font-medium mb-2">
                📝 {{ t('guest.steps.finalPrompt') }}
              </label>
              <p class="text-text-primary text-sm">
                {{ prompt || t('guest.steps.selectOrWrite') }}
              </p>
            </div>
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

/* Animaciones para los tags/chips */
.tag-enter-active,
.tag-leave-active {
  transition: all 0.3s ease;
}

.tag-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.tag-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.tag-move {
  transition: transform 0.3s ease;
}
</style>
