import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoteService } from '../../../../core/services/vote.service';

@Component({
  selector: 'app-vote-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-container">
      <div class="page-header">
        <h2>Historique des Votes</h2>
        <p>Consultez l'historique de vos participations aux élections</p>
      </div>

      <!-- Filtres -->
      <div class="filters">
        <div class="filter-group">
          <label>Période</label>
          <select class="form-control" (change)="filterByPeriod($event)">
            <option value="all">Toutes les périodes</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Type d'élection</label>
          <select class="form-control" (change)="filterByType($event)">
            <option value="all">Tous les types</option>
            <option value="department">Chef de département</option>
            <option value="ufr">Directeur UFR</option>
            <option value="vice-rector">Vice-Recteur</option>
          </select>
        </div>
      </div>

      <!-- Timeline des votes -->
      <div class="vote-timeline">
        <div *ngFor="let vote of voteHistory" class="timeline-item">
          <div class="timeline-marker" [class]="vote.status"></div>
          
          <div class="timeline-content">
            <div class="vote-header">
              <h3>{{ vote.electionTitle }}</h3>
              <span class="vote-date">{{ vote.date | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            
            <div class="vote-details">
              <div class="detail-item">
                <span class="detail-label">Type d'élection</span>
                <span class="detail-value">{{ vote.type }}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">Statut</span>
                <span class="status-badge" [class]="vote.status">
                  {{ vote.status === 'confirmed' ? 'Confirmé' : 
                     vote.status === 'pending' ? 'En attente' : 'Rejeté' }}
                </span>
              </div>
            </div>

            <div class="vote-actions">
              <button class="btn btn-outline btn-sm" (click)="viewDetails(vote)">
                Voir les détails
              </button>
              <button class="btn btn-outline btn-sm" *ngIf="vote.status === 'confirmed'"
                      (click)="downloadReceipt(vote)">
                Télécharger le reçu
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques de participation -->
      <div class="participation-stats">
        <h3>Statistiques de participation</h3>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ totalVotes }}</span>
              <span class="stat-label">Votes totaux</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✓</div>
            <div class="stat-info">
              <span class="stat-value">{{ participationRate }}%</span>
              <span class="stat-label">Taux de participation</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🗓️</div>
            <div class="stat-info">
              <span class="stat-value">{{ lastVoteDate | date:'dd/MM/yyyy' }}</span>
              <span class="stat-label">Dernier vote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
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

    .filters {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
    }

    .filter-group {
      flex: 1;
    }

    .filter-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--primary);
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--gray-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: var(--transition);
    }

    .form-control:focus {
      border-color: var(--secondary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }

    .vote-timeline {
      position: relative;
      padding-left: 32px;
      margin-bottom: 48px;
    }

    .vote-timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--gray-200);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 32px;
    }

    .timeline-marker {
      position: absolute;
      left: -41px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--gray-300);
    }

    .timeline-marker.confirmed {
      border-color: #4CAF50;
      background: #4CAF50;
    }

    .timeline-marker.pending {
      border-color: #FF9800;
      background: #FF9800;
    }

    .timeline-marker.rejected {
      border-color: #F44336;
      background: #F44336;
    }

    .timeline-content {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .vote-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .vote-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: var(--primary);
    }

    .vote-date {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .vote-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .detail-value {
      font-weight: 500;
      color: var(--primary);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge.confirmed {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .status-badge.pending {
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
    }

    .status-badge.rejected {
      background: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }

    .vote-actions {
      display: flex;
      gap: 12px;
    }

    .btn-sm {
      padding: 8px 12px;
      font-size: 0.9rem;
    }

    .participation-stats {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .participation-stats h3 {
      margin: 0 0 24px;
      font-size: 1.25rem;
      color: var(--primary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      .vote-details {
        grid-template-columns: 1fr;
      }

      .vote-actions {
        flex-direction: column;
      }

      .vote-actions button {
        width: 100%;
      }
    }
  `]
})
export class VoteHistoryComponent {
  voteHistory: any[] = [];
  totalVotes = 0;
  participationRate = 0;
  lastVoteDate: Date | null = null;

  constructor(private voteService: VoteService) {
    // Données de démonstration
    this.voteHistory = [
      {
        id: 1,
        electionTitle: 'Chef du Département Informatique',
        type: 'Chef de département',
        date: new Date(),
        status: 'confirmed'
      },
      {
        id: 2,
        electionTitle: 'Directeur UFR Sciences',
        type: 'Directeur UFR',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'pending'
      }
    ];

    this.totalVotes = this.voteHistory.length;
    this.participationRate = 85;
    this.lastVoteDate = new Date();
  }

  filterByPeriod(event: any) {
    // Implémenter le filtrage par période
  }

  filterByType(event: any) {
    // Implémenter le filtrage par type
  }

  viewDetails(vote: any) {
    // Implémenter l'affichage des détails
  }

  downloadReceipt(vote: any) {
    // Implémenter le téléchargement du reçu
  }
}