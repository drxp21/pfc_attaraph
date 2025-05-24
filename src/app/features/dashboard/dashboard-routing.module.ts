import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'elections',
        pathMatch: 'full'
      },
      {
        path: 'elections',
        loadComponent: () => import('./components/elections/elections.component').then(m => m.ElectionsComponent)
      },
      {
        path: 'vote/:id',
        loadComponent: () => import('../elections/vote/vote.component').then(m => m.VoteComponent)
      },
      {
        path: 'election/:id/candidates',
        loadComponent: () => import('../elections/candidates/candidates.component').then(m => m.CandidatesComponent)
      },
      {
        path: 'election/:id/results',
        loadComponent: () => import('../elections/results/results.component').then(m => m.ResultsComponent)
      },
      {
        path: 'candidature',
        loadComponent: () => import('./components/candidature/candidature.component').then(m => m.CandidatureComponent)
      },
      {
        path: 'vote-history',
        loadComponent: () => import('./components/vote-history/vote-history.component').then(m => m.VoteHistoryComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 