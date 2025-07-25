import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    
    // Animations
    importProvidersFrom(BrowserAnimationsModule),
    
    // Service Worker for PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    
    // NgRx Store
    provideStore(),
    provideEffects(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
}).catch(err => {
  console.error('Error starting application:', err);
  
  // Show fallback error message
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
      <h1>Error al cargar Ideas Claras</h1>
      <p>Ha ocurrido un error al iniciar la aplicación.</p>
      <p>Por favor, recarga la página o contacta al soporte técnico.</p>
      <button onclick="window.location.reload()" style="
        background: #007bff; 
        color: white; 
        border: none; 
        padding: 10px 20px; 
        border-radius: 5px; 
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
      ">
        Recargar página
      </button>
    </div>
  `;
  
  document.body.innerHTML = '';
  document.body.appendChild(errorDiv);
});