<script setup lang="ts">
import { useRouter } from 'vue-router';
import { 
  SparklesIcon, 
  BoltIcon, 
  HeartIcon, 
  StarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

const handlePurchase = () => {
  // Aquí iría la integración con Stripe/PayPal
  console.log('Iniciando compra de imagen');
  alert('Próximamente: Integración con pasarela de pago');
};
</script>

<template>
  <div class="min-h-screen bg-background-deep py-20 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <button @click="router.back()" class="absolute top-6 left-6 text-text-secondary hover:text-text-primary transition-colors">
          <XMarkIcon class="h-8 w-8" />
        </button>
        
        <div class="flex items-center justify-center space-x-3 mb-4">
          <SparklesIcon class="h-12 w-12 text-primary" />
          <h1 class="text-4xl md:text-5xl font-bold text-text-primary">
            Precios Simples
          </h1>
        </div>
        <p class="text-text-secondary text-lg max-w-2xl mx-auto mb-4">
          Tu primera imagen es <span class="text-primary font-bold">GRATIS</span> 🎉
        </p>
      </div>

      <!-- Main Pricing Card -->
      <div class="max-w-xl mx-auto mb-12">
        <div class="bg-gradient-to-br from-primary/20 via-accent-crimson/10 to-accent-gold/20 border-2 border-primary rounded-3xl p-8 shadow-2xl shadow-primary/20">
          <!-- Badge -->
          <div class="flex justify-center mb-6">
            <div class="bg-gradient-to-r from-primary to-accent-crimson text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
              <StarIcon class="h-4 w-4 fill-current" />
              <span>PRECIO ÚNICO</span>
            </div>
          </div>

          <!-- Price -->
          <div class="text-center mb-8">
            <div class="flex items-baseline justify-center space-x-2 mb-4">
              <span class="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent-crimson bg-clip-text text-transparent">$1</span>
              <span class="text-2xl text-text-secondary">/imagen</span>
            </div>
            <p class="text-text-secondary text-lg">Sin suscripciones ni paquetes complicados</p>
          </div>

          <!-- Features -->
          <ul class="space-y-4 mb-8">
            <li class="flex items-start space-x-3">
              <CheckIcon class="h-6 w-6 text-accent-teal flex-shrink-0 mt-0.5" />
              <span class="text-text-primary text-lg">Generación en alta calidad</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="h-6 w-6 text-accent-teal flex-shrink-0 mt-0.5" />
              <span class="text-text-primary text-lg">No se almacena en servidores</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="h-6 w-6 text-accent-teal flex-shrink-0 mt-0.5" />
              <span class="text-text-primary text-lg">Descarga inmediata</span>
            </li>
            <li class="flex items-start space-x-3">
              <CheckIcon class="h-6 w-6 text-accent-teal flex-shrink-0 mt-0.5" />
              <span class="text-text-primary text-lg">Pago único por imagen</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button
            @click="handlePurchase"
            class="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Comprar Ahora
          </button>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BoltIcon class="h-8 w-8 text-white" />
          </div>
          <h3 class="font-semibold text-text-primary mb-2">Paga Solo por lo que Usas</h3>
          <p class="text-text-secondary text-sm">
            Sin cargos recurrentes ni sorpresas. $1 por cada imagen que generes.
          </p>
        </div>

        <div class="text-center p-6">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SparklesIcon class="h-8 w-8 text-white" />
          </div>
          <h3 class="font-semibold text-text-primary mb-2">Calidad Premium</h3>
          <p class="text-text-secondary text-sm">
            Todas las imágenes en alta resolución, sin marcas de agua.
          </p>
        </div>

        <div class="text-center p-6">
          <div class="w-16 h-16 bg-gradient-to-br from-accent-teal to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HeartIcon class="h-8 w-8 text-white" />
          </div>
          <h3 class="font-semibold text-text-primary mb-2">Sin Almacenamiento</h3>
          <p class="text-text-secondary text-sm">
            Descarga tus imágenes directamente. No ocupamos espacio en servidores.
          </p>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold text-text-primary text-center mb-8">Preguntas frecuentes</h2>
        
        <div class="space-y-4">
          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿La primera imagen realmente es gratis?</h3>
            <p class="text-text-secondary">
              ¡Sí! Todos los usuarios nuevos reciben su primera generación completamente gratis, sin tarjeta de crédito requerida.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Qué métodos de pago aceptan?</h3>
            <p class="text-text-secondary">
              Aceptamos tarjetas de crédito/débito, PayPal y otras opciones de pago locales según tu región.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Puedo obtener un reembolso?</h3>
            <p class="text-text-secondary">
              Sí, ofrecemos reembolso completo dentro de las primeras 24 horas si hay algún problema con la generación.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Guardan mis imágenes?</h3>
            <p class="text-text-secondary">
              No. Una vez generada, la imagen se descarga automáticamente a tu dispositivo. No almacenamos las imágenes en nuestros servidores.
            </p>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-16 flex flex-wrap items-center justify-center gap-8 text-text-tertiary">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">�</span>
          <span>$1 por imagen</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">✓</span>
          <span>Sin suscripciones</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">⚡</span>
          <span>Descarga instantánea</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🔒</span>
          <span>No se almacena</span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
