import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'catalog',
    loadComponent: () => import('./features/catalog/catalog').then((m) => m.CatalogPage),
  },
  {
    path: 'dish/:id',
    loadComponent: () => import('./features/detail/detail').then((m) => m.Detail),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then((m) => m.CartPage),
  },
  {
    path: 'account',
    loadComponent: () => import('./features/account/account').then((m) => m.Account),
  },
  { path: '**', redirectTo: '' },
];
