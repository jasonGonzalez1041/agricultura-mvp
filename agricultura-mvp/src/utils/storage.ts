// Utilidades para localStorage como base de datos temporal del MVP
import { Lote, Gasto, Proyeccion } from '@/types/agriculture';

const STORAGE_KEYS = {
  LOTES: 'agricultura_lotes',
  GASTOS: 'agricultura_gastos',
  PROYECCIONES: 'agricultura_proyecciones',
  SETTINGS: 'agricultura_settings'
} as const;

// Funciones genéricas de almacenamiento
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Solo limpiar las claves de nuestra aplicación
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Funciones específicas para lotes
export const lotesStorage = {
  getAll(): Lote[] {
    const lotes = storage.get<Lote[]>(STORAGE_KEYS.LOTES, []);
    return lotes.map(lote => ({
      ...lote,
      fechaSiembra: new Date(lote.fechaSiembra),
      fechaCosechaEstimada: new Date(lote.fechaCosechaEstimada),
      createdAt: new Date(lote.createdAt),
      updatedAt: new Date(lote.updatedAt)
    }));
  },

  getById(id: string): Lote | null {
    const lotes = this.getAll();
    return lotes.find(lote => lote.id === id) || null;
  },

  save(lote: Lote): void {
    const lotes = this.getAll();
    const existingIndex = lotes.findIndex(l => l.id === lote.id);
    
    if (existingIndex >= 0) {
      lotes[existingIndex] = { ...lote, updatedAt: new Date() };
    } else {
      lotes.push({ ...lote, createdAt: new Date(), updatedAt: new Date() });
    }
    
    storage.set(STORAGE_KEYS.LOTES, lotes);
  },

  delete(id: string): boolean {
    const lotes = this.getAll();
    const filteredLotes = lotes.filter(lote => lote.id !== id);
    
    if (filteredLotes.length !== lotes.length) {
      storage.set(STORAGE_KEYS.LOTES, filteredLotes);
      // También eliminar gastos y proyecciones asociados
      gastosStorage.deleteByLoteId(id);
      proyeccionesStorage.deleteByLoteId(id);
      return true;
    }
    
    return false;
  }
};

// Funciones específicas para gastos
export const gastosStorage = {
  getAll(): Gasto[] {
    const gastos = storage.get<Gasto[]>(STORAGE_KEYS.GASTOS, []);
    return gastos.map(gasto => ({
      ...gasto,
      fecha: new Date(gasto.fecha),
      createdAt: new Date(gasto.createdAt),
      updatedAt: new Date(gasto.updatedAt)
    }));
  },

  getByLoteId(loteId: string): Gasto[] {
    const gastos = this.getAll();
    return gastos.filter(gasto => gasto.loteId === loteId);
  },

  getById(id: string): Gasto | null {
    const gastos = this.getAll();
    return gastos.find(gasto => gasto.id === id) || null;
  },

  save(gasto: Gasto): void {
    const gastos = this.getAll();
    const existingIndex = gastos.findIndex(g => g.id === gasto.id);
    
    if (existingIndex >= 0) {
      gastos[existingIndex] = { ...gasto, updatedAt: new Date() };
    } else {
      gastos.push({ ...gasto, createdAt: new Date(), updatedAt: new Date() });
    }
    
    storage.set(STORAGE_KEYS.GASTOS, gastos);
  },

  delete(id: string): boolean {
    const gastos = this.getAll();
    const filteredGastos = gastos.filter(gasto => gasto.id !== id);
    
    if (filteredGastos.length !== gastos.length) {
      storage.set(STORAGE_KEYS.GASTOS, filteredGastos);
      return true;
    }
    
    return false;
  },

  deleteByLoteId(loteId: string): void {
    const gastos = this.getAll();
    const filteredGastos = gastos.filter(gasto => gasto.loteId !== loteId);
    storage.set(STORAGE_KEYS.GASTOS, filteredGastos);
  }
};

// Funciones específicas para proyecciones
export const proyeccionesStorage = {
  getAll(): Proyeccion[] {
    const proyecciones = storage.get<Proyeccion[]>(STORAGE_KEYS.PROYECCIONES, []);
    return proyecciones.map(proyeccion => ({
      ...proyeccion,
      fechaProyeccion: new Date(proyeccion.fechaProyeccion),
      createdAt: new Date(proyeccion.createdAt),
      updatedAt: new Date(proyeccion.updatedAt)
    }));
  },

  getByLoteId(loteId: string): Proyeccion[] {
    const proyecciones = this.getAll();
    return proyecciones.filter(proyeccion => proyeccion.loteId === loteId);
  },

  getLatestByLoteId(loteId: string): Proyeccion | null {
    const proyecciones = this.getByLoteId(loteId);
    if (proyecciones.length === 0) return null;
    
    return proyecciones.sort((a, b) => 
      b.fechaProyeccion.getTime() - a.fechaProyeccion.getTime()
    )[0];
  },

  save(proyeccion: Proyeccion): void {
    const proyecciones = this.getAll();
    const existingIndex = proyecciones.findIndex(p => p.id === proyeccion.id);
    
    if (existingIndex >= 0) {
      proyecciones[existingIndex] = { ...proyeccion, updatedAt: new Date() };
    } else {
      proyecciones.push({ ...proyeccion, createdAt: new Date(), updatedAt: new Date() });
    }
    
    storage.set(STORAGE_KEYS.PROYECCIONES, proyecciones);
  },

  delete(id: string): boolean {
    const proyecciones = this.getAll();
    const filteredProyecciones = proyecciones.filter(proyeccion => proyeccion.id !== id);
    
    if (filteredProyecciones.length !== proyecciones.length) {
      storage.set(STORAGE_KEYS.PROYECCIONES, filteredProyecciones);
      return true;
    }
    
    return false;
  },

  deleteByLoteId(loteId: string): void {
    const proyecciones = this.getAll();
    const filteredProyecciones = proyecciones.filter(proyeccion => proyeccion.loteId !== loteId);
    storage.set(STORAGE_KEYS.PROYECCIONES, filteredProyecciones);
  }
};