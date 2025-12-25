import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import type { CategoriaDto, GastoDto } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("Error 403: No autorizado o token inválido");
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async ({ username }: { username: string }) => {
    try {
      const res = await api.post<string>("/auth/login", { username });
      const token = res.data;
      if (!token) throw new Error("Token no recibido desde el servidor");
      localStorage.setItem("token", token);
      return token;
    } catch (err) {
      console.error("Error en login:", err);
      throw err;
    }
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
    }>("/gastos/", { params: { page, size, fechaDesde, fechaHasta } });
    return res.data;
  },

  crearGasto: async (dto: GastoDto) => {
    const res = await api.post<GastoDto>("/gastos/crear", dto);
    return res.data;
  },

  getTotalesPorCategoria: async (fechaDesde: string, fechaHasta: string) => {
    const res = await api.get<Record<string, number>>("/gastos/por-categoria", {
      params: { fechaDesde, fechaHasta },
    });
    return res.data;
  },
};

export function logout() {
  localStorage.removeItem("token");
}

export default api;
