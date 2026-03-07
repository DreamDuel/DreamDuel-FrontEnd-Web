<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const confirming = ref(true);
const success = ref(false);
const error = ref('');

const API_URL = import.meta.env.VITE_API_URL || 'https://dreamduel-backend-web.onrender.com/api';

onMounted(async () => {
  // PayPal regresa con ?token=XXXXX en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('token');
  const sessionId = localStorage.getItem('guest_session_id');

  console.log('🔍 Payment Success - Order ID:', orderId);
  console.log('🔍 Payment Success - Session ID:', sessionId);

  if (!orderId || !sessionId) {
    error.value = 'Información de pago incompleta';
    confirming.value = false;
    setTimeout(() => router.push('/'), 3000);
    return;
  }

  try {
    // Confirmar pago con el backend
    const response = await fetch(`${API_URL}/payments/guest/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        sessionId: sessionId
      })
    });

    if (!response.ok) {
      throw new Error('Error al confirmar el pago');
    }

    const data = await response.json();
    console.log('✅ Pago confirmado:', data);
    
    success.value = true;
    confirming.value = false;

    // Redirigir al generador después de 2 segundos
    setTimeout(() => {
      router.push('/images');
    }, 2000);
    
  } catch (err) {
    console.error('❌ Error confirmando pago:', err);
    error.value = 'Error al confirmar el pago. Contacta a soporte.';
    confirming.value = false;
    
    // Redirigir después de mostrar error
    setTimeout(() => {
      router.push('/');
    }, 4000);
  }
});
</script>

<template>
  <div class="min-h-screen bg-background-deep flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <!-- Loading State -->
      <div v-if="confirming" class="space-y-6">
        <div class="animate-spin rounded-full h-20 w-20 border-b-4 border-primary mx-auto"></div>
        <h1 class="text-2xl font-bold text-text-primary">Confirmando pago...</h1>
        <p class="text-text-secondary">Por favor espera mientras procesamos tu transacción</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="space-y-6 animate-fade-in">
        <CheckCircleIcon class="h-20 w-20 text-accent-teal mx-auto" />
        <h1 class="text-3xl font-bold text-text-primary">✅ ¡Pago Exitoso!</h1>
        <p class="text-text-secondary text-lg">
          Tu pago ha sido confirmado. Ahora puedes generar tu imagen.
        </p>
        <p class="text-text-tertiary text-sm">Redirigiendo al generador...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-6 animate-fade-in">
        <XCircleIcon class="h-20 w-20 text-error mx-auto" />
        <h1 class="text-3xl font-bold text-error">Error en el Pago</h1>
        <p class="text-text-secondary text-lg">{{ error }}</p>
        <p class="text-text-tertiary text-sm">Redirigiendo al inicio...</p>
      </div>
    </div>
  </div>
</template>
