import { createRouter, createWebHistory } from 'vue-router';

// Views
import LoginView from '@/presentation/views/LoginView.vue';
import RegisterView from '@/presentation/views/RegisterView.vue';
import SplashScreen from '@/presentation/views/SplashScreen.vue';
import OnboardingScreen from '@/presentation/views/OnboardingScreen.vue';
import HomeView from '@/presentation/views/HomeView.vue';
import CreateView from '@/presentation/views/CreateView.vue';
import ProfileView from '@/presentation/views/ProfileView.vue';
import PublicProfileView from '@/presentation/views/PublicProfileView.vue';
import ReaderView from '@/presentation/views/ReaderView.vue';
import SearchView from '@/presentation/views/SearchView.vue';
import SettingsView from '@/presentation/views/SettingsView.vue';
import LoadingScreen from '@/presentation/views/LoadingScreen.vue';
import StoryDetailsView from '@/presentation/views/StoryDetailsView.vue';
import StoryViewerScreen from '@/presentation/views/StoryViewerScreen.vue';
import PricingView from '@/presentation/views/PricingView.vue';
import GuestCreateView from '@/presentation/views/GuestCreateView.vue';
import NicheLandingView from '@/presentation/views/NicheLandingView.vue';
import TermsView from '@/presentation/views/TermsView.vue';
import PrivacyView from '@/presentation/views/PrivacyView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideNavigation: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideNavigation: true }
    },
    {
      path: '/splash',
      name: 'splash',
      component: SplashScreen,
      meta: { hideNavigation: true }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingScreen,
      meta: { hideNavigation: true }
    },
    {
      path: '/',
      name: 'root',
      component: GuestCreateView,
      meta: { hideNavigation: true }
    },
    {
      path: '/guest',
      name: 'guest-create',
      component: GuestCreateView,
      meta: { hideNavigation: true }
    },
    {
      path: '/generador/:niche',
      name: 'niche-landing',
      component: NicheLandingView,
      meta: { hideNavigation: true }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/user/:userId',
      name: 'publicProfile',
      component: PublicProfileView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: PricingView,
      meta: { hideNavigation: true }
    },
    {
      path: '/loading',
      name: 'loading',
      component: LoadingScreen,
      meta: { hideNavigation: true }
    },
    {
      path: '/story-details/:id',
      name: 'story-details',
      component: StoryDetailsView
    },
    {
      path: '/story-viewer/:id',
      name: 'story-viewer',
      component: StoryViewerScreen,
      meta: { hideNavigation: true }
    },
    {
      path: '/story/:id',
      name: 'reader',
      component: ReaderView,
      meta: { hideNavigation: true, fullscreen: true }
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
      meta: { hideNavigation: true }
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
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
