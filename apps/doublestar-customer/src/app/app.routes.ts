// apps/doublestar-customer/src/app/app.routes.ts
import { Route } from '@angular/router';
import { authGuard, requireRoles } from '@doublestar/shared';
import { ForbiddenPageComponent } from '@doublestar/shell';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@doublestar/auth').then((m) => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('@doublestar/auth').then((m) => m.RegisterPageComponent),
  },
  {
    path: '',
    component: CustomerLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'my/sales' },
      {
        path: 'my/sales',
        canActivate: [requireRoles('Customer')],
        loadComponent: () => import('@doublestar/sales').then((m) => m.MySalesPageComponent),
      },
      {
        path: 'my/repairs',
        canActivate: [requireRoles('Customer')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.MyRepairsPageComponent),
      },
      { path: 'forbidden', component: ForbiddenPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];