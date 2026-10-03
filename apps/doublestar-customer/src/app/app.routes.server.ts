import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products',
    renderMode: RenderMode.Server,
  },
  {
    path: 'products/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'forgot-password',
    renderMode: RenderMode.Server,
  },
  {
    path: 'reset-password',
    renderMode: RenderMode.Server,
  },
  {
    path: 'email-signin',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];