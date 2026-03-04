<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { XMarkIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const { t } = useI18n();

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
    <div v-if="show && !dismissed" class="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-accent-crimson to-accent-gold p-3 sm:p-4 shadow-lg">
      <div class="max-w-7xl mx-auto flex items-center justify-between space-x-2 sm:space-x-4">
        <div class="flex items-center space-x-2 sm:space-x-3 flex-1">
          <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <SparklesIcon class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-white font-bold text-xs sm:text-sm md:text-base truncate">
              {{ t('welcomeBanner.title') }}
            </h3>
            <p class="text-white/90 text-xs sm:text-sm">
              {{ t('welcomeBanner.message') }} <span class="font-bold">{{ t('welcomeBanner.messageBold') }}</span>{{ t('welcomeBanner.messageCta') }}
            </p>
          </div>
        </div>
        
        <button
          @click="handleClose"
          class="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1"
        >
          <XMarkIcon class="h-4 w-4 sm:h-5 sm:w-5" />
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
