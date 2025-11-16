'use client';

import React from 'react';
import Link from 'next/link';
import { 
  MapPin,
  Receipt,
  TrendingUp,
  Plus,
  Calendar,
  DollarSign,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useLotes } from '@/hooks/useLotes';
import { useGastos } from '@/hooks/useGastos';
import { calculationUtils } from '@/utils/calculations';

const Dashboard: React.FC = () => {
  const { lotes, loading: loadingLotes } = useLotes();
  const { gastos, loading: loadingGastos } = useGastos();

  if (loadingLotes || loadingGastos) {
    return (
      <div className="container-mobile py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Calcular estadísticas generales
  const estadisticasLotes = lotes.reduce((acc, lote) => {
    acc.totalHectareas += lote.hectareas;
    acc.estados[lote.estado] = (acc.estados[lote.estado] || 0) + 1;
    return acc;
  }, {
    totalHectareas: 0,
    estados: {} as Record<string, number>
  });

  const totalGastos = calculationUtils.calcularGastosTotales(gastos);
  const gastosDelMes = gastos.filter(gasto => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return gasto.fecha >= inicioMes;
  });
  const totalGastosDelMes = calculationUtils.calcularGastosTotales(gastosDelMes);

  // Lotes próximos a cosecha
  const lotesProximosCosecha = lotes
    .filter(lote => {
      const dias = calculationUtils.calcularDiasHastaCosecha(lote.fechaCosechaEstimada);
      return dias <= 30 && dias > 0;
    })
    .sort((a, b) => 
      calculationUtils.calcularDiasHastaCosecha(a.fechaCosechaEstimada) - 
      calculationUtils.calcularDiasHastaCosecha(b.fechaCosechaEstimada)
    );

  return (
    <div className="container-mobile py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Resumen general de tus lotes y proyecciones
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          <Link href="/lotes">Nuevo Lote</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" shadow="md">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lotes</p>
                <p className="text-2xl font-bold text-gray-900">{lotes.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card padding="md" shadow="md">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hectáreas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticasLotes.totalHectareas.toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-earth-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-earth-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card padding="md" shadow="md">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gastos Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculationUtils.formatearMoneda(totalGastos)}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card padding="md" shadow="md">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculationUtils.formatearMoneda(totalGastosDelMes)}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de Lotes */}
        <Card padding="lg" shadow="md">
          <CardHeader>
            <CardTitle>Estado de Lotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(estadisticasLotes.estados).map(([estado, cantidad]) => {
                const iconProps = {
                  planificado: { icon: Clock, color: 'text-gray-500' },
                  sembrado: { icon: Calendar, color: 'text-blue-500' },
                  crecimiento: { icon: TrendingUp, color: 'text-yellow-500' },
                  cosechado: { icon: CheckCircle2, color: 'text-green-500' }
                }[estado] || { icon: AlertCircle, color: 'text-gray-500' };

                const Icon = iconProps.icon;
                
                return (
                  <div key={estado} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${iconProps.color}`} />
                      <span className="font-medium capitalize">
                        {estado.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{cantidad}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lotes Próximos a Cosecha */}
        <Card padding="lg" shadow="md">
          <CardHeader>
            <CardTitle>Próximas Cosechas</CardTitle>
          </CardHeader>
          <CardContent>
            {lotesProximosCosecha.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay cosechas próximas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lotesProximosCosecha.slice(0, 4).map((lote) => {
                  const diasRestantes = calculationUtils.calcularDiasHastaCosecha(lote.fechaCosechaEstimada);
                  
                  return (
                    <div key={lote.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{lote.nombre}</p>
                        <p className="text-sm text-gray-500">{lote.cultivo}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          diasRestantes <= 7 ? 'text-error-600' : 
                          diasRestantes <= 14 ? 'text-warning-600' : 'text-gray-600'
                        }`}>
                          {diasRestantes} días
                        </p>
                        <p className="text-xs text-gray-500">
                          {lote.fechaCosechaEstimada.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="lg" shadow="md">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="secondary" fullWidth>
              <Link href="/lotes" className="flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nuevo Lote</span>
              </Link>
            </Button>
            
            <Button variant="secondary" fullWidth>
              <Link href="/gastos" className="flex items-center justify-center space-x-2">
                <Receipt className="w-4 h-4" />
                <span>Registrar Gasto</span>
              </Link>
            </Button>
            
            <Button variant="secondary" fullWidth>
              <Link href="/proyecciones" className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Ver Reportes</span>
              </Link>
            </Button>
            
            <Button variant="secondary" fullWidth>
              <Link href="/lotes" className="flex items-center justify-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Análisis</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de bienvenida para usuarios nuevos */}
      {lotes.length === 0 && (
        <Card padding="lg" shadow="md">
          <CardContent>
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto mb-6 text-primary-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ¡Bienvenido a Agricultura MVP!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Comienza creando tu primer lote para llevar el control de gastos y proyecciones de utilidad.
              </p>
              <Button size="lg">
                <Link href="/lotes" className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Crear Mi Primer Lote</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;