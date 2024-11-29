/* eslint-disable prettier/prettier */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginPage from '@/views/Login.vue';
import SettingsView from '@/views/Settings.vue';
import AdvertisementsView from '@/views/AdvertisementsView.vue';
import AdvertisementDetail from '../views/AdvertisementDetail.vue';
import AdminPage from '../views/AdminPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }, // Indique que cette route nécessite une authentification
  },
  {
    path: '/advertisements',
    name: 'AdvertisementsPage',
    component: AdvertisementsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/advertisement/:id', // Route expects an "id" param
    name: 'advertisementDetail',
    component: AdvertisementDetail,
    props: true,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/Settings',
    name: 'SettingsPage',
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/signup',
    name: 'SignUpPage',
    component: () =>
      import(/* webpackChunkName: "signup" */ '../views/SignUp.vue'),
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard pour protéger les routes nécessitant une authentification
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifie si le token est présent

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ name: 'LoginPage' }); // Redirige vers la page de login
  } else if (to.name === 'LoginPage' && isAuthenticated) {
    // Si l'utilisateur est déjà authentifié et tente d'accéder à la page de login
    next({ name: 'home' }); // Redirige vers la page d'accueil
  } else {
    next(); // Continue la navigation
  }
});

export default router;
