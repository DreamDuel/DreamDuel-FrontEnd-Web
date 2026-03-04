<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();
const username = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  if (!username.value || !email.value || !password.value) {
    alert('Por favor completa todos los campos');
    return;
  }

  isLoading.value = true;
  
  setTimeout(() => {
    userStore.register(username.value, email.value, password.value);
    isLoading.value = false;
    router.push('/home');
  }, 500);
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 px-4">
    <div class="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <h1 class="text-3xl font-bold text-white mb-8 text-center">Crear Cuenta</h1>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-gray-300 mb-2 text-sm">Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            required
            class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div>
          <label class="block text-gray-300 mb-2 text-sm">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label class="block text-gray-300 mb-2 text-sm">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50 transition-all mt-6"
        >
          {{ isLoading ? 'Creando cuenta...' : 'Registrarse' }}
        </button>

        <button 
          type="button"
          @click="router.push('/login')"
          class="w-full py-3 text-gray-400 hover:text-white transition-colors"
        >
          Ya tengo cuenta
        </button>
      </form>
    </div>
  </div>
</template>
