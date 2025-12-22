
import axios from "axios";
import type { CategoriaDto, GastoDto } from "../types/types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const categoriaApi = {
  getCategorias: () => api.get<CategoriaDto[]>("/categorias/").then(res => res.data),
  crearCategoria: (dto: CategoriaDto) => api.post<CategoriaDto>("/categorias/crear", dto).then(res => res.data),
};

export const gastoApi = {
  getGastos: (fechaDesde?: string, fechaHasta?: string) => 
    api.get<{ content: GastoDto[]; totalElements: number }>("/gastos/", { params: { fechaDesde, fechaHasta } }).then(res => res.data),
  
  crearGasto: (dto: GastoDto) => api.post<GastoDto>("/gastos/crear", dto).then(res => res.data),
};

export default api;
