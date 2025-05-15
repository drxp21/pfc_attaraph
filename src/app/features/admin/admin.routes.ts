import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: 'elections',
        loadComponent: () => import('./components/elections/elections.component').then(c => c.ElectionsComponent)
      },
      {
        path: 'election-types',
        loadComponent: () => import('./components/election-types/election-types.component').then(c => c.ElectionTypesComponent)
      },
      {
        path: 'validation-candidatures',
        loadComponent: () => import('./components/validation/validation-candidatures/validation-candidatures.component').then(c => c.ValidationCandidaturesComponent)
      },
      {
        path: 'security',
        loadComponent: () => import('./components/security/security.component').then(c => c.SecurityComponent)
      },
      {
        path: 'validation',
        loadComponent: () => import('./components/validation/validation.component').then(c => c.ValidationComponent)
      },
      {
        path: 'stats',
        loadComponent: () => import('../../features/stats/stats.component').then(c => c.StatsComponent)
      },
      {
        path: '',
        redirectTo: 'elections',
        pathMatch: 'full'
      }
    ]
  }
];