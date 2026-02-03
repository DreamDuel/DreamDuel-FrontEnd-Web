<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { SparklesIcon, PhotoIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const prompt = ref('');
const isGenerating = ref(false);
const showRegisterPrompt = ref(false);
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref<string>('');
const generatedImageUrl = ref<string>('');

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
            Iniciar Sesión
          </button>
          <button
            @click="goToRegister"
            class="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all"
          >
            Registrarse Gratis
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
            Transforma tu Foto con IA
          </h1>
          <p class="text-text-secondary text-xl mb-6">
            Sube una foto y describe qué quieres hacer con ella. ¡Prueba gratis sin registro!
          </p>
          <div class="flex items-center justify-center space-x-6 text-sm text-text-tertiary">
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>Sin tarjeta</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>Instantáneo</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-accent-teal">✓</span>
              <span>100% gratis</span>
            </div>
          </div>
        </div>

        <!-- Formulario de Creación -->
        <div class="bg-background-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm mb-8">
          <!-- Upload de Imagen -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-lg">
              1. Sube una foto de una persona
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
                <span class="text-text-primary font-medium mb-1">Haz click para subir una imagen</span>
                <span class="text-text-tertiary text-sm">PNG, JPG (máx. 5MB)</span>
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

          <!-- Prompt Input -->
          <div class="mb-8">
            <label class="block text-text-primary font-semibold mb-3 text-lg">
              2. ¿Qué quieres hacer con esta persona?
            </label>
            <textarea
              v-model="prompt"
              placeholder="Ej: Ponla en un traje espacial flotando en el espacio, rodeada de estrellas y planetas...

Ej: Conviértela en un superhéroe con capa roja volando sobre la ciudad...

Ej: Hazla aparecer en una playa paradisíaca al atardecer con palmeras..."
              rows="5"
              class="w-full px-5 py-4 bg-background-elevated border border-white/10 rounded-xl text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
            ></textarea>
            <p class="text-text-tertiary text-sm mt-2">
              💡 Describe el escenario, ropa, acción, ambiente, etc.
            </p>
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
              <span>CREANDO TU IMAGEN...</span>
            </template>
            <template v-else>
              <SparklesIcon class="h-6 w-6" />
              <span>GENERAR IMAGEN GRATIS</span>
            </template>
          </button>

          <p v-if="!canGenerate && !isGenerating" class="text-text-tertiary text-sm mt-3 text-center">
            {{ !characterImage ? '⚠️ Sube una foto para continuar' : '⚠️ Describe qué quieres hacer con la foto' }}
          </p>
        </div>

        <!-- Beneficios de registrarse -->
        <div class="bg-gradient-to-r from-primary/10 to-accent-teal/10 rounded-xl p-6 border border-primary/20">
          <h3 class="font-bold text-text-primary mb-4 text-center">
            ✨ Regístrate y obtén:
          </h3>
          <div class="grid md:grid-cols-3 gap-4 text-sm">
            <div class="text-center">
              <div class="text-2xl mb-2">🎁</div>
              <div class="text-text-primary font-semibold">3 Imágenes Gratis</div>
              <div class="text-text-tertiary">Pack de bienvenida</div>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">💾</div>
              <div class="text-text-primary font-semibold">Guardar Creaciones</div>
              <div class="text-text-tertiary">Acceso desde cualquier lugar</div>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">👥</div>
              <div class="text-text-primary font-semibold">Invita Amigos</div>
              <div class="text-text-tertiary">+3 créditos por invitación</div>
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
                ¡Tu imagen está lista!
              </h2>
              <p class="text-text-secondary">
                Regístrate gratis para guardarla y crear más imágenes increíbles
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
                <span>Registrarse Gratis</span>
                <ArrowRightIcon class="h-5 w-5" />
              </button>
              
              <button
                @click="skipToLogin"
                class="w-full px-6 py-3 bg-background-elevated hover:bg-background-card text-text-primary rounded-xl font-semibold transition-colors"
              >
                Ya tengo cuenta
              </button>
            </div>

            <p class="text-xs text-text-tertiary mt-4 text-center">
              Sin tarjeta requerida • Cancela cuando quieras
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
</style>
