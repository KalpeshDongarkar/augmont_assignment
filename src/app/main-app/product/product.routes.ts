import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    redirectTo: 'product-collection',
    pathMatch: 'full',
  },
  {
    path: 'product-collection',
    loadComponent: () => import('./product-collection/product-collection').then((c) => c.ProductCollection),
  },
  {
    path: 'category-collection',
    loadComponent: () => import('./category-collection/category-collection').then((c) => c.CategoryCollection),
  },
];
