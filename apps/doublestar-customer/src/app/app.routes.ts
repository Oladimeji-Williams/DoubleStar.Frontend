import { Route } from '@angular/router';
import { authGuard, requireRoles } from '@doublestar/shared';
import { ForbiddenPageComponent } from '@doublestar/shell';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { ProductsPageComponent } from './products-page/products-page.component';

export const appRoutes: Route[] = [
  {
    path: 'products',
    component: ProductsPageComponent,
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-detail-page/product-detail-page.component').then(
        (m) => m.ProductDetailPageComponent,
      ),
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./reviews-page/reviews-page.component').then(
        (m) => m.ReviewsPageComponent,
      ),
  },

  // Shared authentication pages
  {
    path: 'login',
    title: 'Sign in — Double Star',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'register',
    title: 'Create an Account — Double Star',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.RegisterPageComponent,
      ),
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password — Double Star',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.ForgotPasswordPageComponent,
      ),
  },

  // Customer-specific authentication flow
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.ResetPasswordPageComponent,
      ),
  },
  {
    path: 'email-signin',
    loadComponent: () =>
      import('./email-signin-page/email-signin-page.component').then(
        (m) => m.EmailSigninPageComponent,
      ),
  },

  {
    path: '',
    component: CustomerLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my/sales',
      },
      {
        path: 'my/sales',
        title: 'My Orders — Double Star',
        canActivate: [requireRoles('Customer')],
        loadComponent: () =>
          import('@doublestar/sales').then(
            (m) => m.MySalesPageComponent,
          ),
      },
      {
        path: 'my/repairs',
        title: 'My Repairs — Double Star',
        canActivate: [requireRoles('Customer')],
        loadComponent: () =>
          import('@doublestar/repairs').then(
            (m) => m.MyRepairsPageComponent,
          ),
      },
      {
        path: 'request-repair',
        title: 'Request a Repair — Double Star',
        canActivate: [requireRoles('Customer')],
        loadComponent: () =>
          import(
            './request-repair-page/request-repair-page.component'
          ).then(
            (m) => m.RequestRepairPageComponent,
          ),
      },
      {
        path: 'profile',
        title: 'My Profile — Double Star',
        loadComponent: () =>
          import('@doublestar/auth').then(
            (m) => m.ProfilePageComponent,
          ),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('@doublestar/auth').then(
            (m) => m.SecuritySettingsPageComponent,
          ),
      },
      {
        path: 'forbidden',
        title: 'Access Denied — Double Star',
        component: ForbiddenPageComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];