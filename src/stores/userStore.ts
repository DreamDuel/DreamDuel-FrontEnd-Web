// Pinia Store: User Store
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthService } from '@/infrastructure/services/AuthService';

const authService = new AuthService();

interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  createdAt: Date;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  hasUsedFreeGeneration: boolean; // Primera imagen gratis
  totalImagesGenerated: number;
  createdAt: Date;
  myStories: string[]; // IDs de historias creadas (comentado - futuro uso)
  myImages: GeneratedImage[]; // Imágenes generadas
  // Métricas de uso
  usageMetrics: {
    generationsToday: number;
    blurClicksToday: number;
    downloadAttempts: number;
    lastActivityDate: Date;
    isHighIntent: boolean; // true si >5 generaciones/hora
  };
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Getters
  const userInitials = computed(() => {
    if (!currentUser.value) return '';
    return currentUser.value.username.substring(0, 2).toUpperCase();
  });

  // Actions
  async function register(username: string, email: string, password: string) {
    try {
      // Llamar al backend para registrar
      const response = await authService.register({ username, email, password });
      
      // Crear usuario desde la respuesta del backend
      const newUser: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        avatarUrl: response.user.avatarUrl,
        hasUsedFreeGeneration: false,
        totalImagesGenerated: 0,
        createdAt: new Date(),
        myStories: [],
        myImages: [],
        usageMetrics: {
          generationsToday: 0,
          blurClicksToday: 0,
          downloadAttempts: 0,
          lastActivityDate: new Date(),
          isHighIntent: false
        }
      };

      currentUser.value = newUser;
      isAuthenticated.value = true;
      
      // Guardar en localStorage
      localStorage.setItem('dreamduel_user', JSON.stringify(newUser));
      localStorage.setItem('dreamduel_auth', 'true');
      
      // Sincronizar con storyStore
      setTimeout(async () => {
        const { useStoryStore } = await import('./storyStore');
        const storyStore = useStoryStore();
        if (storyStore.syncUserData) {
          storyStore.syncUserData();
        }
      }, 0);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Detectar errores de cuenta duplicada
      const errorMsg = error.message?.toLowerCase() || '';
      
      if (errorMsg.includes('already exists') || 
          errorMsg.includes('ya existe') || 
          errorMsg.includes('already registered') ||
          errorMsg.includes('duplicate') ||
          errorMsg.includes('duplicado') ||
          errorMsg.includes('email already') ||
          errorMsg.includes('username already')) {
        return { success: false, error: 'ACCOUNT_EXISTS' };
      }
      
      return { success: false, error: error.message || 'Error al registrarse' };
    }
  }

  async function login(emailOrUsername: string, password: string) {
    try {
      // Llamar al backend para login
      const response = await authService.login({ emailOrUsername, password });
      
      // Crear usuario desde la respuesta del backend
      const user: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        avatarUrl: response.user.avatarUrl,
        hasUsedFreeGeneration: false,
        totalImagesGenerated: 0,
        createdAt: new Date(),
        myStories: [],
        myImages: [],
        usageMetrics: {
          generationsToday: 0,
          blurClicksToday: 0,
          downloadAttempts: 0,
          lastActivityDate: new Date(),
          isHighIntent: false
        }
      };
      
      currentUser.value = user;
      isAuthenticated.value = true;
      
      // Guardar en localStorage
      localStorage.setItem('dreamduel_user', JSON.stringify(user));
      localStorage.setItem('dreamduel_auth', 'true');
      
      // Sincronizar con storyStore
      setTimeout(async () => {
        const { useStoryStore } = await import('./storyStore');
        const storyStore = useStoryStore();
        if (storyStore.syncUserData) {
          storyStore.syncUserData();
        }
      }, 0);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error en login:', error);
      return { success: false, error: error.message || 'Credenciales incorrectas' };
    }
  }

  async function loginWithGoogle(googleToken: string) {
    try {
      console.log('🔵 userStore.loginWithGoogle() START');
      console.log('🔵 Token recibido:', googleToken.substring(0, 50) + '...');
      
      // Llamar al backend con el Google token
      await authService.loginWithGoogle(googleToken);
      console.log('✅ authService.loginWithGoogle() exitoso');
      
      // El backend devuelve access_token, necesitamos obtener los datos del usuario
      console.log('🔵 Obteniendo datos del usuario...');
      const userData = await authService.getCurrentUser();
      console.log('✅ Datos del usuario obtenidos:', userData);
      
      // Crear usuario desde la respuesta del backend
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        hasUsedFreeGeneration: false,
        totalImagesGenerated: 0,
        createdAt: new Date(),
        myStories: [],
        myImages: [],
        usageMetrics: {
          generationsToday: 0,
          blurClicksToday: 0,
          downloadAttempts: 0,
          lastActivityDate: new Date(),
          isHighIntent: false
        }
      };
      
      currentUser.value = user;
      isAuthenticated.value = true;
      
      // Guardar en localStorage
      localStorage.setItem('dreamduel_user', JSON.stringify(user));
      localStorage.setItem('dreamduel_auth', 'true');
      
      // Sincronizar con storyStore
      setTimeout(async () => {
        const { useStoryStore } = await import('./storyStore');
        const storyStore = useStoryStore();
        if (storyStore.syncUserData) {
          storyStore.syncUserData();
        }
      }, 0);
      
      console.log('✅ Login con Google completado exitosamente');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Error en Google login:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      return { success: false, error: error.message || 'Error al iniciar sesión con Google' };
    }
  }

  async function logout() {
    try {
      // Llamar al backend para logout
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Siempre limpiar datos locales aunque falle el backend
      currentUser.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem('dreamduel_user');
      localStorage.removeItem('dreamduel_auth');
      localStorage.removeItem('authToken');
    }
  }

  function loadUserFromStorage() {
    const savedUser = localStorage.getItem('dreamduel_user');
    const savedAuth = localStorage.getItem('dreamduel_auth');
    
    if (savedUser && savedAuth === 'true') {
      const user = JSON.parse(savedUser);
      
      // Migrar de sistema antiguo (créditos) a nuevo (pago por imagen)
      if (user.credits !== undefined) {
        // Si tenía créditos, considerar que ya usó su imagen gratis
        user.hasUsedFreeGeneration = user.credits.freeImagesLeft < 3;
        user.totalImagesGenerated = user.credits.totalImagesGenerated || 0;
        delete user.credits; // Eliminar sistema antiguo
        delete user.isPremium; // Eliminar sistema premium
      }
      
      // Eliminar propiedades de red social si existen
      if (user.stats !== undefined) delete user.stats;
      if (user.followers !== undefined) delete user.followers;
      if (user.following !== undefined) delete user.following;
      if (user.savedStories !== undefined) delete user.savedStories;
      if (user.likedStories !== undefined) delete user.likedStories;
      
      // Inicializar propiedades nuevas si no existen
      if (user.hasUsedFreeGeneration === undefined) {
        user.hasUsedFreeGeneration = false;
      }
      if (user.totalImagesGenerated === undefined) {
        user.totalImagesGenerated = 0;
      }
      
      if (!user.usageMetrics) {
        user.usageMetrics = {
          generationsToday: 0,
          blurClicksToday: 0,
          downloadAttempts: 0,
          lastActivityDate: new Date(),
          isHighIntent: false
        };
      }
      
      // Inicializar arrays si no existen
      if (!user.myStories) user.myStories = [];
      if (!user.myImages) user.myImages = [];
      
      currentUser.value = user;
      isAuthenticated.value = true;
      
      // Guardar usuario actualizado
      localStorage.setItem('dreamduel_user', JSON.stringify(user));
      
      // Sincronizar con storyStore
      // Nota: Hacemos esto de forma diferida para evitar dependencias circulares
      setTimeout(async () => {
        const { useStoryStore } = await import('./storyStore');
        const storyStore = useStoryStore();
        if (storyStore.syncUserData) {
          storyStore.syncUserData();
        }
      }, 0);
    }
  }

  function updateProfile(updates: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates };
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function updateAvatar(imageFile: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!currentUser.value) {
        reject(new Error('Debes iniciar sesión para cambiar tu foto de perfil'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const avatarUrl = e.target?.result as string;
          if (avatarUrl && currentUser.value) {
            currentUser.value.avatarUrl = avatarUrl;
            localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
            resolve(avatarUrl);
          } else {
            reject(new Error('No se pudo leer la imagen'));
          }
        } catch (err) {
          reject(new Error('Error al procesar la imagen'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo de imagen'));
      };
      
      try {
        reader.readAsDataURL(imageFile);
      } catch (err) {
        reject(new Error('No se pudo cargar la imagen'));
      }
    });
  }

  function addStoryToProfile(storyId: string) {
    if (currentUser.value) {
      if (!currentUser.value.myStories) currentUser.value.myStories = [];
      currentUser.value.myStories.push(storyId);
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function addImageToProfile(imageUrl: string, prompt: string, negativePrompt?: string) {
    if (currentUser.value) {
      if (!currentUser.value.myImages) currentUser.value.myImages = [];
      const newImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        imageUrl,
        prompt,
        negativePrompt,
        createdAt: new Date()
      };
      currentUser.value.myImages.unshift(newImage); // Agregar al inicio
      currentUser.value.totalImagesGenerated++;
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function deleteImage(imageId: string) {
    if (currentUser.value?.myImages) {
      const index = currentUser.value.myImages.findIndex(img => img.id === imageId);
      if (index > -1) {
        currentUser.value.myImages.splice(index, 1);
        localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
      }
    }
  }

  // Sistema de pago por imagen
  function canGenerateFreeImage(): boolean {
    if (!currentUser.value) return false;
    return !currentUser.value.hasUsedFreeGeneration;
  }

  function useFreeGeneration(): boolean {
    if (!currentUser.value) return false;
    
    if (!currentUser.value.hasUsedFreeGeneration) {
      currentUser.value.hasUsedFreeGeneration = true;
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
      return true;
    }
    return false;
  }

  function purchaseImageGeneration(): Promise<boolean> {
    // Aquí iría la integración con pasarela de pago (Stripe, PayPal, etc.)
    return new Promise((resolve) => {
      // Simulación: En producción, esto llamaría al backend para procesar el pago
      console.log('💳 Procesando pago por generación de imagen...');
      
      // Simular delay de procesamiento
      setTimeout(() => {
        // En producción, esto retornaría true solo si el pago fue exitoso
        resolve(true);
      }, 1000);
    });
  }

  // Métricas de uso y PQLs
  function trackGeneration() {
    if (!currentUser.value?.usageMetrics) return;
    currentUser.value.usageMetrics.generationsToday++;
    currentUser.value.usageMetrics.lastActivityDate = new Date();
    
    // Detectar alta intención (>5 generaciones en poco tiempo)
    if (currentUser.value.usageMetrics.generationsToday >= 5) {
      currentUser.value.usageMetrics.isHighIntent = true;
    }
    localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
  }

  function trackBlurClick() {
    if (!currentUser.value?.usageMetrics) return;
    currentUser.value.usageMetrics.blurClicksToday++;
    localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
  }

  function trackDownloadAttempt() {
    if (!currentUser.value?.usageMetrics) return;
    currentUser.value.usageMetrics.downloadAttempts++;
    localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
  }

  return {
    currentUser,
    isAuthenticated,
    userInitials,
    register,
    login,
    loginWithGoogle,
    logout,
    loadUserFromStorage,
    updateProfile,
    updateAvatar,
    addStoryToProfile,
    addImageToProfile,
    deleteImage,
    canGenerateFreeImage,
    useFreeGeneration,
    purchaseImageGeneration,
    trackGeneration,
    trackBlurClick,
    trackDownloadAttempt
  };
});
