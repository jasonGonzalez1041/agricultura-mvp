#!/usr/bin/env node

const { spawn } = require('child_process');
const ip = require('ip');

// Obtener la IP local
const localIP = ip.address();
const port = process.env.PORT || 3000;

console.log('\n🌱 Agricultura MVP - Desarrollo Móvil\n');
console.log('📱 Configuración para acceso móvil:');
console.log(`   Local:   http://localhost:${port}`);
console.log(`   Red:     http://${localIP}:${port}`);
console.log('\n🔗 Para acceder desde tu celular:');
console.log(`   1. Conecta tu celular a la misma red WiFi`);
console.log(`   2. Abre el navegador en: http://${localIP}:${port}`);
console.log('\n📋 Para compartir con el cliente:');
console.log(`   Envía esta URL: http://${localIP}:${port}`);
console.log('\n─'.repeat(50));

// Ejecutar Next.js con la configuración de red
const nextProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', port], {
  stdio: 'inherit',
  shell: true
});

// Manejar señales para cerrar limpiamente
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit(0);
});

nextProcess.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`\n✅ Servidor cerrado con código: ${code}`);
  process.exit(code);
});