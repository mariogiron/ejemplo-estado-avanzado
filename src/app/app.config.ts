import { provideHttpClient, withFetch } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {
  ApplicationConfig,
  isDevMode,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { enviarPedido } from './cesta/cesta.effects';
import { cestaFeature } from './cesta/cesta.reducer';

// Precios con formato español: 18,90 €
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: 'es' },
    // El Store, con una rama de estado: la cesta
    provideStore(),
    provideState(cestaFeature),
    // Los efectos: lo que no puede hacer un reducer, como hablar con la API
    provideEffects({ enviarPedido }),
    // La conexión con la extensión Redux DevTools del navegador
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
