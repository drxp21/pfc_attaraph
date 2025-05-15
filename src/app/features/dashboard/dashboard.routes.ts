import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/overview/overview.component').then(c => c.OverviewComponent)
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/elections/elections.component').then(c => c.ElectionsComponent)
      },
      {
        path: 'candidature',
        loadComponent: () => import('./components/candidature/candidature.component').then(c => c.CandidatureComponent)
      },
      {
        path: 'historique',
        loadComponent: () => import('./components/vote-history/vote-history.component').then(c => c.VoteHistoryComponent)
      }
    ]
  }
];