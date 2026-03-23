
import { createRouter, createWebHistory } from "vue-router";
import GastosView from "../views/GastosView.vue";
import GastosDetalleView from "../views/GastosDetalleView.vue";
import { useUserStore } from '@/stores/useUserStore'
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import PreferencesView from "../views/PreferencesView.vue";

const routes = [
  {
    path: "/preferencias",
    name: "Preferencias",
    component: PreferencesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "Budget Tracker",
    component: GastosView,
    meta: { requiresAuth: true },
  },
  {
    path: "/gastos",
    name: "Gastos - Detalle",
    component: GastosDetalleView,
    meta: { requiresAuth: true },
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: "/",
    redirect: "/login"
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (!userStore.token) {
    userStore.loadFromStorage();
  }

  const isAuthenticated = !!userStore.token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.path === "/login" && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});


export default router;
