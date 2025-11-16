'use client';

import React, { useState } from 'react';
import { 
  Plus,
  Search,
  MapPin,
  Calendar,
  Sprout,
  TrendingUp,
  Edit2,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, useModal } from '@/components/ui/Modal';
import { useLotes } from '@/hooks/useLotes';
import { useGastos } from '@/hooks/useGastos';
import { calculationUtils } from '@/utils/calculations';
import { Lote } from '@/types/agriculture';

const LotesPage: React.FC = () => {
  const { lotes, loading, crearLote, eliminarLote } = useLotes();
  const { gastos } = useGastos();
  const [busqueda, setBusqueda] = useState('');
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null);
  
  const modalNuevoLote = useModal();
  const modalEliminar = useModal();

  const lotesFiltrados = lotes.filter(lote =>
    lote.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    lote.cultivo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (lote.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const obtenerEstadisticasLote = (lote: Lote) => {
    const gastosLote = gastos.filter(g => g.loteId === lote.id);
    const gastoTotal = calculationUtils.calcularGastosTotales(gastosLote);
    const gastoPorHectarea = calculationUtils.calcularGastoPorHectarea(gastosLote, lote.hectareas);
    const diasHastaCosecha = calculationUtils.calcularDiasHastaCosecha(lote.fechaCosechaEstimada);
    const progreso = calculationUtils.calcularProgresoCrecimiento(lote.fechaSiembra, lote.fechaCosechaEstimada);

    return {
      gastoTotal,
      gastoPorHectarea,
      diasHastaCosecha,
      progreso,
      cantidadGastos: gastosLote.length
    };
  };

  const getEstadoColor = (estado: Lote['estado']) => {
    const colors = {
      planificado: 'bg-gray-100 text-gray-800',
      sembrado: 'bg-blue-100 text-blue-800',
      crecimiento: 'bg-yellow-100 text-yellow-800',
      cosechado: 'bg-green-100 text-green-800'
    };
    return colors[estado];
  };

  const getEstadoIcon = (estado: Lote['estado']) => {
    const icons = {
      planificado: MapPin,
      sembrado: Sprout,
      crecimiento: TrendingUp,
      cosechado: Calendar
    };
    return icons[estado];
  };

  if (loading) {
    return (
      <div className="container-mobile py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestión de Lotes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra tus lotes de siembra y sigue su progreso
          </p>
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={modalNuevoLote.openModal}
        >
          Nuevo Lote
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, cultivo o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Stats rápidas */}
      {lotes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card padding="md">
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{lotes.length}</p>
                <p className="text-sm text-gray-600">Total Lotes</p>
              </div>
            </CardContent>
          </Card>
          
          <Card padding="md">
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {lotes.reduce((acc, lote) => acc + lote.hectareas, 0).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Hectáreas</p>
              </div>
            </CardContent>
          </Card>

          <Card padding="md">
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {lotes.filter(l => l.estado === 'crecimiento').length}
                </p>
                <p className="text-sm text-gray-600">En Crecimiento</p>
              </div>
            </CardContent>
          </Card>

          <Card padding="md">
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(lotes.map(l => l.cultivo)).size}
                </p>
                <p className="text-sm text-gray-600">Cultivos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Lotes */}
      {lotesFiltrados.length === 0 ? (
        <Card padding="lg">
          <CardContent>
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {lotes.length === 0 ? '¡Comienza con tu primer lote!' : 'No se encontraron lotes'}
              </h3>
              <p className="text-gray-600 mb-6">
                {lotes.length === 0 
                  ? 'Crea un lote para comenzar a trackear gastos y proyecciones'
                  : 'Intenta con términos de búsqueda diferentes'
                }
              </p>
              {lotes.length === 0 && (
                <Button 
                  size="lg"
                  leftIcon={<Plus className="w-5 h-5" />}
                  onClick={modalNuevoLote.openModal}
                >
                  Crear Mi Primer Lote
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotesFiltrados.map((lote) => {
            const stats = obtenerEstadisticasLote(lote);
            const EstadoIcon = getEstadoIcon(lote.estado);

            return (
              <Card key={lote.id} padding="none" shadow="md" hover>
                <CardContent>
                  <div className="p-6">
                    {/* Header del card */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <EstadoIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lote.nombre}</h3>
                          <p className="text-sm text-gray-500">{lote.cultivo}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(lote.estado)}`}>
                          {lote.estado.replace('_', ' ')}
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Información básica */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Hectáreas</p>
                        <p className="font-medium">{lote.hectareas} ha</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Ubicación</p>
                        <p className="font-medium">{lote.ubicacion || 'No especificada'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha Siembra</p>
                        <p className="font-medium">{lote.fechaSiembra.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Cosecha Est.</p>
                        <p className="font-medium">{lote.fechaCosechaEstimada.toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Progreso */}
                    {lote.estado !== 'cosechado' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Progreso</span>
                          <span className="font-medium">{stats.progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(stats.progreso, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Estadísticas financieras */}
                    <div className="border-t pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gasto Total</span>
                        <span className="font-medium">{calculationUtils.formatearMoneda(stats.gastoTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Por Hectárea</span>
                        <span className="font-medium">{calculationUtils.formatearMoneda(stats.gastoPorHectarea)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Registros</span>
                        <span className="font-medium">{stats.cantidadGastos} gastos</span>
                      </div>
                      {stats.diasHastaCosecha > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Para Cosecha</span>
                          <span className={`font-medium ${
                            stats.diasHastaCosecha <= 7 ? 'text-error-600' : 
                            stats.diasHastaCosecha <= 30 ? 'text-warning-600' : 'text-gray-900'
                          }`}>
                            {stats.diasHastaCosecha} días
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 mt-4">
                      <Button variant="secondary" size="sm" fullWidth>
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        fullWidth
                        onClick={() => {
                          setLoteSeleccionado(lote);
                          modalEliminar.openModal();
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal para confirmar eliminación */}
      <Modal
        isOpen={modalEliminar.isOpen}
        onClose={modalEliminar.closeModal}
        title="Confirmar Eliminación"
        footer={
          <>
            <Button variant="secondary" onClick={modalEliminar.closeModal} fullWidth>
              Cancelar
            </Button>
            <Button 
              variant="error" 
              onClick={async () => {
                if (loteSeleccionado) {
                  await eliminarLote(loteSeleccionado.id);
                  modalEliminar.closeModal();
                  setLoteSeleccionado(null);
                }
              }}
              fullWidth
            >
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro de que quieres eliminar el lote <strong>{loteSeleccionado?.nombre}</strong>? 
          Esta acción también eliminará todos los gastos y proyecciones asociados.
        </p>
        <p className="text-sm text-error-600 mt-2">
          Esta acción no se puede deshacer.
        </p>
      </Modal>

      {/* Modal para nuevo lote (placeholder) */}
      <Modal
        isOpen={modalNuevoLote.isOpen}
        onClose={modalNuevoLote.closeModal}
        title="Crear Nuevo Lote"
        size="lg"
      >
        <div className="text-center py-8">
          <Sprout className="w-16 h-16 mx-auto mb-4 text-primary-300" />
          <p className="text-gray-600">
            Formulario de creación de lote próximamente...
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default LotesPage;