import { Routes } from '@angular/router';
import { authGuard, requireRoles } from '@doublestar/shared';
import { ForbiddenPageComponent } from '@doublestar/shell';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
import { ProductsPageComponent } from './products-page/products-page.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      {
        path: 'products',
        title: 'Products — Double Star',
        component: ProductsPageComponent,
      },
      {
        path: 'products/:id',
        title: 'Product — Double Star',
        loadComponent: () =>
          import('./product-detail-page/product-detail-page.component').then(
            (m) => m.ProductDetailPageComponent,
          ),
      },
      {
        path: 'reviews',
        title: 'Reviews — Double Star',
        loadComponent: () =>
          import('./reviews-page/reviews-page.component').then(
            (m) => m.ReviewsPageComponent,
          ),
      },
      {
        path: 'login',
        title: 'Sign in — Double Star',
        loadComponent: () =>
          import('@doublestar/auth').then((m) => m.LoginPageComponent),
      },
      {
        path: 'register',
        title: 'Create an Account — Double Star',
        loadComponent: () =>
          import('@doublestar/auth').then((m) => m.RegisterPageComponent),
      },
      {
        path: 'forgot-password',
        title: 'Forgot Password — Double Star',
        loadComponent: () =>
          import('@doublestar/auth').then((m) => m.ForgotPasswordPageComponent),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('@doublestar/auth').then((m) => m.ResetPasswordPageComponent),
      },
      {
        path: 'email-signin',
        loadComponent: () =>
          import('./email-signin-page/email-signin-page.component').then(
            (m) => m.EmailSigninPageComponent,
          ),
      },
      {
        path: 'confirm-email',
        loadComponent: () =>
          import('./confirm-email-page/confirm-email-page.component').then(
            (m) => m.ConfirmEmailPageComponent,
          ),
      },
      {
        path: '',
        canActivate: [authGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'my/orders' },
          {
            path: 'cart',
            title: 'Your cart — Double Star',
            loadComponent: () => import('@doublestar/orders').then((m) => m.CartPageComponent),
          },
          {
            path: 'checkout/callback',
            title: 'Payment status — Double Star',
            loadComponent: () =>
              import('@doublestar/orders').then((m) => m.CheckoutCallbackPageComponent),
          },
          {
            path: 'checkout',
            title: 'Checkout — Double Star',
            loadComponent: () => import('@doublestar/orders').then((m) => m.CheckoutPageComponent),
          },
          {
            path: 'my/orders',
            title: 'My Orders — Double Star',
            canActivate: [requireRoles('Customer')],
            loadComponent: () =>
              import('@doublestar/orders').then((m) => m.MyOrdersPageComponent),
          },
          {
            path: 'my/orders/:id',
            title: 'Order — Double Star',
            canActivate: [requireRoles('Customer')],
            loadComponent: () =>
              import('@doublestar/orders').then((m) => m.MyOrderDetailPageComponent),
          },
          {
            path: 'my/sales',
            title: 'In-store Purchases — Double Star',
            canActivate: [requireRoles('Customer')],
            loadComponent: () =>
              import('@doublestar/sales').then((m) => m.MySalesPageComponent),
          },
          {
            path: 'my/repairs',
            title: 'My Repairs — Double Star',
            canActivate: [requireRoles('Customer')],
            loadComponent: () =>
              import('@doublestar/repairs').then((m) => m.MyRepairsPageComponent),
          },
          {
            path: 'request-repair',
            title: 'Request a Repair — Double Star',
            canActivate: [requireRoles('Customer')],
            loadComponent: () =>
              import('./request-repair-page/request-repair-page.component').then(
                (m) => m.RequestRepairPageComponent,
              ),
          },
          {
            path: 'profile',
            title: 'My Profile — Double Star',
            loadComponent: () =>
              import('@doublestar/auth').then((m) => m.ProfilePageComponent),
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
    ],
  },
  { path: '**', redirectTo: 'products' },
];
