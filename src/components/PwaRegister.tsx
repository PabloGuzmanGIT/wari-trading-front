'use client';

import { useEffect } from 'react';

export const PwaRegister: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if ('serviceWorker' in navigator && (window as any).workbox === undefined) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((reg) => {
              console.log('Service Worker registrado con éxito:', reg.scope);
            })
            .catch((err) => {
              console.error('Error al registrar el Service Worker:', err);
            });
        });
      }
    } else {
      // En desarrollo, desregistrar automáticamente el service worker anterior
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then(() => {
              console.log('Service Worker de desarrollo eliminado con éxito.');
            });
          }
        });
      }
    }
  }, []);

  return null;
};
