import { Route } from '@angular/router';
import { ReviewManagementPageComponent } from '@doublestar/reviews';
import {
  authGuard,
  requireRoles,
} from '@doublestar/shared';

import {
  ForbiddenPageComponent,
  ShellLayoutComponent,
} from '@doublestar/shell';

import { HomeRedirectComponent } from './home-redirect.component';

export const appRoutes: Route[] = [
  // ============================================================
  // PUBLIC AUTH ROUTES
  // ============================================================

  {
    path: 'login',
    title: 'Sign in — Double Star Staff',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.LoginPageComponent,
      ),
  },

  {
    path: 'forgot-password',
    title: 'Forgot Password — Double Star Staff',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.ForgotPasswordPageComponent,
      ),
  },

  {
    path: 'reset-password',
    title: 'Reset Password — Double Star Staff',
    loadComponent: () =>
      import('@doublestar/auth').then(
        (m) => m.ResetPasswordPageComponent,
      ),
  },

  // ============================================================
  // PROTECTED STAFF APPLICATION
  // ============================================================

  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],

    children: [
      // ----------------------------------------------------------
      // HOME
      // ----------------------------------------------------------

      {
        path: '',
        pathMatch: 'full',
        component: HomeRedirectComponent,
      },

      // ----------------------------------------------------------
      // DASHBOARD
      // ----------------------------------------------------------

      {
        path: 'dashboard',
        title: 'Dashboard — Double Star',
        canActivate: [
          requireRoles('Admin', 'Manager'),
        ],
        loadComponent: () =>
          import('@doublestar/reporting').then(
            (m) => m.DashboardPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // REPORTING / ANALYTICS
      // ----------------------------------------------------------

      {
        path: 'reports/sales',
        title: 'Sales Analytics — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/reporting').then(
            (m) => m.SalesAnalyticsPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // SALES
      // ----------------------------------------------------------

      {
        path: 'sales',
        title: 'Sales — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/sales').then(
            (m) => m.SaleListPageComponent,
          ),
      },

      {
        path: 'sales/new',
        title: 'New Sale — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/sales').then(
            (m) => m.NewSalePageComponent,
          ),
      },

      // ----------------------------------------------------------
      // ONLINE ORDERS
      // ----------------------------------------------------------

      {
        path: 'orders',
        title: 'Online Orders — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () =>
          import('@doublestar/orders').then((m) => m.StaffOrdersPageComponent),
      },

      {
        path: 'orders/:id',
        title: 'Order — Double Star',
        canActivate: [requireRoles('Admin', 'Manager', 'Cashier')],
        loadComponent: () =>
          import('@doublestar/orders').then((m) => m.StaffOrderDetailPageComponent),
      },
      // ----------------------------------------------------------
      // REPAIRS
      // ----------------------------------------------------------

      {
        path: 'repairs',
        title: 'Repairs — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
            'Technician',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/repairs').then(
            (m) => m.RepairTicketListPageComponent,
          ),
      },

      {
        path: 'repairs/new',
        title: 'New Repair Ticket — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
            'Technician',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/repairs').then(
            (m) => m.NewRepairTicketPageComponent,
          ),
      },

      {
        path: 'repairs/:id',
        title: 'Repair Ticket — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
            'Technician',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/repairs').then(
            (m) => m.RepairTicketDetailPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // CUSTOMERS
      // ----------------------------------------------------------

      {
        path: 'customers',
        title: 'Customers — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/customers').then(
            (m) => m.CustomerListPageComponent,
          ),
      },

      {
        path: 'customers/new',
        title: 'New Customer — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/customers').then(
            (m) => m.NewCustomerPageComponent,
          ),
      },

      {
        path: 'customers/:id',
        title: 'Customer — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/customers').then(
            (m) => m.CustomerDetailPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // CATALOG
      // ----------------------------------------------------------

      {
        path: 'catalog',
        title: 'Catalog — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/catalog').then(
            (m) => m.ProductListPageComponent,
          ),
      },

      {
        path: 'catalog/products/new',
        title: 'New Product — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/catalog').then(
            (m) => m.NewProductPageComponent,
          ),
      },

      {
        path: 'catalog/products/:id',
        title: 'Product — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/catalog').then(
            (m) => m.ProductDetailPageComponent,
          ),
      },

      {
        path: 'catalog/categories',
        title: 'Categories — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/catalog').then(
            (m) => m.CategoryListPageComponent,
          ),
      },

      {
        path: 'catalog/brands',
        title: 'Brands — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/catalog').then(
            (m) => m.BrandListPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // INVENTORY
      // ----------------------------------------------------------

      {
        path: 'inventory',
        title: 'Inventory — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/inventory').then(
            (m) => m.StockOverviewPageComponent,
          ),
      },

      {
        path: 'inventory/restock',
        title: 'Restock — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/inventory').then(
            (m) => m.RestockPageComponent,
          ),
      },

      {
        path: 'inventory/:productId',
        title: 'Stock Detail — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/inventory').then(
            (m) => m.ProductStockDetailPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // PAYMENTS
      // ----------------------------------------------------------

      {
        path: 'payments',
        title: 'Payments — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
            'Cashier',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/payments').then(
            (m) => m.PaymentLookupPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // NOTIFICATIONS
      // ----------------------------------------------------------

      {
        path: 'notifications',
        title: 'Notifications — Double Star',
        canActivate: [
          requireRoles(
            'Admin',
            'Manager',
          ),
        ],
        loadComponent: () =>
          import('@doublestar/notifications').then(
            (m) => m.NotificationLogPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // STAFF MANAGEMENT
      // ----------------------------------------------------------

      {
        path: 'staff',
        title: 'Staff — Double Star',
        canActivate: [
          requireRoles('Admin'),
        ],
        loadComponent: () =>
          import('@doublestar/staff').then(
            (m) => m.StaffListPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // PROFILE
      // ----------------------------------------------------------

      {
        path: 'profile',
        title: 'My Profile — Double Star',
        loadComponent: () =>
          import('@doublestar/auth').then(
            (m) => m.ProfilePageComponent,
          ),
      },

      // ----------------------------------------------------------
      // REVIEWS
      // ----------------------------------------------------------
      {
        path: 'reviews',
        title: 'Reviews — Double Star',
        canActivate: [
          requireRoles('Admin', 'Manager'),
        ],
        component: ReviewManagementPageComponent,
      },
      // ----------------------------------------------------------
      // SECURITY
      // ----------------------------------------------------------

      {
        path: 'security',
        title: 'Security — Double Star',
        loadComponent: () =>
          import('@doublestar/auth').then(
            (m) =>
              m.SecuritySettingsPageComponent,
          ),
      },

      // ----------------------------------------------------------
      // FORBIDDEN
      // ----------------------------------------------------------

      {
        path: 'forbidden',
        title: 'Access Denied — Double Star',
        component: ForbiddenPageComponent,
      },
    ],
  },

  // ============================================================
  // FALLBACK
  // ============================================================

  {
    path: '**',
    redirectTo: '',
  },
];