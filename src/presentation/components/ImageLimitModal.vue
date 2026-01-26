<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { XMarkIcon, ClockIcon, UserPlusIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'upgrade'): void;
  (e: 'invite'): void;
}>();

const userStore = useUserStore();
const timeLeft = ref('12:00:00');
const copied = ref(false);

const referralLink = computed(() => {
  if (!userStore.currentUser) return '';
  return `https://dreamduel.com/ref/${userStore.currentUser.credits.referralCode}`;
});

let interval: NodeJS.Timeout;

onMounted(() => {
  interval = setInterval(() => {
    timeLeft.value = userStore.getTimeUntilReset();
  }, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});

const copyReferralLink = () => {
  navigator.clipboard.writeText(referralLink.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};
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
              ¡Has usado tus imágenes gratis!
            </h2>
            <p class="text-text-secondary text-sm">
              Pero tienes varias opciones para continuar...
            </p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <!-- Opción 1: Esperar -->
          <div class="bg-background-elevated rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-colors">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ClockIcon class="h-5 w-5 text-primary" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-text-primary mb-1">Espera y recarga gratis</h3>
                <p class="text-sm text-text-secondary mb-2">
                  Recupera 3 imágenes gratis en:
                </p>
                <div class="text-2xl font-mono font-bold text-primary">
                  {{ timeLeft }}
                </div>
              </div>
            </div>
          </div>

          <!-- Opción 2: Invitar -->
          <div class="bg-background-elevated rounded-xl p-4 border border-white/5 hover:border-accent-teal/30 transition-colors">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-accent-teal/20 rounded-lg flex items-center justify-center">
                <UserPlusIcon class="h-5 w-5 text-accent-teal" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-text-primary mb-1">Invita a un amigo</h3>
                <p class="text-sm text-text-secondary mb-3">
                  Obtén +3 imágenes gratis por cada amigo que se registre
                </p>
                <div class="flex space-x-2">
                  <input
                    type="text"
                    readonly
                    :value="referralLink"
                    class="flex-1 px-3 py-2 bg-background-deep border border-white/10 rounded-lg text-sm text-text-primary focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none"
                  />
                  <button
                    @click="copyReferralLink"
                    class="px-4 py-2 bg-accent-teal hover:bg-accent-teal/80 text-white rounded-lg font-semibold text-sm transition-colors"
                  >
                    {{ copied ? '✓ Copiado' : 'Copiar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Opción 3: Premium -->
          <div class="bg-gradient-to-br from-primary/20 to-accent-crimson/20 rounded-xl p-4 border border-primary/30">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <SparklesIcon class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="font-semibold text-text-primary">Hazte Premium</h3>
                  <span class="px-2 py-0.5 bg-accent-crimson text-white text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                </div>
                <ul class="space-y-1 mb-3 text-sm text-text-secondary">
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Imágenes ilimitadas sin esperas</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Sin marcas de agua</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Estilos premium exclusivos</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="text-accent-teal">✓</span>
                    <span>Soporte prioritario</span>
                  </li>
                </ul>
                <button
                  @click="emit('upgrade')"
                  class="w-full px-4 py-3 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all hover:scale-105"
                >
                  Desbloquear Premium - $9.99/mes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-background-deep border-t border-white/5 text-center">
          <p class="text-xs text-text-tertiary">
            💡 Tip: Sigue creando historias ilimitadas con texto mientras esperas
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
