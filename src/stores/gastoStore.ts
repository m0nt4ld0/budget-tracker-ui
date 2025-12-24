import { defineStore } from "pinia";
import { gastoApi } from "../api/api";
import type { GastoDto } from "../types/types";

export const useGastoStore = defineStore("gasto", {
  state: () => ({
    gastos: [] as GastoDto[],
    page: 0,
    size: 10,
    totalPages: 0,
  }),
  actions: {
    async fetchGastos() {
      const response = await gastoApi.getGastos(this.page, this.size);
      this.gastos = response.content;
      this.totalPages = Math.ceil(response.totalElements / this.size);
    },
    async crearGasto(gasto: GastoDto) {
      await gastoApi.crearGasto(gasto);
      await this.fetchGastos();
    },
  },
});
