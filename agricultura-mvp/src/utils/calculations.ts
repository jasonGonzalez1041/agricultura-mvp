// Utilidades para calcular totales y proyecciones
import { Lote, Gasto, Proyeccion, GastoCategoria, ResumenFinanciero } from '@/types/agriculture';

export const calculationUtils = {
  // Calcular total de gastos para un lote
  calcularGastosTotales(gastos: Gasto[]): number {
    return gastos.reduce((total, gasto) => total + gasto.monto, 0);
  },

  // Calcular gastos por categoría
  calcularGastosPorCategoria(gastos: Gasto[]): Record<GastoCategoria, number> {
    const categorias: Record<GastoCategoria, number> = {
      semillas: 0,
      fertilizantes: 0,
      pesticidas: 0,
      mano_obra: 0,
      maquinaria: 0,
      combustible: 0,
      agua_riego: 0,
      transporte: 0,
      almacenamiento: 0,
      otros: 0
    };

    gastos.forEach(gasto => {
      categorias[gasto.categoria] += gasto.monto;
    });

    return categorias;
  },

  // Calcular gastos promedio por hectárea
  calcularGastoPorHectarea(gastos: Gasto[], hectareas: number): number {
    if (hectareas === 0) return 0;
    const total = this.calcularGastosTotales(gastos);
    return total / hectareas;
  },

  // Calcular proyección de ingresos
  calcularProyeccionIngreso(
    rendimientoKgPorHectarea: number,
    precioVentaKg: number,
    hectareas: number
  ): number {
    return rendimientoKgPorHectarea * precioVentaKg * hectareas;
  },

  // Calcular utilidad estimada
  calcularUtilidadEstimada(
    proyeccionIngreso: number,
    gastosTotales: number
  ): number {
    return proyeccionIngreso - gastosTotales;
  },

  // Calcular margen de utilidad (%)
  calcularMargenUtilidad(
    utilidadEstimada: number,
    proyeccionIngreso: number
  ): number {
    if (proyeccionIngreso === 0) return 0;
    return (utilidadEstimada / proyeccionIngreso) * 100;
  },

  // Calcular retorno de inversión (ROI)
  calcularROI(
    utilidadEstimada: number,
    gastosTotales: number
  ): number {
    if (gastosTotales === 0) return 0;
    return (utilidadEstimada / gastosTotales) * 100;
  },

  // Calcular punto de equilibrio (kg necesarios)
  calcularPuntoEquilibrio(
    gastosTotales: number,
    precioVentaKg: number
  ): number {
    if (precioVentaKg === 0) return 0;
    return gastosTotales / precioVentaKg;
  },

  // Generar proyección completa
  generarProyeccion(
    lote: Lote,
    gastos: Gasto[],
    rendimientoEstimado: number,
    precioVentaEstimado: number,
    escenario: 'optimista' | 'realista' | 'pesimista' = 'realista'
  ): Omit<Proyeccion, 'id' | 'createdAt' | 'updatedAt'> {
    // Ajustar rendimiento según escenario
    let rendimientoAjustado = rendimientoEstimado;
    let precioAjustado = precioVentaEstimado;

    switch (escenario) {
      case 'optimista':
        rendimientoAjustado *= 1.2; // 20% mejor
        precioAjustado *= 1.1; // 10% mejor precio
        break;
      case 'pesimista':
        rendimientoAjustado *= 0.8; // 20% peor
        precioAjustado *= 0.9; // 10% peor precio
        break;
      // 'realista' usa los valores originales
    }

    const costosTotales = this.calcularGastosTotales(gastos);
    const ingresoEstimado = this.calcularProyeccionIngreso(
      rendimientoAjustado,
      precioAjustado,
      lote.hectareas
    );
    const utilidadEstimada = this.calcularUtilidadEstimada(ingresoEstimado, costosTotales);
    const margenUtilidad = this.calcularMargenUtilidad(utilidadEstimada, ingresoEstimado);

    return {
      loteId: lote.id,
      rendimientoEstimado: rendimientoAjustado,
      precioVentaEstimado: precioAjustado,
      costosTotales,
      ingresoEstimado,
      utilidadEstimada,
      margenUtilidad,
      fechaProyeccion: new Date(),
      escenario
    };
  },

  // Generar resumen financiero completo
  generarResumenFinanciero(
    gastos: Gasto[],
    proyeccion?: Proyeccion
  ): ResumenFinanciero {
    const totalGastos = this.calcularGastosTotales(gastos);
    const gastosPorCategoria = this.calcularGastosPorCategoria(gastos);
    
    if (!proyeccion) {
      return {
        totalGastos,
        gastosPorCategoria,
        proyeccionIngreso: 0,
        utilidadEstimada: 0,
        margenUtilidad: 0,
        retornoInversion: 0,
        puntoEquilibrio: 0
      };
    }

    const utilidadEstimada = this.calcularUtilidadEstimada(
      proyeccion.ingresoEstimado,
      totalGastos
    );
    const margenUtilidad = this.calcularMargenUtilidad(
      utilidadEstimada,
      proyeccion.ingresoEstimado
    );
    const retornoInversion = this.calcularROI(utilidadEstimada, totalGastos);
    const puntoEquilibrio = this.calcularPuntoEquilibrio(
      totalGastos,
      proyeccion.precioVentaEstimado
    );

    return {
      totalGastos,
      gastosPorCategoria,
      proyeccionIngreso: proyeccion.ingresoEstimado,
      utilidadEstimada,
      margenUtilidad,
      retornoInversion,
      puntoEquilibrio
    };
  },

  // Calcular días hasta cosecha
  calcularDiasHastaCosecha(fechaCosechaEstimada: Date): number {
    const hoy = new Date();
    const diasRestantes = Math.ceil(
      (fechaCosechaEstimada.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, diasRestantes);
  },

  // Calcular progreso de crecimiento (%)
  calcularProgresoCrecimiento(
    fechaSiembra: Date,
    fechaCosechaEstimada: Date
  ): number {
    const hoy = new Date();
    const tiempoTotal = fechaCosechaEstimada.getTime() - fechaSiembra.getTime();
    const tiempoTranscurrido = hoy.getTime() - fechaSiembra.getTime();
    
    if (tiempoTranscurrido <= 0) return 0;
    if (tiempoTranscurrido >= tiempoTotal) return 100;
    
    return Math.round((tiempoTranscurrido / tiempoTotal) * 100);
  },

  // Formatear moneda
  formatearMoneda(monto: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  },

  // Formatear porcentaje
  formatearPorcentaje(valor: number): string {
    return `${valor.toFixed(1)}%`;
  },

  // Formatear número con separadores de miles
  formatearNumero(numero: number): string {
    return new Intl.NumberFormat('es-CR').format(numero);
  }
};