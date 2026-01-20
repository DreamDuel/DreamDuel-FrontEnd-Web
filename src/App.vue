<script setup lang="ts">
import { RouterView } from 'vue-router';
import MainLayout from './presentation/layouts/MainLayout.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const hideLayout = computed(() => route.meta.hideNavigation);
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="!hideLayout">
      <MainLayout>
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </MainLayout>
    </template>
    <template v-else>
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </template>
  </RouterView>
</template>

<style>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
