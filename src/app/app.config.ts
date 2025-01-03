import { ApplicationConfig, isDevMode, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects'; 
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects'; 

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { themeReducer } from './store/theme/theme.reducer';
import { spinnerReducer } from './store/spinner/spinner.reducer';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),

    // NgRx Store and DevTools
    provideStore({ user: userReducer, theme: themeReducer, spinner: spinnerReducer, }),
    provideStoreDevtools({
      maxAge: 25, 
      logOnly: !isDevMode(), 
      autoPause: true,
    }),

    // NgRx Effects
    provideEffects(UserEffects), 

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideAuth(() => getAuth()),

    // Registrar idioma español
    { provide: LOCALE_ID, useValue: 'es' },
  ]
  
};