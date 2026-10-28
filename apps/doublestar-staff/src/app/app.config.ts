import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import {
  API_BASE_URL,
  APP_KIND,
  AuthService,
  authInterceptor,
  TURNSTILE_SITE_KEY,
} from '@doublestar/shared';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),

    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),

    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl,
    },

    {
      provide: APP_KIND,
      useValue: 'staff',
    },

    {
      provide: TURNSTILE_SITE_KEY,
      useValue: environment.turnstileSiteKey,
    },

    provideAppInitializer(() =>
      firstValueFrom(
        inject(AuthService).restoreSession(),
      ),
    ),
  ],
};