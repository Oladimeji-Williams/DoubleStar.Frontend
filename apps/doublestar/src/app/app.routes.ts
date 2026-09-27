// apps/doublestar/src/app/app.routes.ts — full replacement
import { Route } from '@angular/router';
import { authGuard, requireRoles } from '@doublestar/shared';
import { ShellLayoutComponent, DashboardPageComponent } from '@doublestar/shell';

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
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      {
        path: 'sales',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/sales').then((m) => m.SaleListPageComponent),
      },
      {
        path: 'sales/new',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/sales').then((m) => m.NewSalePageComponent),
      },
      {
        path: 'repairs',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier', 'Technician')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.RepairTicketListPageComponent),
      },
      {
        path: 'repairs/new',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier', 'Technician')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.NewRepairTicketPageComponent),
      },
      {
        path: 'repairs/:id',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier', 'Technician')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.RepairTicketDetailPageComponent),
      },

        {
            path: 'payments',
            canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
            loadComponent: () => import('@doublestar/payments').then((m) => m.PaymentLookupPageComponent),
        },

        {
        path: 'customers',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/customers').then((m) => m.CustomerListPageComponent),
        },
        {
        path: 'customers/new',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/customers').then((m) => m.NewCustomerPageComponent),
        },
        {
        path: 'customers/:id',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/customers').then((m) => m.CustomerDetailPageComponent),
        },
        {
        path: 'catalog',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.ProductListPageComponent),
        },
        {
        path: 'catalog/products/new',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.NewProductPageComponent),
        },
        {
        path: 'catalog/categories',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.CategoryListPageComponent),
        },
        {
        path: 'catalog/brands',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.BrandListPageComponent),
        },
    ],
  },
];