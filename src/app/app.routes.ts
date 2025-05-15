import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

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
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES),
   
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES),
   
  },
  {
    path: 'elections',
    loadComponent: () => import('./features/elections/elections-list/elections-list.component').then(c => c.ElectionsListComponent)
  },
  {
    path: 'elections/:id/vote',
    loadComponent: () => import('./features/elections/vote/vote.component').then(c => c.VoteComponent),
   
  },
  {
    path: 'resultats/:id',
    loadComponent: () => import('./features/results/results.component').then(c => c.ResultsComponent)
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