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

// Paquetes de créditos para comprar imágenes
const pricingPackages = [
  {
    id: 'single',
    name: 'Imagen Individual',
    price: 0.99,
    images: 1,
    pricePerImage: 0.99,
    badge: null,
    popular: false,
    features: [
      'Generación en alta calidad',
      'Sin marca de agua',
      'Descarga inmediata',
      'Válido por 30 días'
    ]
  },
  {
    id: 'pack-10',
    name: 'Paquete Básico',
    price: 7.99,
    images: 10,
    pricePerImage: 0.79,
    badge: 'Ahorro 20%',
    popular: false,
    features: [
      'Generación en alta calidad',
      'Sin marca de agua',
      'Descarga inmediata',
      'Válido por 60 días',
      'Ahorra $2.00'
    ]
  },
  {
    id: 'pack-25',
    name: 'Paquete Popular',
    price: 17.99,
    images: 25,
    pricePerImage: 0.72,
    badge: 'Ahorro 27%',
    popular: true,
    features: [
      'Generación en alta calidad',
      'Sin marca de agua',
      'Descarga inmediata',
      'Válido por 90 días',
      'Ahorra $6.75',
      'Soporte prioritario'
    ]
  },
  {
    id: 'pack-100',
    name: 'Paquete Pro',
    price: 59.99,
    images: 100,
    pricePerImage: 0.60,
    badge: 'Ahorro 40%',
    popular: false,
    features: [
      'Generación en alta calidad',
      'Sin marca de agua',
      'Descarga inmediata',
      'Sin fecha de expiración',
      'Ahorra $39.00',
      'Soporte prioritario 24/7',
      'Acceso anticipado a nuevas funciones'
    ]
  }
];

const handlePurchase = (packageId: string) => {
  // Aquí iría la integración con Stripe/PayPal
  console.log('Iniciando compra de paquete:', packageId);
  alert('Próximamente: Integración con pasarela de pago');
};
</script>

<template>
  <div class="min-h-screen bg-background-deep py-20 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <button @click="router.back()" class="absolute top-6 left-6 text-text-secondary hover:text-text-primary transition-colors">
          <XMarkIcon class="h-8 w-8" />
        </button>
        
        <div class="flex items-center justify-center space-x-3 mb-4">
          <SparklesIcon class="h-12 w-12 text-primary" />
          <h1 class="text-4xl md:text-5xl font-bold text-text-primary">
            Compra Créditos
          </h1>
        </div>
        <p class="text-text-secondary text-lg max-w-2xl mx-auto mb-4">
          Tu primera imagen es <span class="text-primary font-bold">GRATIS</span> 🎉
        </p>
        <p class="text-text-secondary text-base max-w-2xl mx-auto">
          Después, elige el paquete que mejor se adapte a tus necesidades
        </p>
      </div>

      <!-- Pricing Cards Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
        <div
          v-for="pkg in pricingPackages"
          :key="pkg.id"
          :class="[
            'relative rounded-2xl p-6 border transition-all duration-300 hover:scale-105',
            pkg.popular 
              ? 'bg-gradient-to-br from-primary/20 via-accent-crimson/10 to-accent-gold/20 border-2 border-primary shadow-xl shadow-primary/20' 
              : 'bg-background-card border-white/10 hover:border-primary/30'
          ]"
        >
          <!-- Popular Badge -->
          <div v-if="pkg.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div class="bg-gradient-to-r from-primary to-accent-crimson text-white px-4 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <StarIcon class="h-3 w-3 fill-current" />
              <span>MÁS POPULAR</span>
            </div>
          </div>

          <!-- Savings Badge -->
          <div v-else-if="pkg.badge" class="absolute top-4 right-4">
            <div class="bg-accent-teal/20 text-accent-teal px-2 py-1 rounded text-xs font-bold">
              {{ pkg.badge }}
            </div>
          </div>

          <!-- Package Info -->
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-text-primary mb-2">{{ pkg.name }}</h3>
            <div class="flex items-baseline justify-center space-x-1 mb-1">
              <span class="text-4xl font-bold text-primary">${{ pkg.price }}</span>
            </div>
            <p class="text-text-secondary text-sm mb-2">{{ pkg.images }} {{ pkg.images === 1 ? 'imagen' : 'imágenes' }}</p>
            <p class="text-accent-teal text-xs font-semibold">${{ pkg.pricePerImage.toFixed(2) }} por imagen</p>
          </div>

          <!-- Features -->
          <ul class="space-y-3 mb-6">
            <li 
              v-for="(feature, index) in pkg.features" 
              :key="index"
              class="flex items-start space-x-2 text-sm"
            >
              <CheckIcon class="h-5 w-5 text-accent-teal flex-shrink-0 mt-0.5" />
              <span class="text-text-primary">{{ feature }}</span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button
            @click="handlePurchase(pkg.id)"
            :class="[
              'w-full py-3 rounded-lg font-semibold transition-all duration-300',
              pkg.popular
                ? 'bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white shadow-lg hover:shadow-xl'
                : 'bg-background-elevated hover:bg-primary/20 text-text-primary border border-white/10 hover:border-primary'
            ]"
          >
            Comprar Ahora
          </button>
        </div>
      </div>

      <!-- Benefits Section -->
      <div class="bg-background-card rounded-2xl p-8 border border-white/10 mb-12">
        <h2 class="text-2xl font-bold text-text-primary text-center mb-6">¿Por qué comprar créditos?</h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BoltIcon class="h-8 w-8 text-white" />
            </div>
            <h3 class="font-semibold text-text-primary mb-2">Sin Suscripciones</h3>
            <p class="text-text-secondary text-sm">
              Paga solo por lo que usas. Sin cargos recurrentes ni sorpresas.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon class="h-8 w-8 text-white" />
            </div>
            <h3 class="font-semibold text-text-primary mb-2">Calidad Premium</h3>
            <p class="text-text-secondary text-sm">
              Todas las imágenes en alta resolución, sin marcas de agua.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-accent-teal to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HeartIcon class="h-8 w-8 text-white" />
            </div>
            <h3 class="font-semibold text-text-primary mb-2">Flexibilidad Total</h3>
            <p class="text-text-secondary text-sm">
              Usa tus créditos cuando quieras, a tu propio ritmo.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-text-primary text-center mb-8">Preguntas frecuentes</h2>
        
        <div class="space-y-6">
          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Expiran los créditos?</h3>
            <p class="text-text-secondary">
              La mayoría de los paquetes tienen validez de 30-90 días. El paquete Pro no expira nunca.
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
              Sí, ofrecemos reembolso completo dentro de los primeros 7 días si no has usado ningún crédito del paquete.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿La primera imagen realmente es gratis?</h3>
            <p class="text-text-secondary">
              ¡Sí! Todos los usuarios nuevos reciben su primera generación completamente gratis, sin tarjeta de crédito requerida.
            </p>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-16 flex flex-wrap items-center justify-center gap-8 text-text-tertiary">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🔒</span>
          <span>Pago seguro SSL</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">✓</span>
          <span>Sin suscripciones</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">💳</span>
          <span>Reembolso 7 días</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">⚡</span>
          <span>Créditos instantáneos</span>
        </div>
      </div>
    </div>
  </div>
</template>
