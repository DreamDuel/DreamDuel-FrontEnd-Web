<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { XMarkIcon, SparklesIcon, BoltIcon } from '@heroicons/vue/24/outline';

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
              ¡Ya usaste tu imagen gratis!
            </h2>
            <p class="text-text-secondary text-sm">
              Compra créditos para seguir creando
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
              Cada generación adicional requiere comprar créditos
            </p>
          </div>

          <!-- Opción Principal: Comprar Créditos -->
          <div class="bg-gradient-to-br from-primary/20 to-accent-crimson/20 rounded-xl p-4 border border-primary/30">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <SparklesIcon class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="font-semibold text-text-primary">Compra Créditos</h3>
                  <span class="px-2 py-0.5 bg-accent-crimson text-white text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                </div>
                <ul class="space-y-1 mb-3 text-sm text-text-secondary">
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Paga solo por lo que usas</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Calidad premium sin marca de agua</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Desde $0.99 por imagen</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Paquetes con descuento hasta 40%</span>
                  </li>
                </ul>
                <button
                  @click="emit('upgrade')"
                  class="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
                >
                  Ver Paquetes de Créditos
                </button>
              </div>
            </div>
          </div>

          <!-- Alternativa: Precio Individual -->
          <div class="bg-background-elevated rounded-xl p-4 border border-white/5 hover:border-accent-teal/30 transition-colors">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-accent-teal/20 rounded-lg flex items-center justify-center">
                <BoltIcon class="h-5 w-5 text-accent-teal" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-text-primary mb-1">Imagen Individual</h3>
                <p class="text-sm text-text-secondary mb-3">
                  Solo necesitas una imagen más? Compra una generación individual por $0.99
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-primary">$0.99</span>
                  <button
                    @click="emit('upgrade')"
                    class="px-4 py-2 bg-accent-teal hover:bg-accent-teal/80 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-background-deep border-t border-white/5 text-center">
          <p class="text-xs text-text-tertiary">
            💳 Pago seguro con Stripe | Sin suscripciones | Cancela cuando quieras
          </p>
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
