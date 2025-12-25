
import { createRouter, createWebHistory } from "vue-router";
import CategoriasView from "../views/CategoriasView.vue";
import GastosView from "../views/GastosView.vue";
import { useUserStore } from '@/stores/useUserStore'
import LoginView from "@/views/LoginView.vue";

const routes = [
  {
    path: "/categorias",
    name: "Categorias",
    component: CategoriasView,
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
    name: "Gastos",
    component: GastosView,
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
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
