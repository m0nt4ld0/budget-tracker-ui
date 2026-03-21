import { defineStore } from "pinia";
import { gastoApi } from "@/api/api";
import type { GastoDto } from "@/types/types";

export const useGastoStore = defineStore("gasto", {
  state: () => ({
    gastos: [] as GastoDto[],
    page: 0,
    size: 5,
    totalPages: 0,

    totalesPorCategoria: {} as Record<string, number>,
    totalesPorCategoriaAnterior: {} as Record<string, number>,
  }),

  actions: {
    async fetchGastos() {
      const response = await gastoApi.getGastos(this.page, this.size);
      this.gastos = response.content;
      this.totalPages = Math.ceil(response.totalElements / this.size);
    },

    async fetchTotalesMesAnterior() {
      const now = new Date();
      const primerDia = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const ultimoDia = new Date(now.getFullYear(), now.getMonth(), 0);
      const fmt = (d: Date) => d.toISOString().split("T")[0];
      this.totalesPorCategoriaAnterior =
        await gastoApi.getTotalesPorCategoria(fmt(primerDia), fmt(ultimoDia));
    },

    async fetchTotalesPorCategoria(
      fechaDesde: string,
      fechaHasta: string
    ) {
      this.totalesPorCategoria =
        await gastoApi.getTotalesPorCategoria(fechaDesde, fechaHasta);
    },

    async crearGasto(gasto: GastoDto) {
      await gastoApi.crearGasto(gasto);
      await this.fetchGastos();
    },
  },
});
