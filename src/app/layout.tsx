import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const atkinson = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TataCare — Cuidar bajo un mismo techo',
    template: '%s · TataCare',
  },
  description:
    'Todo lo que tu familia necesita saber sobre la persona que cuida: ficha médica, remedios, alergias, contactos de emergencia y bitácora diaria, en un solo lugar.',
  applicationName: 'TataCare',
  appleWebApp: {
    capable: true,
    title: 'TataCare',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#faf6ef',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={atkinson.variable}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-pino focus:px-4 focus:py-3 focus:font-bold focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
