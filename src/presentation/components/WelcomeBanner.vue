<script setup lang="ts">
import { ref } from 'vue';
import { XMarkIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const dismissed = ref(false);

const handleClose = () => {
  dismissed.value = true;
  emit('close');
};
</script>

<template>
  <Transition name="banner">
    <div v-if="show && !dismissed" class="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-accent-crimson to-accent-gold p-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-3 flex-1">
          <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <SparklesIcon class="h-6 w-6 text-white" />
          </div>
          <div class="flex-1">
            <h3 class="text-white font-bold text-sm sm:text-base">
              🎉 ¡Bienvenido a DreamDuel!
            </h3>
            <p class="text-white/90 text-xs sm:text-sm">
              Tu <span class="font-bold">primera imagen es GRATIS</span>. Comienza a crear ahora.
            </p>
          </div>
        </div>
        
        <button
          @click="handleClose"
          class="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.banner-enter-active,
.banner-leave-active {
  transition: all 0.3s ease;
}

.banner-enter-from,
.banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
