import axios from "axios";
import type { CategoriaDto, GastoDto } from "../types/types";
import type { AuthResponseDto } from "@/types/types";
import { useUserStore } from "@/stores/useUserStore";

import type { InternalAxiosRequestConfig } from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();

    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const userStore = useUserStore();
      userStore.logout();

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export const authApi = {
  async login(payload: { username: string }): Promise<AuthResponseDto> {
    const response = await api.post<AuthResponseDto>("/auth/login", payload);
    return response.data;
  },
};

export const categoriaApi = {
  getCategorias: async () => {
    const res = await api.get<CategoriaDto[]>("/categorias");
    return res.data;
  },
  crearCategoria: async (dto: CategoriaDto) => {
    const res = await api.post<CategoriaDto>("/categorias/crear", dto);
    return res.data;
  },
};

export const gastoApi = {
  getGastos: async (
    page = 0,
    size = 10,
    fechaDesde?: string,
    fechaHasta?: string
  ) => {
    const res = await api.get<{
      content: GastoDto[];
      totalElements: number;
    }>("/gastos/", {
      params: { page, size, fechaDesde, fechaHasta },
    });
    return res.data;
  },

  crearGasto: async (dto: GastoDto) => {
    const res = await api.post<GastoDto>("/gastos/crear", dto);
    return res.data;
  },

  getTotalesPorCategoria: async (fechaDesde: string, fechaHasta: string) => {
    const res = await api.get<Record<string, number>>(
      "/gastos/por-categoria",
      { params: { fechaDesde, fechaHasta } }
    );
    return res.data;
  },
};

export function logout() {
  const userStore = useUserStore();
  userStore.logout();
}

export default api;
