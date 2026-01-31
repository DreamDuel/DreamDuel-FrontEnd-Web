// Pinia Store: User Store
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  stats: {
    storiesCreated: number;
    totalLikes: number;
    followers: number;
    following: number;
  };
  isPremium: boolean;
  createdAt: Date;
  myStories: string[]; // IDs de historias creadas
  savedStories: string[]; // IDs de historias guardadas
  likedStories: string[]; // IDs de historias con like
  following: string[]; // IDs de usuarios que sigo
  followers: string[]; // IDs de seguidores
  // Sistema de créditos y límites
  credits: {
    freeImagesLeft: number; // 3 imágenes gratis al registrarse
    lastImageResetDate: Date; // Para restauración de 12h
    totalImagesGenerated: number;
    referralCode: string; // Código único para invitar amigos
    referralsCount: number; // Amigos invitados
  };
  // Métricas de uso (PQLs)
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
  function register(username: string, email: string, _password: string) {
    // Crear usuario simulado
    const referralCode = `DD${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0099FF&color=fff&size=200`,
      bio: '',
      stats: {
        storiesCreated: 0,
        totalLikes: 0,
        followers: 0,
        following: 0
      },
      isPremium: false,
      createdAt: new Date(),
      myStories: [],
      savedStories: [],
      likedStories: [],
      following: [],
      followers: [],
      credits: {
        freeImagesLeft: 3, // Pack de bienvenida: 3 imágenes gratis
        lastImageResetDate: new Date(),
        totalImagesGenerated: 0,
        referralCode: referralCode,
        referralsCount: 0
      },
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
  }

  function login(emailOrUsername: string, _password: string): boolean {
    // Intentar recuperar usuario guardado
    const savedUser = localStorage.getItem('dreamduel_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      
      // Verificar si coincide el email o el username
      const inputLower = emailOrUsername.toLowerCase();
      const emailMatch = user.email.toLowerCase() === inputLower;
      const usernameMatch = user.username.toLowerCase() === inputLower;
      
      if (emailMatch || usernameMatch) {
        currentUser.value = user;
        isAuthenticated.value = true;
        
        // Sincronizar con storyStore
        setTimeout(async () => {
          const { useStoryStore } = await import('./storyStore');
          const storyStore = useStoryStore();
          if (storyStore.syncUserData) {
            storyStore.syncUserData();
          }
        }, 0);
        
        return true;
      }
    }
    return false;
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('dreamduel_user');
    localStorage.removeItem('dreamduel_auth');
  }

  function loadUserFromStorage() {
    const savedUser = localStorage.getItem('dreamduel_user');
    const savedAuth = localStorage.getItem('dreamduel_auth');
    
    if (savedUser && savedAuth === 'true') {
      const user = JSON.parse(savedUser);
      
      // Inicializar propiedades nuevas si no existen (retrocompatibilidad)
      if (!user.credits) {
        user.credits = {
          freeImagesLeft: 3,
          lastImageResetDate: new Date(),
          totalImagesGenerated: 0,
          referralCode: 'DD' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          referralsCount: 0
        };
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
      if (!user.savedStories) user.savedStories = [];
      if (!user.likedStories) user.likedStories = [];
      
      currentUser.value = user;
      isAuthenticated.value = true;
      
      // Guardar usuario actualizado
      localStorage.setItem('dreamduel_user', JSON.stringify(user));
      
      // Verificar y resetear créditos si es necesario
      setTimeout(() => checkAndResetCredits(), 100);
      
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
      currentUser.value.stats.storiesCreated++;
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function toggleSaveStory(storyId: string) {
    if (currentUser.value) {
      if (!currentUser.value.savedStories) currentUser.value.savedStories = [];
      const index = currentUser.value.savedStories.indexOf(storyId);
      if (index > -1) {
        currentUser.value.savedStories.splice(index, 1);
      } else {
        currentUser.value.savedStories.push(storyId);
      }
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function toggleLikeStory(storyId: string) {
    if (currentUser.value) {
      if (!currentUser.value.likedStories) currentUser.value.likedStories = [];
      const index = currentUser.value.likedStories.indexOf(storyId);
      if (index > -1) {
        currentUser.value.likedStories.splice(index, 1);
        currentUser.value.stats.totalLikes--;
      } else {
        currentUser.value.likedStories.push(storyId);
        currentUser.value.stats.totalLikes++;
      }
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function toggleFollowUser(userId: string) {
    if (currentUser.value) {
      if (!currentUser.value.following) currentUser.value.following = [];
      const index = currentUser.value.following.indexOf(userId);
      
      if (index > -1) {
        // Dejar de seguir
        currentUser.value.following.splice(index, 1);
        currentUser.value.stats.following--;
      } else {
        // Seguir
        currentUser.value.following.push(userId);
        currentUser.value.stats.following++;
      }
      
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
  }

  function isFollowing(userId: string): boolean {
    if (!currentUser.value?.following) return false;
    return currentUser.value.following.includes(userId);
  }

  // Sistema de créditos e imágenes
  function canGenerateImage(): boolean {
    if (!currentUser.value) return false;
    if (currentUser.value.isPremium) return true;
    return currentUser.value.credits?.freeImagesLeft > 0;
  }

  function useImageCredit(): boolean {
    if (!currentUser.value) return false;
    if (currentUser.value.isPremium) return true; // Premium: ilimitado
    
    if (!currentUser.value.credits) return false;
    
    if (currentUser.value.credits.freeImagesLeft > 0) {
      currentUser.value.credits.freeImagesLeft--;
      currentUser.value.credits.totalImagesGenerated++;
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
      return true;
    }
    return false;
  }

  function checkAndResetCredits() {
    if (!currentUser.value || currentUser.value.isPremium || !currentUser.value.credits) return;
    
    const now = new Date();
    const lastReset = new Date(currentUser.value.credits.lastImageResetDate);
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
    
    // Reiniciar a 3 si han pasado 12 horas Y está en 0, O si han pasado más de 12 horas
    if (hoursSinceReset >= 12) {
      if (currentUser.value.credits.freeImagesLeft === 0) {
        currentUser.value.credits.freeImagesLeft = 3;
        currentUser.value.credits.lastImageResetDate = now;
        localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
        console.log('✅ Créditos reiniciados a 3');
      } else if (hoursSinceReset >= 24) {
        // Si han pasado más de 24 horas, forzar reset
        currentUser.value.credits.lastImageResetDate = now;
        localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
      }
    }
  }

  function addReferralBonus() {
    if (!currentUser.value?.credits) return;
    currentUser.value.credits.freeImagesLeft += 3; // +3 imágenes por referido
    currentUser.value.credits.referralsCount++;
    localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
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

  function getTimeUntilReset(): string {
    if (!currentUser.value?.credits?.lastImageResetDate) return '12:00:00';
    
    try {
      const now = new Date();
      const lastReset = new Date(currentUser.value.credits.lastImageResetDate);
      const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);
      const hoursUntilReset = Math.max(0, 12 - hoursSinceReset);
      
      const hours = Math.floor(hoursUntilReset);
      const minutes = Math.floor((hoursUntilReset - hours) * 60);
      const seconds = Math.floor(((hoursUntilReset - hours) * 60 - minutes) * 60);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch {
      return '12:00:00';
    }
  }

  return {
    currentUser,
    isAuthenticated,
    userInitials,
    register,
    login,
    logout,
    loadUserFromStorage,
    updateProfile,
    updateAvatar,
    addStoryToProfile,
    toggleSaveStory,
    toggleLikeStory,
    toggleFollowUser,
    isFollowing,
    canGenerateImage,
    useImageCredit,
    checkAndResetCredits,
    addReferralBonus,
    trackGeneration,
    trackBlurClick,
    trackDownloadAttempt,
    getTimeUntilReset
  };
});
