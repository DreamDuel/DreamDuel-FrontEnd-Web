<script setup lang="ts">
import { XMarkIcon, SparklesIcon, BoltIcon, HeartIcon, StarIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  show: boolean;
  trigger?: 'blur' | 'download' | 'limit' | 'feature';
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'upgrade'): void;
}>();

const triggerMessages = {
  blur: {
    emoji: '🔓',
    title: '¿Quieres ver la imagen completa?',
    subtitle: 'Desbloquea todas tus historias sin blur',
  },
  download: {
    emoji: '⬇️',
    title: '¿Quieres descargar sin marca de agua?',
    subtitle: 'Obtén descargas ilimitadas en alta calidad',
  },
  limit: {
    emoji: '⚡',
    title: '¿Sin tiempo para esperar?',
    subtitle: 'Crea historias ilimitadas sin pausas',
  },
  feature: {
    emoji: '✨',
    title: 'Desbloquea todo el potencial',
    subtitle: 'Accede a funciones exclusivas premium',
  },
};

const currentMessage = triggerMessages[props.trigger || 'feature'];

const features = [
  { icon: BoltIcon, text: 'Imágenes ilimitadas', color: 'text-accent-teal' },
  { icon: SparklesIcon, text: 'Sin marcas de agua', color: 'text-primary' },
  { icon: HeartIcon, text: 'Estilos premium exclusivos', color: 'text-accent-crimson' },
  { icon: StarIcon, text: 'Soporte prioritario 24/7', color: 'text-accent-gold' },
];
</script>

<template>
  <Transition name="slideout">
    <div v-if="show" class="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end">
      <!-- Backdrop -->
      <div @click="emit('close')" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <!-- Slideout Panel -->
      <div class="relative w-full sm:w-96 sm:h-full bg-background-card sm:rounded-l-2xl shadow-2xl border-t sm:border-l sm:border-t-0 border-white/10 overflow-hidden">
        <!-- Header -->
        <div class="relative bg-gradient-to-br from-primary via-accent-crimson to-accent-gold p-6">
          <button @click="emit('close')" class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
          
          <div class="text-center text-white">
            <div class="text-5xl mb-3">{{ currentMessage.emoji }}</div>
            <h2 class="text-2xl font-bold mb-2">
              {{ currentMessage.title }}
            </h2>
            <p class="text-white/80 text-sm">
              {{ currentMessage.subtitle }}
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 overflow-y-auto" style="max-height: calc(100vh - 300px)">
          <!-- Features List -->
          <div class="space-y-3">
            <h3 class="font-semibold text-text-primary mb-3">Con Premium obtienes:</h3>
            <div v-for="(feature, index) in features" :key="index" 
                 class="flex items-center space-x-3 p-3 bg-background-elevated rounded-lg border border-white/5">
              <component :is="feature.icon" :class="[feature.color, 'h-6 w-6 flex-shrink-0']" />
              <span class="text-text-primary">{{ feature.text }}</span>
            </div>
          </div>

          <!-- Price -->
          <div class="bg-gradient-to-br from-primary/10 to-accent-crimson/10 rounded-xl p-4 border border-primary/20">
            <div class="text-center">
              <div class="text-text-secondary text-sm mb-1">Precio especial por lanzamiento</div>
              <div class="flex items-baseline justify-center space-x-2">
                <span class="text-3xl font-bold text-primary">$9.99</span>
                <span class="text-text-secondary">/mes</span>
              </div>
              <div class="text-xs text-text-tertiary mt-1">Cancela cuando quieras</div>
            </div>
          </div>

          <!-- CTA Button -->
          <button
            @click="emit('upgrade')"
            class="w-full px-6 py-4 bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Activar Premium Ahora
          </button>

          <!-- Testimonial -->
          <div class="bg-background-elevated rounded-lg p-4 border border-white/5">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent-teal to-primary rounded-full"></div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <span class="font-semibold text-text-primary text-sm">María G.</span>
                  <div class="flex text-accent-gold">
                    <StarIcon class="h-3 w-3 fill-current" />
                    <StarIcon class="h-3 w-3 fill-current" />
                    <StarIcon class="h-3 w-3 fill-current" />
                    <StarIcon class="h-3 w-3 fill-current" />
                    <StarIcon class="h-3 w-3 fill-current" />
                  </div>
                </div>
                <p class="text-xs text-text-secondary">
                  "Premium cambió mi experiencia. Ahora puedo crear historias sin límites y mis lectores están encantados con la calidad."
                </p>
              </div>
            </div>
          </div>

          <!-- Trust Indicators -->
          <div class="flex items-center justify-center space-x-4 text-xs text-text-tertiary">
            <div class="flex items-center space-x-1">
              <span>🔒</span>
              <span>Pago seguro</span>
            </div>
            <div class="w-px h-4 bg-white/10"></div>
            <div class="flex items-center space-x-1">
              <span>✓</span>
              <span>Sin permanencia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slideout-enter-active,
.slideout-leave-active {
  transition: all 0.3s ease;
}

.slideout-enter-from,
.slideout-leave-to {
  opacity: 0;
}

.slideout-enter-from > div:last-child,
.slideout-leave-to > div:last-child {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .slideout-enter-from > div:last-child,
  .slideout-leave-to > div:last-child {
    transform: translateX(100%) translateY(0);
  }
}
</style>
