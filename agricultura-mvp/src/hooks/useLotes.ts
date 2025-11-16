import { useState, useEffect, useCallback } from 'react';
import { Lote, LoteFormData } from '@/types/agriculture';
import { lotesStorage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useLotes = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar lotes al montar el componente
  useEffect(() => {
    try {
      const lotesGuardados = lotesStorage.getAll();
      setLotes(lotesGuardados);
    } catch (err) {
      setError('Error al cargar los lotes');
      console.error('Error loading lotes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo lote
  const crearLote = useCallback(async (data: LoteFormData): Promise<Lote> => {
    try {
      const nuevoLote: Lote = {
        id: uuidv4(),
        nombre: data.nombre,
        hectareas: data.hectareas,
        cultivo: data.cultivo,
        fechaSiembra: new Date(data.fechaSiembra),
        fechaCosechaEstimada: new Date(data.fechaCosechaEstimada),
        estado: 'planificado',
        ubicacion: data.ubicacion,
        notas: data.notas,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      lotesStorage.save(nuevoLote);
      setLotes(prev => [...prev, nuevoLote]);
      return nuevoLote;
    } catch (err) {
      setError('Error al crear el lote');
      throw err;
    }
  }, []);

  // Actualizar lote existente
  const actualizarLote = useCallback(async (id: string, data: Partial<LoteFormData>): Promise<Lote> => {
    try {
      const loteExistente = lotes.find(l => l.id === id);
      if (!loteExistente) {
        throw new Error('Lote no encontrado');
      }

      const loteActualizado: Lote = {
        ...loteExistente,
        ...data,
        fechaSiembra: data.fechaSiembra ? new Date(data.fechaSiembra) : loteExistente.fechaSiembra,
        fechaCosechaEstimada: data.fechaCosechaEstimada 
          ? new Date(data.fechaCosechaEstimada) 
          : loteExistente.fechaCosechaEstimada,
        updatedAt: new Date()
      };

      lotesStorage.save(loteActualizado);
      setLotes(prev => prev.map(l => l.id === id ? loteActualizado : l));
      return loteActualizado;
    } catch (err) {
      setError('Error al actualizar el lote');
      throw err;
    }
  }, [lotes]);

  // Actualizar estado del lote
  const actualizarEstadoLote = useCallback(async (id: string, estado: Lote['estado']): Promise<void> => {
    try {
      const loteExistente = lotes.find(l => l.id === id);
      if (!loteExistente) {
        throw new Error('Lote no encontrado');
      }

      const loteActualizado: Lote = {
        ...loteExistente,
        estado,
        updatedAt: new Date()
      };

      lotesStorage.save(loteActualizado);
      setLotes(prev => prev.map(l => l.id === id ? loteActualizado : l));
    } catch (err) {
      setError('Error al actualizar el estado del lote');
      throw err;
    }
  }, [lotes]);

  // Eliminar lote
  const eliminarLote = useCallback(async (id: string): Promise<void> => {
    try {
      const eliminado = lotesStorage.delete(id);
      if (eliminado) {
        setLotes(prev => prev.filter(l => l.id !== id));
      } else {
        throw new Error('No se pudo eliminar el lote');
      }
    } catch (err) {
      setError('Error al eliminar el lote');
      throw err;
    }
  }, []);

  // Obtener lote por ID
  const obtenerLote = useCallback((id: string): Lote | undefined => {
    return lotes.find(l => l.id === id);
  }, [lotes]);

  // Filtrar lotes por estado
  const filtrarPorEstado = useCallback((estado: Lote['estado']): Lote[] => {
    return lotes.filter(l => l.estado === estado);
  }, [lotes]);

  // Buscar lotes por nombre o cultivo
  const buscarLotes = useCallback((termino: string): Lote[] => {
    const terminoLower = termino.toLowerCase();
    return lotes.filter(l => 
      l.nombre.toLowerCase().includes(terminoLower) ||
      l.cultivo.toLowerCase().includes(terminoLower) ||
      (l.ubicacion?.toLowerCase().includes(terminoLower))
    );
  }, [lotes]);

  // Obtener estadísticas generales
  const obtenerEstadisticas = useCallback(() => {
    const totalLotes = lotes.length;
    const totalHectareas = lotes.reduce((acc, lote) => acc + lote.hectareas, 0);
    const lotesPorEstado = lotes.reduce((acc, lote) => {
      acc[lote.estado] = (acc[lote.estado] || 0) + 1;
      return acc;
    }, {} as Record<Lote['estado'], number>);
    
    const cultivosUnicos = new Set(lotes.map(l => l.cultivo));

    return {
      totalLotes,
      totalHectareas,
      lotesPorEstado,
      cultivosUnicos: Array.from(cultivosUnicos),
      totalCultivos: cultivosUnicos.size
    };
  }, [lotes]);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    lotes,
    loading,
    error,
    crearLote,
    actualizarLote,
    actualizarEstadoLote,
    eliminarLote,
    obtenerLote,
    filtrarPorEstado,
    buscarLotes,
    obtenerEstadisticas,
    limpiarError
  };
};