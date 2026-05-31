import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rota padrão → dashboard
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Auth
  { path: 'login',    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },

  // App (lazy loading — carregamento sob demanda)
  { path: 'dashboard',         loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),    canActivate: [authGuard] },
  { path: 'products',          loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),        canActivate: [authGuard] },
  { path: 'products/new',      loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent), canActivate: [authGuard] },
  { path: 'products/edit/:id', loadComponent: () => import('./pages/product-form/product-form.component').then(m => m.ProductFormComponent), canActivate: [authGuard] },
  { path: 'categories',        loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent),   canActivate: [authGuard] },
  { path: 'categories/new',    loadComponent: () => import('./pages/category-form/category-form.component').then(m => m.CategoryFormComponent), canActivate: [authGuard] },

  // Wildcard
  { path: '**', redirectTo: 'dashboard' }
];
