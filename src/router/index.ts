import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: () => import('@/presentation/views/HomeView.vue')
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
    {
      path: '/images',
      name: 'images',
      component: () => import('@/presentation/views/ImageGeneratorView.vue')
    },
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
