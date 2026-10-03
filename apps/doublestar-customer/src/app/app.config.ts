// apps/doublestar-customer/src/app/app.config.ts
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL, AuthService, authInterceptor } from '@doublestar/shared';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { APP_KIND } from '@doublestar/shared';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { TURNSTILE_SITE_KEY } from '@doublestar/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: APP_KIND, useValue: 'customer' },
    { provide: TURNSTILE_SITE_KEY, useValue: environment.turnstileSiteKey },
    provideAppInitializer(() =>
      firstValueFrom(inject(AuthService).restoreSession()),
    ),
  ],
};
