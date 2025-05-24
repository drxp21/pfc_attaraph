import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'procedure',
    loadComponent: () => import('./features/procedure/procedure.component').then(c => c.ProcedureComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(c => c.AboutComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];