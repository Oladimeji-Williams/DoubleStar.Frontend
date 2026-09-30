// apps/doublestar/src/app/app.routes.ts — full replacement (register, my/sales, my/repairs removed)
import { Route } from '@angular/router';
import { authGuard, requireRoles } from '@doublestar/shared';
import { ForbiddenPageComponent, ShellLayoutComponent } from '@doublestar/shell';
import { HomeRedirectComponent } from './home-redirect.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@doublestar/auth').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', component: HomeRedirectComponent },
      {
        path: 'dashboard',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/reporting').then((m) => m.DashboardPageComponent),
      },
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
        path: 'catalog/products/:id',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.ProductDetailPageComponent),
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
      {
        path: 'inventory',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/inventory').then((m) => m.StockOverviewPageComponent),
      },
      {
        path: 'inventory/restock',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/inventory').then((m) => m.RestockPageComponent),
      },
      {
        path: 'inventory/:productId',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/inventory').then((m) => m.ProductStockDetailPageComponent),
      },
      {
        path: 'payments',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/payments').then((m) => m.PaymentLookupPageComponent),
      },
      {
        path: 'notifications',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/notifications').then((m) => m.NotificationLogPageComponent),
      },
      {
        path: 'staff',
        canActivate: [requireRoles('Admin')],
        loadComponent: () => import('@doublestar/staff').then((m) => m.StaffListPageComponent),
      },
      { path: 'forbidden', component: ForbiddenPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];