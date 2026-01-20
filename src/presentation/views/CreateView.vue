<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SparklesIcon, PhotoIcon, XMarkIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const prompt = ref('');
const selectedStyle = ref<string | null>(null);
const selectedGenre = ref<string | null>(null);
const isGenerating = ref(false);
const characterImages = ref<File[]>([]);
const imagePreviewUrls = ref<string[]>([]);
const isDragging = ref(false);

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

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert(`${file.name} no es una imagen válida`);
      return false;
    }
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`${file.name} es muy grande. Máximo 5MB`);
      return false;
    }
    return true;
  });

  // Limitar a 4 imágenes máximo
  const totalImages = characterImages.value.length + validFiles.length;
  if (totalImages > 4) {
    alert('Máximo 4 imágenes de personajes');
    return;
  }

  validFiles.forEach(file => {
    characterImages.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrls.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index: number) => {
  characterImages.value.splice(index, 1);
  imagePreviewUrls.value.splice(index, 1);
};

const canGenerate = computed(() => {
  return prompt.value.trim().length > 0 && !isGenerating.value;
});

const generateStory = async () => {
  if (!canGenerate.value) return;
  
  isGenerating.value = true;
  
  // Simular generación de historia
  setTimeout(() => {
    console.log('Generating story with:', {
      prompt: prompt.value,
      style: selectedStyle.value,
      genre: selectedGenre.value,
      characterImages: characterImages.value.map(f => f.name)
    });
    
    // Navegar a pantalla de carga y luego a la historia
    router.push('/loading');
    
    // Simular finalización de generación
    setTimeout(() => {
      router.push('/story-viewer/1');
    }, 5000);
    
    isGenerating.value = false;
  }, 1000);
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
        <!-- Prompt Input -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            ¿Cuál es tu fantasía hoy?
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

        <!-- Character Images Upload -->
        <div class="mb-8">
          <label class="block text-text-secondary text-sm font-medium mb-3">
            Personajes (Opcional)
            <span class="text-text-tertiary text-xs ml-2">Sube hasta 4 fotos para personalizarlos</span>
          </label>
          
          <!-- Upload Zone -->
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            :class="[
              'relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer',
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-white/20 bg-background-elevated hover:border-primary/50'
            ]"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              @change="handleFileSelect"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              :disabled="characterImages.length >= 4"
            />
            
            <div class="text-center pointer-events-none">
              <PhotoIcon class="h-12 w-12 text-primary mx-auto mb-3" />
              <p class="text-text-secondary mb-1">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p class="text-text-tertiary text-sm">
                PNG, JPG hasta 5MB · Máximo 4 personajes
              </p>
            </div>
          </div>

          <!-- Image Previews -->
          <div v-if="imagePreviewUrls.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div
              v-for="(url, index) in imagePreviewUrls"
              :key="index"
              class="relative group aspect-square rounded-xl overflow-hidden border border-white/10"
            >
              <img
                :src="url"
                :alt="`Personaje ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <button
                @click="removeImage(index)"
                class="absolute top-2 right-2 p-1.5 bg-background-deep/80 backdrop-blur-sm rounded-full text-text-secondary hover:text-accent-crimson hover:bg-accent-crimson/20 transition-all opacity-0 group-hover:opacity-100"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p class="text-white text-xs font-medium truncate">
                  {{ characterImages[index]?.name }}
                </p>
              </div>
            </div>
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
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  </div>
</template>
