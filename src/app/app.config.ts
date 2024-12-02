import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),

    // NgRx Store and DevTools
    provideStore({ user: userReducer, theme: themeReducer }),
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
    provideAuth(() => getAuth())
  ]
};