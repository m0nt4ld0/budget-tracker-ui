import { defineStore } from "pinia";
import { monedaApi } from "../api/api";
import type { MonedaDto } from "../types/types";

export const useMonedaStore = defineStore("moneda", {
  state: () => ({
    monedas: [] as MonedaDto[],
    loading: false,
  }),
  actions: {
    async fetchMonedas() {
      this.loading = true;
      try {
        this.monedas = await monedaApi.getMonedas();
      } finally {
        this.loading = false;
      }
    },
  },
});