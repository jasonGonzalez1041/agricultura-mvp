#!/bin/bash

echo "🌱 Configurando Agricultura MVP..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio agricultura-mvp/"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Crear archivo de entorno
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creando archivo de configuración..."
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado"
else
    echo "ℹ️  Archivo .env.local ya existe"
fi

# Dar permisos al script de desarrollo móvil
chmod +x scripts/dev-mobile.js

echo ""
echo "✅ ¡Setup completado!"
echo ""
echo "🚀 Para iniciar el servidor:"
echo "   npm run dev          # Desarrollo local"
echo "   npm run dev-mobile   # Acceso desde dispositivos móviles"
echo ""
echo "📱 El script dev-mobile te mostrará la URL para compartir con el cliente"
echo ""