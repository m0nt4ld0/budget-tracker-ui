import { defineStore } from "pinia";
import type { AuthResponseDto } from "@/types/types";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    token: "",
    nombre: "",
    imagenUrl: "",
    activo: false,
  }),

  actions: {
    login(auth: AuthResponseDto) {
      this.username = auth.username;
      this.token = auth.token;
      this.nombre = auth.nombre;
      this.imagenUrl = auth.imagenUrl;
      this.activo = auth.activo;

      localStorage.setItem("auth", JSON.stringify(auth));
    },

    logout() {
      this.username = "";
      this.token = "";
      this.nombre = "";
      this.imagenUrl = "";
      this.activo = false;

      localStorage.removeItem("auth");
    },

    loadFromStorage() {
      const raw = localStorage.getItem("auth");
      if (!raw) return;

      const auth: AuthResponseDto = JSON.parse(raw);

      this.username = auth.username;
      this.token = auth.token;
      this.nombre = auth.nombre;
      this.imagenUrl = auth.imagenUrl;
      this.activo = auth.activo;
    },
  },
});
