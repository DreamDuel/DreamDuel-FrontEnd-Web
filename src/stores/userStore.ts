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
  function register(username: string, email: string, password: string) {
    // Crear usuario simulado
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
      followers: []
    };

    currentUser.value = newUser;
    isAuthenticated.value = true;
    
    // Guardar en localStorage
    localStorage.setItem('dreamduel_user', JSON.stringify(newUser));
    localStorage.setItem('dreamduel_auth', 'true');
  }

  function login(email: string, password: string): boolean {
    // Intentar recuperar usuario guardado
    const savedUser = localStorage.getItem('dreamduel_user');
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser);
      isAuthenticated.value = true;
      return true;
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
      currentUser.value = JSON.parse(savedUser);
      isAuthenticated.value = true;
    }
  }

  function updateProfile(updates: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates };
      localStorage.setItem('dreamduel_user', JSON.stringify(currentUser.value));
    }
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

  return {
    currentUser,
    isAuthenticated,
    userInitials,
    register,
    login,
    logout,
    loadUserFromStorage,
    updateProfile,
    addStoryToProfile,
    toggleSaveStory,
    toggleLikeStory,
    toggleFollowUser,
    isFollowing
  };
});
