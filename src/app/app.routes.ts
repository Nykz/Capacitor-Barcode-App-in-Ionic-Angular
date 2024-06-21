import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'products',
        loadComponent: () => import('./home/products/products.page').then( m => m.ProductsPage)
      },
      {
        path: 'cart',
        loadComponent: () => import('./home/cart/cart.page').then( m => m.CartPage)
      },
    ],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
