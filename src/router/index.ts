import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/presentation/views/LoginView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/presentation/views/RegisterView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/splash',
      name: 'splash',
      component: () => import('@/presentation/views/SplashScreen.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/presentation/views/OnboardingScreen.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/',
      name: 'root',
      component: () => import('@/presentation/views/GuestCreateView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/generador/:niche',
      name: 'niche-landing',
      component: () => import('@/presentation/views/NicheLandingView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/presentation/views/HomeView.vue')
    },
    // RUTAS DE HISTORIAS - Comentadas temporalmente (futuro uso)
    // {
    //   path: '/create',
    //   name: 'create',
    //   component: () => import('@/presentation/views/CreateView.vue')
    // },
    {
      path: '/images',
      name: 'images',
      component: () => import('@/presentation/views/ImageGeneratorView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/presentation/views/ProfileView.vue')
    },
    // {
    //   path: '/user/:userId',
    //   name: 'publicProfile',
    //   component: () => import('@/presentation/views/PublicProfileView.vue')
    // },
    // {
    //   path: '/search',
    //   name: 'search',
    //   component: () => import('@/presentation/views/SearchView.vue')
    // },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/presentation/views/SettingsView.vue')
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/presentation/views/PricingView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('@/presentation/views/LoadingScreen.vue'),
      meta: { hideNavigation: true }
    },
    // {
    //   path: '/story-details/:id',
    //   name: 'story-details',
    //   component: () => import('@/presentation/views/StoryDetailsView.vue')
    // },
    // {
    //   path: '/story-viewer/:id',
    //   name: 'story-viewer',
    //   component: () => import('@/presentation/views/StoryViewerScreen.vue'),
    //   meta: { hideNavigation: true }
    // },
    // {
    //   path: '/story/:id',
    //   name: 'reader',
    //   component: () => import('@/presentation/views/ReaderView.vue'),
    //   meta: { hideNavigation: true, fullscreen: true }
    // },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/presentation/views/TermsView.vue'),
      meta: { hideNavigation: true }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/presentation/views/PrivacyView.vue'),
      meta: { hideNavigation: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
