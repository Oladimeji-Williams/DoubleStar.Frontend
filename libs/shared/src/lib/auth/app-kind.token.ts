// libs/shared/src/lib/auth/app-kind.token.ts
import { InjectionToken } from '@angular/core';
export type AppKind = 'staff' | 'customer';
export const APP_KIND = new InjectionToken<AppKind>('APP_KIND');