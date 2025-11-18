import { Routes } from '@angular/router';
console.log('adasd');
export const mainappRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./overview/overview').then((c) => c.Overview),
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.routes').then((m) => m.productRoutes),
  },
];
