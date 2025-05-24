import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

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
        path: 'elections/election/:id',
        loadComponent: () => import('./components/election-details/election-details.component').then(c => c.ElectionDetailsComponent)
      },
      {
        path: 'elections/:id/vote',
        loadComponent: () => import('../elections/vote/vote.component').then(c => c.VoteComponent)
      },
      {
        path: 'candidature',
        loadComponent: () => import('./components/candidature/candidature.component').then(c => c.CandidatureComponent),
        canActivate: [roleGuard(['PER'])]
      },
      {
        path: 'historique',
        loadComponent: () => import('./components/vote-history/vote-history.component').then(c => c.VoteHistoryComponent),
        canActivate: [roleGuard(['PER', 'PATS'])]
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['ADMIN'])],
        children: [
          {
            path: 'elections',
            loadComponent: () => import('../admin/components/elections/elections.component').then(c => c.ElectionsComponent)
          },
          {
            path: 'election-types',
            loadComponent: () => import('../admin/components/election-types/election-types.component').then(c => c.ElectionTypesComponent)
          },
          {
            path: 'elections/:electionId/validate-candidatures',
            loadComponent: () => import('../admin/components/validation/validation-candidatures/validation-candidatures.component').then(c => c.ValidationCandidaturesComponent)
          },
          {
            path: 'candidatures/validation',
            loadComponent: () => import('../admin/components/validation/validation-candidatures/validation-candidatures.component').then(c => c.ValidationCandidaturesComponent)
          },
          {
            path: 'security',
            loadComponent: () => import('../admin/components/security/security.component').then(c => c.SecurityComponent)
          },
          {
            path: 'validation',
            loadComponent: () => import('../admin/components/validation/validation.component').then(c => c.ValidationComponent)
          },
          {
            path: 'stats',
            loadComponent: () => import('../stats/stats.component').then(c => c.StatsComponent)
          },
          {
            path: 'departements',
            loadComponent: () => import('../admin/components/departements/departements.component').then(c => c.DepartementsComponent)
          },
          {
            path: 'resultats/:id',
            loadComponent: () => import('../results/results.component').then(c => c.ResultsComponent)
          },
          {
            path: '',
            redirectTo: 'elections',
            pathMatch: 'full'
          }
        ]
      }
    ]
  }
];