import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agricultura MVP - Control de Lotes y Proyecciones',
  description: 'Sistema de contabilidad agrícola para control de gastos y proyecciones de utilidad',
  keywords: ['agricultura', 'contabilidad', 'lotes', 'siembra', 'proyecciones', 'utilidad'],
  authors: [{ name: 'Agricultura MVP' }],
  creator: 'Agricultura MVP',
  publisher: 'Agricultura MVP',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // PWA metadata
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // PWA viewport
  viewportFit: 'cover',
  themeColor: '#22c55e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        {/* Preconnect para optimización */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Meta tags adicionales para móvil */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Agricultura MVP" />
        
        {/* Prevent zoom on input focus (iOS) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 text-gray-900 antialiased`}>
        <div className="min-h-full flex flex-col">
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main className="flex-1 pb-20 sm:pb-0">
            {children}
          </main>
        </div>
        
        {/* Scripts adicionales si es necesario */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevenir zoom en iOS cuando se hace doble tap
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  event.preventDefault();
                }
                lastTouchEnd = now;
              }, false);
              
              // Registrar service worker para PWA (futuro)
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(error) {
                    console.log('SW registration failed: ', error);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}