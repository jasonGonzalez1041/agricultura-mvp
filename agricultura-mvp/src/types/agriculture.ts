// Tipos principales para el sistema de agricultura

export interface Lote {
  id: string;
  nombre: string;
  hectareas: number;
  cultivo: string;
  fechaSiembra: Date;
  fechaCosechaEstimada: Date;
  estado: 'planificado' | 'sembrado' | 'crecimiento' | 'cosechado';
  ubicacion?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Gasto {
  id: string;
  loteId: string;
  categoria: GastoCategoria;
  descripcion: string;
  monto: number;
  fecha: Date;
  proveedor?: string;
  unidad?: string;
  cantidad?: number;
  precioUnitario?: number;
  esRecurrente?: boolean;
  frecuenciaRecurrencia?: 'semanal' | 'mensual' | 'estacional';
  createdAt: Date;
  updatedAt: Date;
}

export type GastoCategoria = 
  | 'semillas'
  | 'fertilizantes'
  | 'pesticidas'
  | 'mano_obra'
  | 'maquinaria'
  | 'combustible'
  | 'agua_riego'
  | 'transporte'
  | 'almacenamiento'
  | 'otros';

export interface Proyeccion {
  id: string;
  loteId: string;
  rendimientoEstimado: number; // kg por hectárea
  precioVentaEstimado: number; // precio por kg
  costosTotales: number;
  ingresoEstimado: number;
  utilidadEstimada: number;
  margenUtilidad: number; // porcentaje
  fechaProyeccion: Date;
  escenario: 'optimista' | 'realista' | 'pesimista';
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResumenFinanciero {
  totalGastos: number;
  gastosPorCategoria: Record<GastoCategoria, number>;
  proyeccionIngreso: number;
  utilidadEstimada: number;
  margenUtilidad: number;
  retornoInversion: number;
  puntoEquilibrio: number; // kg necesarios para cubrir costos
}

// Tipos para formularios
export interface LoteFormData {
  nombre: string;
  hectareas: number;
  cultivo: string;
  fechaSiembra: string;
  fechaCosechaEstimada: string;
  ubicacion?: string;
  notas?: string;
}

export interface GastoFormData {
  categoria: GastoCategoria;
  descripcion: string;
  monto: number;
  fecha: string;
  proveedor?: string;
  unidad?: string;
  cantidad?: number;
  esRecurrente?: boolean;
  frecuenciaRecurrencia?: 'semanal' | 'mensual' | 'estacional';
}

export interface ProyeccionFormData {
  rendimientoEstimado: number;
  precioVentaEstimado: number;
  escenario: 'optimista' | 'realista' | 'pesimista';
  notas?: string;
}

// Tipos para estadísticas y análisis
export interface EstadisticasLote {
  gastoTotal: number;
  gastoPromedioPorHectarea: number;
  proyeccionUtilidad: number;
  diasHastaCosecha: number;
  progresoCrecimiento: number; // porcentaje
}

export interface TendenciaGasto {
  periodo: string;
  monto: number;
  categoria: GastoCategoria;
}

export interface ComparacionLotes {
  loteId: string;
  nombre: string;
  utilidadPorHectarea: number;
  eficienciaCosto: number;
  rendimientoEstimado: number;
}