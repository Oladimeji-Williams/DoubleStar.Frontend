// apps/doublestar/src/app/app.routes.ts — full replacement
import { Route } from '@angular/router';
import { authGuard, requireRoles } from '@doublestar/shared';
import { ForbiddenPageComponent, ShellLayoutComponent } from '@doublestar/shell';
import { HomeRedirectComponent } from './home-redirect.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    title: 'Sign in — Double Star Staff',
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
        title: 'Dashboard — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/reporting').then((m) => m.DashboardPageComponent),
      },
      {
        path: 'sales',
        title: 'Sales — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/sales').then((m) => m.SaleListPageComponent),
      },
      {
        path: 'sales/new',
        title: 'New Sale — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/sales').then((m) => m.NewSalePageComponent),
      },
      {
        path: 'repairs',
        title: 'Repairs — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier', 'Technician')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.RepairTicketListPageComponent),
      },
      {
        path: 'repairs/new',
        title: 'New Repair Ticket — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier', 'Technician')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.NewRepairTicketPageComponent),
      },
      {
        path: 'repairs/:id',
        title: 'Repair Ticket — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier', 'Technician')],
        loadComponent: () => import('@doublestar/repairs').then((m) => m.RepairTicketDetailPageComponent),
      },
      {
        path: 'customers',
        title: 'Customers — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/customers').then((m) => m.CustomerListPageComponent),
      },
      {
        path: 'customers/new',
        title: 'New Customer — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/customers').then((m) => m.NewCustomerPageComponent),
      },
      {
        path: 'customers/:id',
        title: 'Customer — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/customers').then((m) => m.CustomerDetailPageComponent),
      },
      {
        path: 'catalog',
        title: 'Catalog — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.ProductListPageComponent),
      },
      {
        path: 'catalog/products/new',
        title: 'New Product — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.NewProductPageComponent),
      },
      {
        path: 'catalog/products/:id',
        title: 'Product — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.ProductDetailPageComponent),
      },
      {
        path: 'catalog/categories',
        title: 'Categories — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.CategoryListPageComponent),
      },
      {
        path: 'catalog/brands',
        title: 'Brands — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/catalog').then((m) => m.BrandListPageComponent),
      },
      {
        path: 'inventory',
        title: 'Inventory — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/inventory').then((m) => m.StockOverviewPageComponent),
      },
      {
        path: 'inventory/restock',
        title: 'Restock — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/inventory').then((m) => m.RestockPageComponent),
      },
      {
        path: 'inventory/:productId',
        title: 'Stock Detail — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/inventory').then((m) => m.ProductStockDetailPageComponent),
      },
      {
        path: 'payments',
        title: 'Payments — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () => import('@doublestar/payments').then((m) => m.PaymentLookupPageComponent),
      },
      {
        path: 'notifications',
        title: 'Notifications — Double Star',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('@doublestar/notifications').then((m) => m.NotificationLogPageComponent),
      },
      {
        path: 'staff',
        title: 'Staff — Double Star',
        canActivate: [requireRoles('Admin')],
        loadComponent: () => import('@doublestar/staff').then((m) => m.StaffListPageComponent),
      },
      {
        path: 'profile',
        title: 'My Profile — Double Star',
        loadComponent: () => import('@doublestar/auth').then((m) => m.ProfilePageComponent),
      },
      {
        path: 'reviews',
        canActivate: [requireRoles('Admin', 'Manager')],
        loadComponent: () => import('./review-moderation-page/review-moderation-page.component').then((m) => m.ReviewModerationPageComponent),
      },
      {
        path: 'security',
        loadComponent: () => import('@doublestar/auth').then((m) => m.SecuritySettingsPageComponent),
      },
      { path: 'forbidden', title: 'Access Denied — Double Star', component: ForbiddenPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];