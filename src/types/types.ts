import type { HeroIconName } from "@/icons/heroIcons";

export type TipoMovimiento = "EGRESO" | "INGRESO";

export interface MonedaDto {
  id: number;
  codMoneda: string;
  descMoneda: string;
}

export interface MovimientoDto {
  id?: number;
  fecha: string;
  categoria: CategoriaDto;
  concepto: string;
  importe: number;
  tipoMovimiento: TipoMovimiento;
  moneda: MonedaDto;
}

export interface CategoriaDto {
  id: number;
  categoria: string;
  icono: HeroIconName;
  tipoMovimiento?: TipoMovimiento;
  activo?: boolean;
}

export interface GastoDto {
  id?: number;
  fecha: string;
  categoria: CategoriaDto;
  concepto: string;
  importe: number;
}

export interface AuthResponseDto {
  username: string;
  token: string;
  nombre: string;
  imagenUrl: string;
  activo: boolean;
}
