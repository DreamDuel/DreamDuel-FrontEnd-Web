<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useStoryStore } from '@/stores/storyStore';
import { useI18n } from 'vue-i18n';
import { SparklesIcon, PhotoIcon, XMarkIcon, UserIcon } from '@heroicons/vue/24/solid';
import ImageLimitModal from '@/presentation/components/ImageLimitModal.vue';
import UpgradeSlideout from '@/presentation/components/UpgradeSlideout.vue';

interface Character {
  id: string;
  name: string;
  description: string;
  imageFile: File;
  imagePreview: string;
}

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const storyStore = useStoryStore();
const title = ref('');
const prompt = ref('');
const isPublic = ref(true);
const selectedStyle = ref<string | null>(null);
const selectedGenre = ref<string | null>(null);
const isGenerating = ref(false);
const characters = ref<Character[]>([]);
const showLimitModal = ref(false);
const showUpgradeSlideout = ref(false);
const poseImage = ref<File | null>(null);
const posePreviewUrl = ref<string>('');
const showAdvancedOptions = ref(false);
const selectedGender = ref<string>('');
const selectedBodyType = ref<string>('');

// Límites de personajes según plan
const maxCharacters = computed(() => {
  return userStore.currentUser?.isPremium ? 10 : 2;
});

const canAddMoreCharacters = computed(() => {
  return characters.value.length < maxCharacters.value;
});

const styles = [
  { id: 'anime', name: computed(() => t('create.style.anime')), emoji: '🎌' },
  { id: 'realistic', name: computed(() => t('create.style.realistic')), emoji: '📸' },
  { id: 'noir', name: computed(() => t('create.style.noir')), emoji: '🎬' },
  { id: 'watercolor', name: computed(() => t('create.style.watercolor')), emoji: '🎨' },
  { id: 'comic', name: computed(() => t('create.style.comic')), emoji: '💥' },
  { id: 'fantasy', name: computed(() => t('create.style.fantasy')), emoji: '🔮' }
];

const genres = [
  { id: 'romance', name: computed(() => t('create.genre.romance')), emoji: '💕' },
  { id: 'action', name: computed(() => t('create.genre.action')), emoji: '⚔️' },
  { id: 'mystery', name: computed(() => t('create.genre.mystery')), emoji: '🔍' },
  { id: 'scifi', name: computed(() => t('create.genre.scifi')), emoji: '🚀' },
  { id: 'horror', name: computed(() => t('create.genre.horror')), emoji: '👻' },
  { id: 'fantasy', name: computed(() => t('create.genre.fantasy')), emoji: '🧙' }
];

const toggleStyle = (styleId: string) => {
  selectedStyle.value = selectedStyle.value === styleId ? null : styleId;
};

const toggleGenre = (genreId: string) => {
  selectedGenre.value = selectedGenre.value === genreId ? null : genreId;
};

const handleCharacterFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    addCharacter(target.files[0]);
    target.value = ''; // Reset input
  }
};

const addCharacter = (file: File) => {
  // Verificar límite
  if (!canAddMoreCharacters.value) {
    if (userStore.currentUser?.isPremium) {
      alert(t('create.characters.premiumLimitDesc'));
    } else {
      alert(t('create.characters.limitDesc'));
      showUpgradeSlideout.value = true;
    }
    return;
  }

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

  // Crear preview
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      const newCharacter: Character = {
        id: `char-${Date.now()}-${Math.random()}`,
        name: '',
        description: '',
        imageFile: file,
        imagePreview: e.target.result as string
      };
      characters.value.push(newCharacter);
    }
  };
  reader.readAsDataURL(file);
};

const updateCharacterName = (characterId: string, name: string) => {
  const character = characters.value.find(c => c.id === characterId);
  if (character) {
    character.name = name;
  }
};

const updateCharacterDescription = (characterId: string, description: string) => {
  const character = characters.value.find(c => c.id === characterId);
  if (character) {
    character.description = description;
  }
};

const removeCharacter = (characterId: string) => {
  const index = characters.value.findIndex(c => c.id === characterId);
  if (index > -1) {
    characters.value.splice(index, 1);
  }
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
  return title.value.trim().length > 3 &&
         prompt.value.trim().length > 10 && 
         selectedStyle.value !== null && 
         selectedGenre.value !== null &&
         !isGenerating.value;
});

const generateStory = async () => {
  if (!canGenerate.value) return;
  
  // Verificar si el usuario puede generar imágenes
  if (!userStore.canGenerateImage()) {
    showLimitModal.value = true;
    return;
  }
  
  isGenerating.value = true;
  
  // Usar un crédito de imagen si no es premium
  if (!userStore.currentUser?.isPremium) {
    userStore.useImageCredit();
  }
  
  // Rastrear la generación para PQL
  userStore.trackGeneration();
  
  // Navegar a pantalla de carga inmediatamente
  router.push('/loading');
  
  // Crear historia usando storyStore
  setTimeout(async () => {
    console.log('Generating story with:', {
      title: title.value,
      prompt: prompt.value,
      style: selectedStyle.value,
      genre: selectedGenre.value,
      isPublic: isPublic.value,
      characters: characters.value.map(c => ({ 
        name: c.name, 
        description: c.description,
        image: c.imageFile.name 
      }))
    });
    
    // Crear la historia en el storyStore
    const tags = [];
    if (selectedStyle.value) tags.push(selectedStyle.value);
    if (selectedGenre.value) tags.push(selectedGenre.value);
    
    const newStory = await storyStore.createStory({
      title: title.value,
      prompt: prompt.value,
      tags,
      isPublic: isPublic.value,
      authorId: userStore.currentUser!.id,
      characterImages: characters.value.map(c => c.imageFile)
    });
    
    if (newStory && userStore.currentUser) {
      // Agregar al perfil del usuario
      userStore.addStoryToProfile(newStory.id);
      
      // Navegar a la historia creada
      setTimeout(() => {
        router.push(`/story-viewer/${newStory.id}`);
        isGenerating.value = false;
      }, 2000);
    } else {
      // Error en la creación
      router.push('/create');
      isGenerating.value = false;
    }
  }, 1000);
};

const handleUpgrade = () => {
  showLimitModal.value = false;
  showUpgradeSlideout.value = false;
  router.push('/pricing');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-3xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center space-x-3 mb-4">
          <SparklesIcon class="h-12 w-12 text-primary animate-pulse" />
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-text-primary mb-4">
          {{ t('create.title') }}
        </h1>
        <p class="text-xl text-text-secondary">
          {{ t('create.subtitle') }}
        </p>
      </div>

      <!-- Main Input Card -->
      <div class="bg-background-card rounded-2xl p-8 shadow-2xl shadow-primary/10 mb-8">
        <!-- Título -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            {{ t('create.titleLabel') }}
            <span class="text-accent-crimson">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            :placeholder="t('create.titlePlaceholder')"
            class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          />
        </div>

        <!-- Prompt Input -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            {{ t('create.prompt.label') }}
            <span class="text-accent-crimson">*</span>
          </label>
          <textarea
            v-model="prompt"
            :placeholder="t('create.prompt.placeholder')"
            rows="4"
            class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
          />
        </div>

        <!-- Style Selection -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            {{ t('create.style.label') }}
          </label>
          <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
            <button
              v-for="style in styles"
              :key="style.id"
              @click="toggleStyle(style.id)"
              :class="[
                'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300',
                selectedStyle === style.id
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-white/10 bg-background-elevated hover:border-primary/50 hover:bg-background-elevated/80'
              ]"
            >
              <span class="text-3xl mb-2">{{ style.emoji }}</span>
              <span class="text-xs text-text-secondary font-medium">{{ style.name.value }}</span>
            </button>
          </div>
        </div>

        <!-- Genre Selection -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            {{ t('create.genre.label') }}
          </label>
          <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
            <button
              v-for="genre in genres"
              :key="genre.id"
              @click="toggleGenre(genre.id)"
              :class="[
                'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300',
                selectedGenre === genre.id
                  ? 'border-accent-teal bg-accent-teal/10 shadow-lg shadow-accent-teal/20'
                  : 'border-white/10 bg-background-elevated hover:border-accent-teal/50 hover:bg-background-elevated/80'
              ]"
            >
              <span class="text-3xl mb-2">{{ genre.emoji }}</span>
              <span class="text-xs text-text-secondary font-medium">{{ genre.name.value }}</span>
            </button>
          </div>
        </div>

        <!-- Personajes con Nombres y Límites -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-text-secondary text-sm font-medium">
              {{ t('create.characters.label') }} ({{ t('create.characters.optional') }})
              <span class="text-text-tertiary text-xs ml-2">{{ t('create.characters.subtitle') }}</span>
            </label>
            <div class="text-xs">
              <span :class="characters.length >= maxCharacters ? 'text-accent-crimson' : 'text-text-tertiary'">
                {{ characters.length }}/{{ maxCharacters }}
              </span>
              <span v-if="!userStore.currentUser?.isPremium" class="ml-2 px-2 py-1 bg-accent-gold/20 text-accent-gold rounded text-xs">
                {{ t('create.characters.freePlan') }}
              </span>
              <span v-else class="ml-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                {{ t('create.characters.premiumPlan') }}
              </span>
            </div>
          </div>

          <!-- Lista de Personajes -->
          <div class="space-y-3 mb-4">
            <div
              v-for="character in characters"
              :key="character.id"
              class="flex items-start space-x-3 bg-background-elevated border border-white/10 rounded-xl p-3 group hover:border-primary/30 transition-all"
            >
              <!-- Imagen del personaje -->
              <div class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-white/10">
                <img :src="character.imagePreview" alt="Character" class="w-full h-full object-cover" />
              </div>

              <!-- Campos de nombre y descripción -->
              <div class="flex-1 space-y-2">
                <input
                  type="text"
                  :value="character.name"
                  @input="(e) => updateCharacterName(character.id, (e.target as HTMLInputElement).value)"
                  :placeholder="t('create.characters.namePlaceholder')"
                  class="w-full px-3 py-2 bg-background-deep border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <textarea
                  :value="character.description"
                  @input="(e) => updateCharacterDescription(character.id, (e.target as HTMLTextAreaElement).value)"
                  :placeholder="t('create.characters.descriptionPlaceholder')"
                  rows="2"
                  class="w-full px-3 py-2 bg-background-deep border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none text-sm"
                />
                <p class="text-text-tertiary text-xs">
                  <UserIcon class="inline h-3 w-3 mr-1" />
                  {{ character.imageFile.name }}
                </p>
              </div>

              <!-- Botón eliminar -->
              <button
                @click="removeCharacter(character.id)"
                class="p-2 text-text-secondary hover:text-accent-crimson hover:bg-accent-crimson/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Botón Agregar Personaje -->
          <div v-if="canAddMoreCharacters" class="relative">
            <input
              type="file"
              accept="image/*"
              @change="handleCharacterFileSelect"
              class="hidden"
              id="addCharacterInput"
            />
            <label
              for="addCharacterInput"
              class="flex items-center justify-center space-x-2 w-full py-4 border-2 border-dashed border-white/20 rounded-xl bg-background-elevated hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
            >
              <PhotoIcon class="h-5 w-5 text-primary" />
              <span class="text-text-primary font-medium">{{ t('create.characters.addCharacter') }}</span>
            </label>
          </div>

          <!-- Mensaje cuando alcanza el límite FREE -->
          <div v-else-if="!userStore.currentUser?.isPremium" class="p-4 bg-gradient-to-r from-accent-gold/10 to-accent-crimson/10 border border-accent-gold/20 rounded-xl">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 text-2xl">⚡</div>
              <div class="flex-1">
                <h4 class="font-semibold text-text-primary mb-1">
                  {{ t('create.characters.limitReached') }}
                </h4>
                <p class="text-text-secondary text-sm mb-3">
                  {{ t('create.characters.limitDesc') }}
                </p>
                <button
                  @click="showUpgradeSlideout = true"
                  class="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-sm font-semibold transition-all"
                >
                  {{ t('create.characters.upgradeToPremium') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Mensaje cuando alcanza el límite PREMIUM -->
          <div v-else class="text-center text-text-tertiary text-sm py-2">
            {{ t('create.characters.premiumLimitDesc') }}
          </div>
        </div>

        <!-- Opciones Avanzadas -->
        <div class="mb-8">
          <button
            @click="showAdvancedOptions = !showAdvancedOptions"
            class="flex items-center justify-between w-full text-left text-text-primary font-semibold mb-3 text-lg hover:text-primary transition-colors"
          >
            <span>⚙️ {{ t('create.advancedOptions.title') }}</span>
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
                  <span class="ml-2 text-text-tertiary text-xs">({{ t('create.characters.optional') }})</span>
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
                  <span class="ml-2 text-text-tertiary text-xs">({{ t('create.characters.optional') }})</span>
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
                  <span class="ml-2 text-text-tertiary text-xs">({{ t('create.characters.optional') }})</span>
                </label>
                
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
                
                <p class="text-text-tertiary text-sm mt-2">
                  💡 {{ t('create.advancedOptions.poseDescription') }}
                </p>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Privacidad -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            {{ t('create.visibility.label') }}
          </label>
          <div class="flex items-center space-x-4">
            <button
              @click="isPublic = true"
              :class="[
                'flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium',
                isPublic
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/10 bg-background-elevated text-text-secondary hover:border-primary/50'
              ]"
            >
              🌍 {{ t('create.visibility.public') }}
              <span class="block text-xs mt-1 opacity-70">{{ t('create.visibility.publicDesc') }}</span>
            </button>
            <button
              @click="isPublic = false"
              :class="[
                'flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium',
                !isPublic
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/10 bg-background-elevated text-text-secondary hover:border-primary/50'
              ]"
            >
              🔒 {{ t('create.visibility.private') }}
              <span class="block text-xs mt-1 opacity-70">{{ t('create.visibility.privateDesc') }}</span>
            </button>
          </div>
        </div>

        <!-- Generate Button -->
        <button
          @click="generateStory"
          :disabled="!canGenerate"
          :class="[
            'w-full py-5 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3',
            !canGenerate
              ? 'bg-background-elevated text-text-tertiary cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-95'
          ]"
        >
          <template v-if="isGenerating">
            <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ t('create.generating').toUpperCase() }}</span>
          </template>
          <template v-else>
            <SparklesIcon class="h-6 w-6" />
            <span>{{ t('create.generate').toUpperCase() }}</span>
          </template>
        </button>
      </div>

      <!-- Info Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-background-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">⚡</div>
          <div class="text-text-secondary text-sm">{{ t('create.features.instant') }}</div>
        </div>
        <div class="bg-background-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">🎨</div>
          <div class="text-text-secondary text-sm">{{ t('create.features.unique') }}</div>
        </div>
        <div class="bg-background-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">✨</div>
          <div class="text-text-secondary text-sm">{{ t('create.features.unlimited') }}</div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ImageLimitModal 
      :show="showLimitModal" 
      @close="showLimitModal = false"
      @upgrade="handleUpgrade"
    />
    
    <UpgradeSlideout
      :show="showUpgradeSlideout"
      trigger="limit"
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
</style>
