<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { 
  SparklesIcon, 
  BoltIcon, 
  HeartIcon, 
  StarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const userStore = useUserStore();
const selectedPlan = ref<'monthly' | 'yearly'>('monthly');

const plans = {
  free: {
    name: 'Gratis',
    price: 0,
    features: [
      { text: '3 imágenes gratis cada 12 horas', included: true },
      { text: 'Historias con texto ilimitadas', included: true },
      { text: 'Marca de agua en descargas', included: false },
      { text: 'Blur en imágenes', included: false },
      { text: 'Estilos básicos', included: true },
      { text: 'Soporte prioritario', included: false },
    ],
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: [
      { text: 'Imágenes ilimitadas', included: true },
      { text: 'Sin marcas de agua', included: true },
      { text: 'Sin blur - Calidad máxima', included: true },
      { text: 'Todos los estilos premium', included: true },
      { text: 'Exportar a video para TikTok', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Acceso anticipado a funciones', included: true },
    ],
  },
};

const handleCheckout = (plan: 'monthly' | 'yearly') => {
  // Aquí iría la integración con Stripe/PayPal
  console.log('Iniciando checkout para plan:', plan);
  alert('Próximamente: Integración con pasarela de pago');
};
</script>

<template>
  <div class="min-h-screen bg-background-deep py-20 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <button @click="router.back()" class="absolute top-6 left-6 text-text-secondary hover:text-text-primary transition-colors">
          <XMarkIcon class="h-8 w-8" />
        </button>
        
        <div class="flex items-center justify-center space-x-3 mb-4">
          <SparklesIcon class="h-12 w-12 text-primary" />
          <h1 class="text-4xl md:text-5xl font-bold text-text-primary">
            Elige tu plan
          </h1>
        </div>
        <p class="text-text-secondary text-lg max-w-2xl mx-auto">
          Empieza gratis y actualiza cuando estés listo para crear sin límites
        </p>
      </div>

      <!-- Toggle Monthly/Yearly -->
      <div class="flex justify-center mb-12">
        <div class="bg-background-elevated rounded-full p-1 inline-flex">
          <button
            @click="selectedPlan = 'monthly'"
            :class="[
              'px-6 py-2 rounded-full font-semibold transition-all',
              selectedPlan === 'monthly' 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:text-text-primary'
            ]"
          >
            Mensual
          </button>
          <button
            @click="selectedPlan = 'yearly'"
            :class="[
              'px-6 py-2 rounded-full font-semibold transition-all relative',
              selectedPlan === 'yearly' 
                ? 'bg-primary text-white' 
                : 'text-text-secondary hover:text-text-primary'
            ]"
          >
            Anual
            <span class="absolute -top-2 -right-2 bg-accent-crimson text-white text-xs px-2 py-0.5 rounded-full">
              -17%
            </span>
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Free Plan -->
        <div class="bg-background-card rounded-2xl p-8 border border-white/10">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-text-primary mb-2">{{ plans.free.name }}</h3>
            <div class="flex items-baseline justify-center space-x-2">
              <span class="text-5xl font-bold text-primary">$0</span>
              <span class="text-text-secondary">/mes</span>
            </div>
          </div>

          <ul class="space-y-4 mb-8">
            <li 
              v-for="(feature, index) in plans.free.features" 
              :key="index"
              class="flex items-start space-x-3"
            >
              <component 
                :is="feature.included ? CheckIcon : XMarkIcon" 
                :class="[
                  'h-6 w-6 flex-shrink-0',
                  feature.included ? 'text-accent-teal' : 'text-text-tertiary'
                ]" 
              />
              <span :class="feature.included ? 'text-text-primary' : 'text-text-tertiary line-through'">
                {{ feature.text }}
              </span>
            </li>
          </ul>

          <button
            @click="router.push('/register')"
            class="w-full py-3 bg-background-elevated hover:bg-background-card text-text-primary rounded-lg font-semibold transition-all border border-white/10"
          >
            Empezar gratis
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="bg-gradient-to-br from-primary/20 via-accent-crimson/10 to-accent-gold/20 rounded-2xl p-8 border-2 border-primary relative overflow-hidden">
          <div class="absolute top-0 right-0 bg-accent-crimson text-white px-4 py-1 text-sm font-bold">
            POPULAR
          </div>
          
          <div class="text-center mb-6 relative z-10">
            <h3 class="text-2xl font-bold text-text-primary mb-2 flex items-center justify-center space-x-2">
              <span>{{ plans.premium.name }}</span>
              <StarIcon class="h-6 w-6 text-accent-gold fill-current" />
            </h3>
            <div class="flex items-baseline justify-center space-x-2">
              <span class="text-5xl font-bold text-primary">
                ${{ selectedPlan === 'monthly' ? plans.premium.monthlyPrice : (plans.premium.yearlyPrice / 12).toFixed(2) }}
              </span>
              <span class="text-text-secondary">/mes</span>
            </div>
            <p v-if="selectedPlan === 'yearly'" class="text-sm text-text-secondary mt-2">
              Facturado como ${{ plans.premium.yearlyPrice }}/año
            </p>
          </div>

          <ul class="space-y-4 mb-8 relative z-10">
            <li 
              v-for="(feature, index) in plans.premium.features" 
              :key="index"
              class="flex items-start space-x-3"
            >
              <CheckIcon class="h-6 w-6 text-accent-teal flex-shrink-0" />
              <span class="text-text-primary font-medium">
                {{ feature.text }}
              </span>
            </li>
          </ul>

          <button
            @click="handleCheckout(selectedPlan)"
            class="w-full py-4 bg-gradient-to-r from-primary to-accent-crimson hover:from-primary-light hover:to-accent-crimson/80 text-white rounded-lg font-bold text-lg transition-all hover:scale-105 shadow-lg relative z-10"
          >
            <template v-if="userStore.currentUser?.isPremium">
              Plan actual
            </template>
            <template v-else>
              Activar Premium
            </template>
          </button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-20 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-text-primary text-center mb-8">Preguntas frecuentes</h2>
        
        <div class="space-y-6">
          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Puedo cancelar en cualquier momento?</h3>
            <p class="text-text-secondary">
              Sí, puedes cancelar tu suscripción en cualquier momento sin penalización. Seguirás teniendo acceso premium hasta el final del período facturado.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Qué métodos de pago aceptan?</h3>
            <p class="text-text-secondary">
              Aceptamos tarjetas de crédito/débito, PayPal y otras opciones de pago locales según tu región.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Puedo cambiar de plan?</h3>
            <p class="text-text-secondary">
              Por supuesto. Puedes actualizar o degradar tu plan en cualquier momento desde la configuración de tu cuenta.
            </p>
          </div>

          <div class="bg-background-card rounded-xl p-6 border border-white/5">
            <h3 class="font-semibold text-text-primary mb-2">¿Hay descuentos para estudiantes?</h3>
            <p class="text-text-secondary">
              Sí, ofrecemos un 30% de descuento para estudiantes con email .edu verificado. Contáctanos para más información.
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
          <span>Sin permanencia</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">💳</span>
          <span>Reembolso 14 días</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">⚡</span>
          <span>Activación instantánea</span>
        </div>
      </div>
    </div>
  </div>
</template>
