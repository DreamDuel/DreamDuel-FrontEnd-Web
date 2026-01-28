<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useStoryStore } from '@/stores/storyStore';
import { SparklesIcon, PhotoIcon, XMarkIcon, UserIcon } from '@heroicons/vue/24/solid';
import ImageLimitModal from '@/presentation/components/ImageLimitModal.vue';
import UpgradeSlideout from '@/presentation/components/UpgradeSlideout.vue';

interface Character {
  id: string;
  name: string;
  imageFile: File;
  imagePreview: string;
}

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

// Límites de personajes según plan
const maxCharacters = computed(() => {
  return userStore.currentUser?.isPremium ? 10 : 2;
});

const canAddMoreCharacters = computed(() => {
  return characters.value.length < maxCharacters.value;
});

const styles = [
  { id: 'anime', name: 'Anime', emoji: '🎌' },
  { id: 'realistic', name: 'Realista', emoji: '📸' },
  { id: 'noir', name: 'Noir', emoji: '🎬' },
  { id: 'watercolor', name: 'Acuarela', emoji: '🎨' },
  { id: 'comic', name: 'Cómic', emoji: '💥' },
  { id: 'fantasy', name: 'Fantasía', emoji: '🔮' }
];

const genres = [
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'action', name: 'Acción', emoji: '⚔️' },
  { id: 'mystery', name: 'Misterio', emoji: '🔍' },
  { id: 'scifi', name: 'Sci-Fi', emoji: '🚀' },
  { id: 'horror', name: 'Terror', emoji: '👻' },
  { id: 'fantasy', name: 'Fantasía', emoji: '🧙' }
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
      alert('Máximo 10 personajes por historia');
    } else {
      alert('Plan Free: máximo 2 personajes. Actualiza a Premium para hasta 10 personajes.');
      showUpgradeSlideout.value = true;
    }
    return;
  }

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

  // Crear preview
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      const newCharacter: Character = {
        id: `char-${Date.now()}-${Math.random()}`,
        name: '',
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

const removeCharacter = (characterId: string) => {
  const index = characters.value.findIndex(c => c.id === characterId);
  if (index > -1) {
    characters.value.splice(index, 1);
  }
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
      characters: characters.value.map(c => ({ name: c.name, image: c.imageFile.name }))
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
          Genera Tu Historia
        </h1>
        <p class="text-xl text-text-secondary">
          Describe tu sueño y la IA lo convertirá en una historia visual única
        </p>
      </div>

      <!-- Main Input Card -->
      <div class="bg-background-card rounded-2xl p-8 shadow-2xl shadow-primary/10 mb-8">
        <!-- Título -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            Título de tu historia
            <span class="text-accent-crimson">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="Ej: La Última Guardiana del Tiempo"
            class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          />
        </div>

        <!-- Prompt Input -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            ¿Cuál es tu fantasía hoy?
            <span class="text-accent-crimson">*</span>
          </label>
          <textarea
            v-model="prompt"
            placeholder="Ejemplo: Una guerrera espacial descubre un planeta olvidado donde la música controla la realidad..."
            rows="4"
            class="w-full px-4 py-3 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
          />
        </div>

        <!-- Style Selection -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            Estilo Visual
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
              <span class="text-xs text-text-secondary font-medium">{{ style.name }}</span>
            </button>
          </div>
        </div>

        <!-- Genre Selection -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            Género
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
              <span class="text-xs text-text-secondary font-medium">{{ genre.name }}</span>
            </button>
          </div>
        </div>

        <!-- Personajes con Nombres y Límites -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-text-secondary text-sm font-medium">
              Personajes (Opcional)
              <span class="text-text-tertiary text-xs ml-2">Añade fotos y nombres</span>
            </label>
            <div class="text-xs">
              <span :class="characters.length >= maxCharacters ? 'text-accent-crimson' : 'text-text-tertiary'">
                {{ characters.length }}/{{ maxCharacters }}
              </span>
              <span v-if="!userStore.currentUser?.isPremium" class="ml-2 px-2 py-1 bg-accent-gold/20 text-accent-gold rounded text-xs">
                Free: 2 max
              </span>
              <span v-else class="ml-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                Premium: 10 max
              </span>
            </div>
          </div>

          <!-- Lista de Personajes -->
          <div class="space-y-3 mb-4">
            <div
              v-for="character in characters"
              :key="character.id"
              class="flex items-center space-x-3 bg-background-elevated border border-white/10 rounded-xl p-3 group hover:border-primary/30 transition-all"
            >
              <!-- Imagen del personaje -->
              <div class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-white/10">
                <img :src="character.imagePreview" alt="Character" class="w-full h-full object-cover" />
              </div>

              <!-- Campo de nombre -->
              <div class="flex-1">
                <input
                  type="text"
                  :value="character.name"
                  @input="(e) => updateCharacterName(character.id, (e.target as HTMLInputElement).value)"
                  placeholder="Nombre del personaje (ej: María, Alex, Luna)"
                  class="w-full px-3 py-2 bg-background-deep border border-white/10 rounded-lg text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                />
                <p class="text-text-tertiary text-xs mt-1">
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
              <span class="text-text-primary font-medium">Agregar Personaje</span>
            </label>
          </div>

          <!-- Mensaje cuando alcanza el límite FREE -->
          <div v-else-if="!userStore.currentUser?.isPremium" class="p-4 bg-gradient-to-r from-accent-gold/10 to-accent-crimson/10 border border-accent-gold/20 rounded-xl">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 text-2xl">⚡</div>
              <div class="flex-1">
                <h4 class="font-semibold text-text-primary mb-1">
                  Límite alcanzado (Plan Free)
                </h4>
                <p class="text-text-secondary text-sm mb-3">
                  Has alcanzado el máximo de 2 personajes. Actualiza a Premium para usar hasta 10 personajes por historia.
                </p>
                <button
                  @click="showUpgradeSlideout = true"
                  class="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg text-sm font-semibold transition-all"
                >
                  Actualizar a Premium
                </button>
              </div>
            </div>
          </div>

          <!-- Mensaje cuando alcanza el límite PREMIUM -->
          <div v-else class="text-center text-text-tertiary text-sm py-2">
            Has alcanzado el máximo de 10 personajes por historia
          </div>
        </div>

        <!-- Privacidad -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            Visibilidad de la historia
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
              🌍 Pública
              <span class="block text-xs mt-1 opacity-70">Todos pueden verla</span>
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
              🔒 Privada
              <span class="block text-xs mt-1 opacity-70">Solo tú la verás</span>
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
            <span>GENERANDO MAGIA...</span>
          </template>
          <template v-else>
            <SparklesIcon class="h-6 w-6" />
            <span>MATERIALIZAR</span>
          </template>
        </button>
      </div>

      <!-- Info Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-background-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">⚡</div>
          <div class="text-text-secondary text-sm">Generación instantánea</div>
        </div>
        <div class="bg-background-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">🎨</div>
          <div class="text-text-secondary text-sm">100% única y personalizada</div>
        </div>
        <div class="bg-background-card/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-center">
          <div class="text-2xl mb-2">✨</div>
          <div class="text-text-secondary text-sm">Ilimitadas posibilidades</div>
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
