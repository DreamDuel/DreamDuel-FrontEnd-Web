<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { SparklesIcon, CheckIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

// Obtener el nicho de la URL
const niche = computed(() => route.params.niche as string);

// Configuración de nichos
const nicheConfig: Record<string, {
  title: string;
  emoji: string;
  description: string;
  examples: string[];
  color: string;
  gradient: string;
}> = {
  romance: {
    title: 'Generador de Historias de Romance',
    emoji: '💕',
    description: 'Crea historias románticas personalizadas con IA. Desde comedias románticas hasta dramas épicos de amor.',
    examples: [
      'Romance de oficina con giro inesperado',
      'Historia de amor en París',
      'Reencuentro después de 10 años'
    ],
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-red-500/20'
  },
  terror: {
    title: 'Generador de Historias de Terror',
    emoji: '👻',
    description: 'Genera historias de terror escalofriantes con IA. Terror psicológico, slasher, sobrenatural y más.',
    examples: [
      'Casa embrujada con secreto oscuro',
      'Entidad que acecha en la oscuridad',
      'Experimento científico que salió mal'
    ],
    color: 'text-red-400',
    gradient: 'from-red-900/20 to-black/40'
  },
  ciencia_ficcion: {
    title: 'Generador de Historias de Ciencia Ficción',
    emoji: '🚀',
    description: 'Crea mundos futuristas y aventuras espaciales con IA. Explora galaxias, tecnología avanzada y realidades alternativas.',
    examples: [
      'Colonia espacial en crisis',
      'IA que desarrolla consciencia',
      'Viaje en el tiempo paradójico'
    ],
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  fantasia: {
    title: 'Generador de Historias de Fantasía',
    emoji: '🔮',
    description: 'Genera mundos mágicos y aventuras épicas con IA. Dragones, hechiceros, reinos místicos y más.',
    examples: [
      'Joven descubre poderes mágicos',
      'Búsqueda del artefacto perdido',
      'Guerra entre reinos elementales'
    ],
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  misterio: {
    title: 'Generador de Historias de Misterio',
    emoji: '🔍',
    description: 'Crea thrillers y misterios intrigantes con IA. Detectives, casos sin resolver y giros inesperados.',
    examples: [
      'Crimen en mansión aislada',
      'Detective resuelve caso de 20 años',
      'Desaparición sin explicación'
    ],
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  },
  accion: {
    title: 'Generador de Historias de Acción',
    emoji: '⚔️',
    description: 'Genera historias llenas de adrenalina con IA. Persecuciones, combates épicos y misiones imposibles.',
    examples: [
      'Agente secreto en misión suicida',
      'Guerrero en torneo mortal',
      'Rescate en zona de guerra'
    ],
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-red-500/20'
  }
};

const currentNiche = computed(() => nicheConfig[niche.value] || nicheConfig.romance);

const benefits = [
  { icon: '⚡', text: 'Generación instantánea con IA' },
  { icon: '🎨', text: 'Imágenes visuales únicas' },
  { icon: '📱', text: 'Comparte en redes sociales' },
  { icon: '🎁', text: '3 imágenes gratis al registrarte' }
];

const steps = [
  { number: 1, title: 'Describe tu idea', description: 'Escribe la trama que imaginas' },
  { number: 2, title: 'Elige el estilo', description: 'Anime, realista, cómic, etc.' },
  { number: 3, title: 'Genera con IA', description: 'En segundos tienes tu historia visual' }
];

const goToCreate = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background-deep via-background-elevated to-background-deep">
    <!-- Header -->
    <header class="border-b border-white/10 bg-background-deep/80 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <SparklesIcon class="h-8 w-8 text-primary" />
          <span class="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            DreamDuel
          </span>
        </div>
        <button
          @click="goToCreate"
          class="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg font-bold transition-all hover:scale-105 flex items-center space-x-2"
        >
          <span>Crear Gratis</span>
          <ArrowRightIcon class="h-5 w-5" />
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="py-20 px-4">
      <div class="max-w-5xl mx-auto text-center">
        <div class="text-7xl mb-6">{{ currentNiche.emoji }}</div>
        <h1 class="text-5xl md:text-6xl font-bold text-text-primary mb-6">
          {{ currentNiche.title }}
        </h1>
        <p class="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
          {{ currentNiche.description }}
        </p>
        <button
          @click="goToCreate"
          class="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-accent-teal hover:from-primary-light hover:to-accent-teal/80 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-2xl shadow-primary/40"
        >
          <SparklesIcon class="h-6 w-6" />
          <span>Crear Historia Gratis</span>
        </button>
        <p class="text-text-tertiary text-sm mt-4">
          Sin registro • Sin tarjeta • 100% gratis
        </p>
      </div>
    </section>

    <!-- Ejemplos -->
    <section class="py-16 px-4 bg-background-card/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-text-primary text-center mb-12">
          Ideas para Inspirarte
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="(example, index) in currentNiche.examples"
            :key="index"
            :class="[
              'bg-gradient-to-br p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-all hover:scale-105 cursor-pointer',
              currentNiche.gradient
            ]"
            @click="goToCreate"
          >
            <div class="text-4xl mb-3">{{ currentNiche.emoji }}</div>
            <p class="text-text-primary font-semibold">{{ example }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo Funciona -->
    <section class="py-16 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-text-primary text-center mb-12">
          ¿Cómo Funciona?
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="step in steps"
            :key="step.number"
            class="text-center"
          >
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
              {{ step.number }}
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-2">{{ step.title }}</h3>
            <p class="text-text-secondary">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Beneficios -->
    <section class="py-16 px-4 bg-background-card/30">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-text-primary text-center mb-12">
          ¿Por Qué Usar DreamDuel?
        </h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="benefit in benefits"
            :key="benefit.text"
            class="bg-background-elevated p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-all"
          >
            <div class="text-4xl mb-3">{{ benefit.icon }}</div>
            <p class="text-text-primary font-semibold">{{ benefit.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-20 px-4">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-text-primary mb-6">
          Empieza a Crear Ahora
        </h2>
        <p class="text-xl text-text-secondary mb-8">
          Únete a miles de creadores que ya están generando historias increíbles con IA.
        </p>
        <button
          @click="goToCreate"
          class="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-2xl"
        >
          <SparklesIcon class="h-6 w-6" />
          <span>Crear Mi Primera Historia</span>
        </button>
      </div>
    </section>

    <!-- Footer SEO -->
    <footer class="border-t border-white/10 py-8 px-4">
      <div class="max-w-7xl mx-auto text-center text-text-tertiary text-sm">
        <p>© 2026 DreamDuel. Generador de historias con IA. Todos los derechos reservados.</p>
        <div class="flex items-center justify-center space-x-6 mt-4">
          <a href="#" class="hover:text-primary transition-colors">Términos</a>
          <a href="#" class="hover:text-primary transition-colors">Privacidad</a>
          <a href="#" class="hover:text-primary transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  </div>
</template>
