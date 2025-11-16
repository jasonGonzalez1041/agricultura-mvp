# 🌱 Agricultura MVP

Sistema de contabilidad agrícola para control de gastos y proyecciones de utilidad de lotes de siembra.

## 📱 Características Principales

- **Mobile-First**: Optimizado para uso en dispositivos móviles
- **Control de Lotes**: Gestión completa de lotes de siembra
- **Control de Gastos**: Registro detallado por categorías (semillas, fertilizantes, mano de obra, etc.)
- **Proyecciones de Utilidad**: Cálculo automático de rentabilidad y ROI
- **Dashboard Intuitivo**: Resumen visual del estado de todos los lotes
- **Acceso en Red Local**: Permite que el cliente vea desde su celular

## 🚀 Setup Rápido

### 1. Instalación
```bash
cd agricultura-mvp
npm install
```

### 2. Configuración de Entorno
```bash
cp .env.example .env.local
```

### 3. Desarrollo Local
```bash
# Para desarrollo normal
npm run dev

# Para acceso desde dispositivos móviles
npm run dev-mobile
```

## 📱 Acceso Móvil para el Cliente

### Opción 1: Script Automatizado
```bash
npm run dev-mobile
```
Este script te mostrará la URL exacta para compartir con el cliente.

### Opción 2: Manual
1. Ejecuta `npm run dev`
2. Encuentra tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
3. Comparte con el cliente: `http://TU_IP_LOCAL:3000`

### Requisitos para Acceso Móvil
- El cliente debe estar en la **misma red WiFi**
- Asegúrate de que el firewall permita conexiones en el puerto 3000

## 🗂️ Estructura del Proyecto

```
agricultura-mvp/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── lotes/             # Gestión de lotes
│   │   ├── gastos/            # Control de gastos
│   │   └── proyecciones/      # Análisis y reportes
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (Button, Card, etc.)
│   │   └── Navigation.tsx    # Navegación mobile-first
│   ├── hooks/                # Custom hooks
│   │   ├── useLotes.ts       # Gestión de lotes
│   │   └── useGastos.ts      # Gestión de gastos
│   ├── types/                # Tipos TypeScript
│   └── utils/                # Utilidades
│       ├── storage.ts        # LocalStorage como DB temporal
│       └── calculations.ts   # Cálculos de proyecciones
├── scripts/
│   └── dev-mobile.js         # Script para acceso móvil
└── package.json
```

## 💾 Almacenamiento de Datos

El MVP utiliza **localStorage** como base de datos temporal. Los datos se guardan automáticamente en el navegador y persisten entre sesiones.

### Categorías de Gastos Incluidas:
- Semillas
- Fertilizantes  
- Pesticidas
- Mano de obra
- Maquinaria
- Combustible
- Agua de riego
- Transporte
- Almacenamiento
- Otros

## 📊 Funcionalidades Implementadas

### Dashboard
- Resumen de lotes totales y hectáreas
- Gastos totales y del mes actual
- Estado de lotes (planificado, sembrado, crecimiento, cosechado)
- Próximas cosechas
- Acciones rápidas

### Gestión de Lotes
- Crear/editar/eliminar lotes
- Seguimiento por estado
- Cálculo automático de días hasta cosecha
- Progreso de crecimiento

### Control de Gastos
- Registro por categoría
- Gastos recurrentes
- Búsqueda y filtrado
- Cálculo de costos por hectárea

### Proyecciones
- Escenarios: optimista, realista, pesimista
- Cálculo de ROI y margen de utilidad
- Punto de equilibrio
- Análisis comparativo entre lotes

## 🛠️ Tecnologías Utilizadas

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos responsivos
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Iconos modernos
- **localStorage** - Persistencia de datos temporal

## 🎨 Diseño Mobile-First

- Navegación adaptable (bottom nav en móvil)
- Componentes optimizados para touch
- Breakpoints responsivos
- Prevención de zoom accidental
- Interfaz intuitiva para agricultura

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo local
npm run dev-mobile   # Desarrollo con acceso de red
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

## 📈 Próximas Mejoras (Roadmap)

- Base de datos real (PostgreSQL/MySQL)
- Autenticación de usuarios
- Subida de imágenes de lotes
- Reportes en PDF
- Notificaciones push
- PWA completo
- Integración con APIs de clima
- Backup en la nube

## 🆘 Soporte

Para problemas o dudas sobre el MVP:

1. **Conexión móvil**: Verificar que están en la misma WiFi
2. **Puerto bloqueado**: Revisar firewall del sistema
3. **Datos perdidos**: Los datos están en localStorage del navegador
4. **Performance**: Usar Chrome o Safari para mejor experiencia

## 📋 Checklist para Demo con Cliente

- [ ] Ejecutar `npm run dev-mobile`
- [ ] Confirmar URL de red local
- [ ] Verificar acceso desde celular del cliente
- [ ] Crear lote de ejemplo
- [ ] Registrar algunos gastos
- [ ] Mostrar proyecciones
- [ ] Explicar navegación móvil

---

**Versión MVP 0.1.0** - Sistema básico funcional para validación con cliente