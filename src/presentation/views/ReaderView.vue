<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStoryStore } from '@/stores/storyStore';
import { useUserStore } from '@/stores/userStore';
import { ShareIcon, ArrowLeftIcon, ArrowDownTrayIcon, GlobeAltIcon } from '@heroicons/vue/24/outline';
import { LockClosedIcon as LockClosedIconSolid } from '@heroicons/vue/24/solid';
import { shareStory, downloadImageWithWatermark } from '@/utils/watermark';

const route = useRoute();
const router = useRouter();
const storyStore = useStoryStore();
const userStore = useUserStore();
const isTogglingVisibility = ref(false);

const isAuthor = computed(() => {
  if (!storyStore.currentStory || !userStore.currentUser) return false;
  return storyStore.currentStory.author.id === userStore.currentUser.id;
});

const isPublic = computed(() => {
  if (!storyStore.currentStory) return true;
  return storyStore.currentStory.visibility === 'public';
});

onMounted(async () => {
  const storyId = route.params.id as string;
  await storyStore.fetchStoryById(storyId);
});

const goBack = () => {
  // Intentar volver a la página anterior, o ir al home si no hay historial
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/home');
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const handleShare = async () => {
  if (!storyStore.currentStory) return;
  
  const storyUrl = `${window.location.origin}/story/${storyStore.currentStory.id}`;
  const imageUrl = storyStore.currentStory.scenes[0]?.imageUrl || '';
  
  // Always add watermark (no premium users)
  await shareStory(
    storyStore.currentStory.title,
    imageUrl,
    storyUrl,
    false
  );
};

const handleDownload = async (sceneIndex: number) => {
  if (!storyStore.currentStory) return;
  
  const scene = storyStore.currentStory.scenes[sceneIndex];
  if (!scene) return; // Validar que la escena existe
  
  const filename = `dreamduel-${storyStore.currentStory.id}-scene-${sceneIndex + 1}.png`;
  
  // Always add watermark (no premium users)
  await downloadImageWithWatermark(
    scene.imageUrl,
    filename,
    false
  );
};

const toggleVisibility = async () => {
  if (!storyStore.currentStory || !isAuthor.value || isTogglingVisibility.value) return;
  
  isTogglingVisibility.value = true;
  const newVisibility = !isPublic.value;
  
  // Actualizar UI inmediatamente de forma optimista
  if (storyStore.currentStory) {
    storyStore.currentStory.visibility = newVisibility ? 'public' : 'private';
  }
  
  const success = await storyStore.updateStoryVisibility(
    storyStore.currentStory.id,
    newVisibility
  );
  
  if (!success) {
    // Revertir cambio si falla
    if (storyStore.currentStory) {
      storyStore.currentStory.visibility = newVisibility ? 'private' : 'public';
    }
    alert('Error al cambiar la visibilidad. Intenta de nuevo.');
  }
  
  isTogglingVisibility.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-background-deep pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-50 bg-background-deep/95 backdrop-blur-sm border-b border-white/5">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <button 
          @click="goBack"
          class="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeftIcon class="h-5 w-5" />
          <span>Atrás</span>
        </button>
        <div class="flex items-center space-x-4">
          <!-- Botón de Visibilidad (solo para el autor) -->
          <button 
            v-if="isAuthor"
            @click="toggleVisibility"
            :disabled="isTogglingVisibility"
            :class="[
              'flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all',
              isPublic 
                ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                : 'bg-accent-crimson/20 text-accent-crimson hover:bg-accent-crimson/30',
              isTogglingVisibility && 'opacity-50 cursor-not-allowed'
            ]"
            :title="isPublic ? 'Cambiar a privada' : 'Cambiar a pública'"
          >
            <component :is="isPublic ? GlobeAltIcon : LockClosedIconSolid" class="h-5 w-5" />
            <span class="hidden sm:inline">{{ isPublic ? 'Pública' : 'Privada' }}</span>
          </button>
          
          <button 
            @click="handleShare"
            class="text-text-secondary hover:text-text-primary transition-colors"
            title="Compartir historia"
          >
            <ShareIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="storyStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p class="text-white text-lg">Cargando historia...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="storyStore.error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-error text-xl mb-4">{{ storyStore.error }}</p>
        <button 
          @click="goBack"
          class="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>

    <!-- Story Content -->
    <div v-else-if="storyStore.currentStory" class="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <!-- Story Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4">
          {{ storyStore.currentStory.title }}
        </h1>
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-text-secondary text-sm">
            <router-link 
              :to="`/user/${storyStore.currentStory.author.id}`"
              class="hover:text-primary transition-colors cursor-pointer"
            >
              {{ storyStore.currentStory.author.name }}
            </router-link>
            <span>•</span>
            <span>{{ formatNumber(storyStore.currentStory.stats.views) }} lecturas</span>
          </div>
        </div>
      </div>

      <!-- Scenes -->
      <div class="space-y-6 md:space-y-8">
        <div 
          v-for="(scene, index) in storyStore.currentStory.scenes" 
          :key="scene.id"
          class="bg-background-elevated rounded-xl overflow-hidden shadow-lg"
        >
          <div class="relative group/scene">
            <img 
              :src="scene.imageUrl" 
              :alt="`Escena ${index + 1}`"
              class="w-full h-auto max-h-[400px] sm:max-h-[500px] md:max-h-[600px] object-contain mx-auto transition-all duration-300"
            />
            
            <!-- Download Button (top-right) -->
            <button
              @click="handleDownload(index)"
              class="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover/scene:opacity-100 transition-all backdrop-blur-sm"
              title="Descargar imagen"
            >
              <ArrowDownTrayIcon class="h-5 w-5" />
            </button>
          </div>
          
          <div class="p-4 sm:p-6">
            <p class="text-text-primary text-base sm:text-lg leading-relaxed">
              {{ scene.text }}
            </p>
          </div>
        </div>
      </div>

      <!-- End Card -->
      <div class="mt-12 text-center bg-background-elevated rounded-xl p-8">
        <div class="text-5xl mb-4">✨</div>
        <h3 class="text-2xl font-bold text-text-primary mb-4">Fin del Capítulo</h3>
        <p class="text-text-secondary mb-6">¿Te gustó esta historia?</p>
        <div class="flex justify-center">
          <button 
            @click="goBack"
            class="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg font-semibold transition-all"
          >
            Explorar más historias
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No additional styles needed */
</style>
