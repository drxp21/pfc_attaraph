import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ElectionService, Election } from '../../../../core/services/election.service';
import { FormatElectionTypePipe } from '../../../elections/elections-list/elections-list.component';
import { VoteService } from '../../../../core/services/vote.service';

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatElectionTypePipe],
  template: `
    <div class="elections-container">
      <div class="page-header">
        <h2>Élections en cours</h2>
        <p>Participez aux élections universitaires en cours</p>
      </div>

      <div class="elections-grid">
        <div *ngFor="let election of elections" class="election-card" (click)="viewElection(election)" style="cursor: pointer;">
          <div class="election-header">
            <span class="election-type">{{ election.type_election | formatElectionType }}</span>
            <span class="election-statut" [class]="election.statut">
              {{ election.statut === 'EN_COURS' ? 'En cours' : 
                 election.statut === 'BROUILLON' ? 'À venir' : 'Terminée' }}
            </span>
          </div>

          <h3>{{ election.titre }}</h3>
          <p class="election-description">{{ election.description }}</p>

          <div class="election-details">
            <div class="detail-item">
              <span class="detail-label">Début</span>
              <span class="detail-value">{{ election.date_debut_vote | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fin</span>
              <span class="detail-value">{{ election.date_fin_vote | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Candidats</span>
              <span class="detail-value">{{ election.candidatures?.length || 0 }}</span>
            </div>
          </div>

          <div class="election-actions">
            <button class="btn btn-primary" *ngIf="election.statut === 'EN_COURS'"
                    (click)="vote(election); $event.stopPropagation()">
              Voter
            </button>
            <button class="btn btn-outline" *ngIf="election.statut === 'EN_COURS'"
                    (click)="viewCandidates(election); $event.stopPropagation()">
              Voir les candidats
            </button>
            <button class="btn btn-outline" *ngIf="election.statut === 'FERMEE'"
                    (click)="viewResults(election); $event.stopPropagation()">
              Voir les résultats
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .elections-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h2 {
      margin: 0;
      font-size: 1.8rem;
      color: var(--primary);
    }

    .page-header p {
      margin: 8px 0 0;
      color: var(--gray-500);
    }

    .elections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .election-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }

    .election-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .election-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .election-type {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .election-statut {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .election-statut.active {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .election-statut.draft {
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
    }

    .election-statut.completed {
      background: rgba(158, 158, 158, 0.1);
      color: #9E9E9E;
    }

    .election-card h3 {
      margin: 0 0 12px;
      font-size: 1.25rem;
      color: var(--primary);
    }

    .election-description {
      color: var(--gray-500);
      font-size: 0.95rem;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .election-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 0.85rem;
      color: var(--gray-500);
    }

    .detail-value {
      font-weight: 500;
      color: var(--primary);
    }

    .election-actions {
      display: flex;
      gap: 12px;
    }

    /* Modal styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: var(--border-radius);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--gray-500);
    }

    .modal-body {
      padding: 20px;
    }

    .candidates-list {
      display: grid;
      gap: 16px;
    }

    .candidate-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .candidate-info h4 {
      margin: 0 0 4px;
      color: var(--primary);
    }

    .candidate-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    @media (max-width: 768px) {
      .election-actions {
        flex-direction: column;
      }

      .election-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ElectionsComponent {
  elections: Election[] = [];

  constructor(
    private electionService: ElectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadElections();
  }

  loadElections() {
    this.electionService.getElections().subscribe({
      next: (elections) => this.elections = elections,
      error: (err) => console.error('Error loading elections:', err)
    });
  }

  viewElection(election: Election, event?: Event) {
    // Prevent event bubbling if this was called from a button click
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['election', election.id], { relativeTo: this.route });
  }

  // Keep this method for backward compatibility
  vote(election: Election) {
    this.viewElection(election);
  }

  viewCandidates(election: Election) {
    this.router.navigate(['election', election.id], { relativeTo: this.route });
  }

  viewResults(election: Election) {
    this.router.navigate(['../election', election.id, 'results'], { relativeTo: this.route });
  }
}