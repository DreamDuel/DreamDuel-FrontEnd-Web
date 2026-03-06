<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { XMarkIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'upgrade'): void;
}>();

const userStore = useUserStore();
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="relative w-full max-w-lg bg-background-card rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <!-- Header -->
        <div class="relative bg-gradient-to-br from-primary/20 to-accent-crimson/20 p-6 pb-12">
          <button @click="emit('close')" class="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
            <XMarkIcon class="h-6 w-6" />
          </button>
          
          <div class="text-center">
            <div class="text-6xl mb-3">🎨</div>
            <h2 class="text-2xl font-bold text-text-primary mb-2">
              Genera tu Imagen
            </h2>
            <p class="text-text-secondary text-sm">
              Cada imagen cuesta solo $1
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <!-- Info Box -->
          <div class="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
            <p class="text-text-secondary text-sm mb-1">
              Has generado <span class="font-bold text-primary">{{ userStore.currentUser?.totalImagesGenerated || 0 }}</span> imágenes en total
            </p>
            <p class="text-text-tertiary text-xs">
              Cada generación adicional cuesta $1.00
            </p>
          </div>

          <!-- Opción de Compra Simple -->
          <div class="bg-gradient-to-br from-primary/20 to-accent-crimson/20 rounded-xl p-6 border-2 border-primary/30">
            <div class="text-center">
              <div class="flex-shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SparklesIcon class="h-8 w-8 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-text-primary mb-2">Genera una Imagen</h3>
              <div class="flex items-baseline justify-center gap-2 mb-4">
                <span class="text-5xl font-bold bg-gradient-to-r from-primary to-accent-crimson bg-clip-text text-transparent">$1</span>
                <span class="text-text-secondary">/imagen</span>
              </div>
              <ul class="space-y-2 mb-6 text-sm text-text-secondary text-left max-w-xs mx-auto">
                <li class="flex items-center space-x-2">
                  <span class="text-accent-teal">✓</span>
                  <span>Generación en alta calidad</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="text-accent-teal">✓</span>
                  <span>Descarga inmediata</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="text-accent-teal">✓</span>
                  <span>Pago único, sin suscripciones</span>
                </li>
              </ul>
              <button
                @click="emit('upgrade')"
                class="w-full px-6 py-4 bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-primary/30"
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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
