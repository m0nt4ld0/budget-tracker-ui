
import { defineStore } from "pinia";
import { categoriaApi } from "../api/api";
import type { CategoriaDto } from "../types/types";

export const useCategoriaStore = defineStore("categoria", {
  state: () => ({
    categorias: [] as CategoriaDto[],
    loading: false,
  }),
  actions: {
    async fetchCategorias() {
      this.loading = true;
      try {
        this.categorias = await categoriaApi.getCategorias();
      } finally {
        this.loading = false;
      }
    },
    async crearCategoria(dto: CategoriaDto) {
      const nueva = await categoriaApi.crearCategoria(dto);
      this.categorias.push(nueva);
    },
  },
});
