import { useState, useEffect, useCallback } from 'react';
import { Gasto, GastoFormData, GastoCategoria } from '@/types/agriculture';
import { gastosStorage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useGastos = (loteId?: string) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar gastos al montar el componente
  useEffect(() => {
    try {
      const gastosGuardados = loteId 
        ? gastosStorage.getByLoteId(loteId)
        : gastosStorage.getAll();
      setGastos(gastosGuardados);
    } catch (err) {
      setError('Error al cargar los gastos');
      console.error('Error loading gastos:', err);
    } finally {
      setLoading(false);
    }
  }, [loteId]);

  // Crear nuevo gasto
  const crearGasto = useCallback(async (loteIdParam: string, data: GastoFormData): Promise<Gasto> => {
    try {
      const nuevoGasto: Gasto = {
        id: uuidv4(),
        loteId: loteIdParam,
        categoria: data.categoria,
        descripcion: data.descripcion,
        monto: data.monto,
        fecha: new Date(data.fecha),
        proveedor: data.proveedor,
        unidad: data.unidad,
        cantidad: data.cantidad,
        precioUnitario: data.cantidad ? data.monto / data.cantidad : undefined,
        esRecurrente: data.esRecurrente,
        frecuenciaRecurrencia: data.frecuenciaRecurrencia,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      gastosStorage.save(nuevoGasto);
      
      // Solo actualizar el estado si el gasto pertenece al lote actual
      if (!loteId || loteIdParam === loteId) {
        setGastos(prev => [...prev, nuevoGasto]);
      }
      
      return nuevoGasto;
    } catch (err) {
      setError('Error al crear el gasto');
      throw err;
    }
  }, [loteId]);

  // Actualizar gasto existente
  const actualizarGasto = useCallback(async (id: string, data: Partial<GastoFormData>): Promise<Gasto> => {
    try {
      const gastoExistente = gastos.find(g => g.id === id);
      if (!gastoExistente) {
        throw new Error('Gasto no encontrado');
      }

      const gastoActualizado: Gasto = {
        ...gastoExistente,
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : gastoExistente.fecha,
        precioUnitario: data.cantidad && data.monto 
          ? data.monto / data.cantidad 
          : gastoExistente.precioUnitario,
        updatedAt: new Date()
      };

      gastosStorage.save(gastoActualizado);
      setGastos(prev => prev.map(g => g.id === id ? gastoActualizado : g));
      return gastoActualizado;
    } catch (err) {
      setError('Error al actualizar el gasto');
      throw err;
    }
  }, [gastos]);

  // Eliminar gasto
  const eliminarGasto = useCallback(async (id: string): Promise<void> => {
    try {
      const eliminado = gastosStorage.delete(id);
      if (eliminado) {
        setGastos(prev => prev.filter(g => g.id !== id));
      } else {
        throw new Error('No se pudo eliminar el gasto');
      }
    } catch (err) {
      setError('Error al eliminar el gasto');
      throw err;
    }
  }, []);

  // Obtener gastos por categoría
  const obtenerGastosPorCategoria = useCallback((categoria: GastoCategoria): Gasto[] => {
    return gastos.filter(g => g.categoria === categoria);
  }, [gastos]);

  // Obtener gastos en un rango de fechas
  const obtenerGastosPorFecha = useCallback((fechaInicio: Date, fechaFin: Date): Gasto[] => {
    return gastos.filter(g => 
      g.fecha >= fechaInicio && g.fecha <= fechaFin
    );
  }, [gastos]);

  // Calcular total de gastos
  const calcularTotalGastos = useCallback((): number => {
    return gastos.reduce((total, gasto) => total + gasto.monto, 0);
  }, [gastos]);

  // Calcular gastos por categoría
  const calcularGastosPorCategoria = useCallback((): Record<GastoCategoria, number> => {
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
  }, [gastos]);

  // Obtener gastos recientes
  const obtenerGastosRecientes = useCallback((limite: number = 5): Gasto[] => {
    return [...gastos]
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      .slice(0, limite);
  }, [gastos]);

  // Buscar gastos
  const buscarGastos = useCallback((termino: string): Gasto[] => {
    const terminoLower = termino.toLowerCase();
    return gastos.filter(g => 
      g.descripcion.toLowerCase().includes(terminoLower) ||
      g.categoria.toLowerCase().includes(terminoLower) ||
      (g.proveedor?.toLowerCase().includes(terminoLower))
    );
  }, [gastos]);

  // Obtener estadísticas de gastos
  const obtenerEstadisticas = useCallback(() => {
    const totalGastos = calcularTotalGastos();
    const gastosPorCategoria = calcularGastosPorCategoria();
    const promedioGasto = gastos.length > 0 ? totalGastos / gastos.length : 0;
    
    // Categoría con mayor gasto
    const categoriaMayorGasto = Object.entries(gastosPorCategoria)
      .reduce((max, [categoria, monto]) => 
        monto > max.monto ? { categoria: categoria as GastoCategoria, monto } : max, 
        { categoria: 'otros' as GastoCategoria, monto: 0 }
      );

    // Gastos del mes actual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    
    const gastosDelMes = obtenerGastosPorFecha(inicioMes, new Date());
    const totalGastosDelMes = gastosDelMes.reduce((total, gasto) => total + gasto.monto, 0);

    return {
      totalGastos,
      cantidadGastos: gastos.length,
      promedioGasto,
      gastosPorCategoria,
      categoriaMayorGasto,
      totalGastosDelMes,
      cantidadGastosDelMes: gastosDelMes.length
    };
  }, [gastos, calcularTotalGastos, calcularGastosPorCategoria, obtenerGastosPorFecha]);

  // Generar gastos recurrentes (simulación para MVP)
  const generarGastosRecurrentes = useCallback(() => {
    const gastosRecurrentes = gastos.filter(g => g.esRecurrente);
    const nuevosGastos: Gasto[] = [];

    gastosRecurrentes.forEach(gasto => {
      // Lógica simple para generar próximo gasto recurrente
      let proximaFecha = new Date(gasto.fecha);
      
      switch (gasto.frecuenciaRecurrencia) {
        case 'semanal':
          proximaFecha.setDate(proximaFecha.getDate() + 7);
          break;
        case 'mensual':
          proximaFecha.setMonth(proximaFecha.getMonth() + 1);
          break;
        case 'estacional':
          proximaFecha.setMonth(proximaFecha.getMonth() + 3);
          break;
      }

      // Solo agregar si la fecha es futura y no existe ya
      if (proximaFecha > new Date()) {
        const existeGasto = gastos.some(g => 
          g.descripcion === gasto.descripcion && 
          Math.abs(g.fecha.getTime() - proximaFecha.getTime()) < 86400000 // 1 día
        );

        if (!existeGasto) {
          const nuevoGasto: Gasto = {
            ...gasto,
            id: uuidv4(),
            fecha: proximaFecha,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          nuevosGastos.push(nuevoGasto);
        }
      }
    });

    return nuevosGastos;
  }, [gastos]);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    gastos,
    loading,
    error,
    crearGasto,
    actualizarGasto,
    eliminarGasto,
    obtenerGastosPorCategoria,
    obtenerGastosPorFecha,
    calcularTotalGastos,
    calcularGastosPorCategoria,
    obtenerGastosRecientes,
    buscarGastos,
    obtenerEstadisticas,
    generarGastosRecurrentes,
    limpiarError
  };
};