// apps/doublestar-marketing/src/app/app.config.ts — full replacement
// (merge with yours if it has more than this — the hydration line should already exist from the SEO turn)
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { API_BASE_URL } from '@doublestar/shared';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideClientHydration(withEventReplay()),
  ],
};