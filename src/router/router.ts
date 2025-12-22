
import { createRouter, createWebHistory } from "vue-router";
import CategoriasView from "../views/CategoriasView.vue";
import GastosView from "../views/GastosView.vue";

const routes = [
  {
    path: "/categorias",
    name: "Categorias",
    component: CategoriasView,
  },
  {
    path: "/gastos",
    name: "Gastos",
    component: GastosView,
  },
  {
    path: "/",
    redirect: "/gastos",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
