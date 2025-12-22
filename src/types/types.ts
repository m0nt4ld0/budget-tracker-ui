export interface CategoriaDto {
  id: number;
  categoria: string;
  activo?: boolean;
}

export interface GastoDto {
  id?: number;
  fecha: string;
  categoria: CategoriaDto;
  concepto: string;
  importe: number;
}
