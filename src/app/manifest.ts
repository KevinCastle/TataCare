import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TataCare — Cuidar bajo un mismo techo',
    short_name: 'TataCare',
    description:
      'Ficha médica, remedios, contactos de emergencia y bitácora diaria de tu adulto mayor, compartida entre cuidadores.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#faf6ef',
    theme_color: '#faf6ef',
    lang: 'es',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
