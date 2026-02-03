<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { SparklesIcon, PhotoIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const prompt = ref('');
const isGenerating = ref(false);
const showRegisterPrompt = ref(false);
const characterImage = ref<File | null>(null);
const imagePreviewUrl = ref<string>('');
const generatedImageUrl = ref<string>('');

// Opciones de personalización física
const selectedHairColor = ref('');
const selectedHairStyle = ref('');
const selectedEyeColor = ref('');
const selectedBodyType = ref('');
const selectedSkinTone = ref('');
const selectedAge = ref('');
const selectedGender = ref('');

// Catálogo de opciones físicas
const hairColorOptions = [
  { value: 'rubio', label: '👱 Rubio', description: 'cabello rubio dorado' },
  { value: 'moreno', label: '👨 Moreno', description: 'cabello moreno oscuro' },
  { value: 'pelirrojo', label: '👩‍🦰 Pelirrojo', description: 'cabello pelirrojo intenso' },
  { value: 'castano', label: '🧑 Castaño', description: 'cabello castaño' },
  { value: 'negro', label: '🖤 Negro', description: 'cabello negro azabache' },
  { value: 'blanco', label: '🤍 Blanco/Platino', description: 'cabello blanco platinado' },
  { value: 'colorido', label: '🌈 Colorido', description: 'cabello con colores vibrantes' },
];

const hairStyleOptions = [
  { value: 'largo', label: '💇‍♀️ Largo', description: 'cabello largo hasta los hombros o más' },
  { value: 'corto', label: '💇‍♂️ Corto', description: 'cabello corto estilo pixie o rapado' },
  { value: 'rizado', label: '🌀 Rizado', description: 'cabello con rizos definidos' },
  { value: 'liso', label: '➖ Liso', description: 'cabello completamente liso' },
  { value: 'ondulado', label: '〰️ Ondulado', description: 'cabello ondulado suave' },
  { value: 'mohawk', label: '🦅 Mohawk', description: 'cabello estilo mohawk punk' },
  { value: 'trenzas', label: '🪢 Trenzas', description: 'cabello con trenzas elaboradas' },
];

const eyeColorOptions = [
  { value: 'azules', label: '💙 Azules', description: 'ojos azules brillantes' },
  { value: 'verdes', label: '💚 Verdes', description: 'ojos verdes esmeralda' },
  { value: 'marrones', label: '🤎 Marrones', description: 'ojos marrones cálidos' },
  { value: 'grises', label: '🩶 Grises', description: 'ojos grises profundos' },
  { value: 'avellana', label: '🟤 Avellana', description: 'ojos color avellana' },
  { value: 'heterocromia', label: '👁️ Heterocromía', description: 'ojos de diferente color' },
];

const bodyTypeOptions = [
  { value: 'atletico', label: '💪 Atlético', description: 'cuerpo atlético musculoso' },
  { value: 'delgado', label: '🏃 Delgado', description: 'cuerpo delgado estilizado' },
  { value: 'promedio', label: '🧍 Promedio', description: 'cuerpo de constitución promedio' },
  { value: 'robusto', label: '🏋️ Robusto', description: 'cuerpo robusto y fuerte' },
  { value: 'curvilíneo', label: '💃 Curvilíneo', description: 'cuerpo con curvas definidas' },
];

const skinToneOptions = [
  { value: 'clara', label: '🤍 Clara', description: 'piel clara' },
  { value: 'media', label: '🤎 Media', description: 'piel de tono medio' },
  { value: 'trigueña', label: '🧡 Trigueña', description: 'piel trigueña' },
  { value: 'oscura', label: '🖤 Oscura', description: 'piel oscura' },
  { value: 'bronceada', label: '☀️ Bronceada', description: 'piel bronceada' },
];

const ageOptions = [
  { value: 'joven', label: '👦 Joven (18-25)', description: 'apariencia juvenil de 18-25 años' },
  { value: 'adulto_joven', label: '🧑 Adulto Joven (25-35)', description: 'apariencia de adulto joven 25-35 años' },
  { value: 'adulto', label: '👨 Adulto (35-50)', description: 'apariencia adulta de 35-50 años' },
  { value: 'maduro', label: '👴 Maduro (50+)', description: 'apariencia madura de más de 50 años' },
];

const genderOptions = [
  { value: 'masculino', label: '♂️ Masculino', description: 'rasgos masculinos' },
  { value: 'femenino', label: '♀️ Femenino', description: 'rasgos femeninos' },
  { value: 'andrógino', label: '⚧️ Andrógino', description: 'rasgos andróginos' },
];

// Construir prompt automático basado en selecciones
const buildPromptFromSelections = () => {
  const parts: string[] = [];
  
  // Primero las características físicas básicas
  if (selectedGender.value) {
    const gender = genderOptions.find(g => g.value === selectedGender.value);
    if (gender) parts.push(gender.description);
  }
  
  if (selectedAge.value) {
    const age = ageOptions.find(a => a.value === selectedAge.value);
    if (age) parts.push(age.description);
  }
  
  if (selectedBodyType.value) {
    const body = bodyTypeOptions.find(b => b.value === selectedBodyType.value);
    if (body) parts.push(body.description);
  }
  
  if (selectedSkinTone.value) {
    const skin = skinToneOptions.find(s => s.value === selectedSkinTone.value);
    if (skin) parts.push(skin.description);
  }
  
  // Luego características faciales y cabello
  if (selectedHairColor.value) {
    const hair = hairColorOptions.find(h => h.value === selectedHairColor.value);
    if (hair) parts.push(hair.description);
  }
  
  if (selectedHairStyle.value) {
    const style = hairStyleOptions.find(s => s.value === selectedHairStyle.value);
    if (style) parts.push(style.description);
  }
  
  if (selectedEyeColor.value) {
    const eyes = eyeColorOptions.find(e => e.value === selectedEyeColor.value);
    if (eyes) parts.push(eyes.description);
  }
  
  return parts.join(', ');
};

// Actualizar prompt cuando cambien las selecciones
watch([selectedHairColor, selectedHairStyle, selectedEyeColor, selectedBodyType, selectedSkinTone, selectedAge, selectedGender], () => {
  const autoPrompt = buildPromptFromSelections();
  if (autoPrompt) {
    prompt.value = autoPrompt;
  }
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

          <!-- Opciones de Personalización Física -->
          <div class="mb-8 space-y-6">
            <div class="text-center">
              <h3 class="text-text-primary font-semibold mb-2 text-lg">
                2. Personaliza las características físicas (Opcional)
              </h3>
              <p class="text-text-tertiary text-sm">
                Selecciona características físicas para transformar la persona de la foto
              </p>
            </div>

            <!-- Género -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Género / Rasgos
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="option in genderOptions"
                  :key="option.value"
                  @click="selectedGender = selectedGender === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedGender === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Edad -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Rango de Edad
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  v-for="option in ageOptions"
                  :key="option.value"
                  @click="selectedAge = selectedAge === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedAge === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Tipo de Cuerpo -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Tipo de Cuerpo
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

            <!-- Tono de Piel -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Tono de Piel
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="option in skinToneOptions"
                  :key="option.value"
                  @click="selectedSkinTone = selectedSkinTone === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedSkinTone === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Color de Cabello -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Color de Cabello
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  v-for="option in hairColorOptions"
                  :key="option.value"
                  @click="selectedHairColor = selectedHairColor === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedHairColor === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Estilo de Cabello -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Estilo de Cabello
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  v-for="option in hairStyleOptions"
                  :key="option.value"
                  @click="selectedHairStyle = selectedHairStyle === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedHairStyle === option.value
                      ? 'bg-primary text-white ring-2 ring-primary/50'
                      : 'bg-background-elevated text-text-primary hover:bg-background-elevated/70 border border-white/10'
                  ]"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Color de Ojos -->
            <div>
              <label class="block text-text-secondary font-medium mb-2 text-sm">
                Color de Ojos
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <button
                  v-for="option in eyeColorOptions"
                  :key="option.value"
                  @click="selectedEyeColor = selectedEyeColor === option.value ? '' : option.value"
                  :class="[
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    selectedEyeColor === option.value
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
              3. Descripción Final (Generado automáticamente)
            </label>
            <textarea
              v-model="prompt"
              placeholder="Las opciones seleccionadas aparecerán aquí automáticamente. También puedes editarlo manualmente..."
              rows="4"
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
