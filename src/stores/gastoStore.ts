// src/stores/gastoStore.ts
import { defineStore } from "pinia";
import { gastoApi } from "../api/api";
import type { GastoDto } from "../types/types";

export const useGastoStore = defineStore("gasto", {
  state: () => ({
    gastos: [] as GastoDto[],
    loading: false,
  }),
  actions: {
    async fetchGastos(fechaDesde?: string, fechaHasta?: string) {
      this.loading = true;
      try {
        const data = await gastoApi.getGastos(fechaDesde, fechaHasta);
        this.gastos = data.content;
      } finally {
        this.loading = false;
      }
    },
    async crearGasto(dto: GastoDto) {
      const nuevo = await gastoApi.crearGasto(dto);
      this.gastos.push(nuevo);
    },
  },
});
