import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../core/services/election.service';
import { StatsService } from '../../core/services/stats.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="results-container">
      <div class="page-header">
        <h1>Résultats des Élections</h1>
        <p>Consultez les résultats des élections universitaires terminées</p>
      </div>

      <!-- Filtres -->
      <div class="filters">
        <div class="filter-group">
          <label>Année</label>
          <select class="form-control" (change)="filterByYear($event)">
            <option value="2025">2025</option>
            <option value="2024">2024</option>
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

      <!-- Liste des élections -->
      <div class="elections-grid">
        <div *ngFor="let election of completedElections" class="election-card">
          <div class="election-header">
            <h2>{{ election.title }}</h2>
            <span class="election-date">{{ election.endDate | date:'dd/MM/yyyy' }}</span>
          </div>

          <div class="results-summary">
            <div class="stat-item">
              <span class="stat-value">{{ election.totalVoters }}</span>
              <span class="stat-label">Votants</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ election.participationRate }}%</span>
              <span class="stat-label">Participation</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ election.blankVotes }}</span>
              <span class="stat-label">Votes blancs</span>
            </div>
          </div>

          <div class="chart-container">
            <canvas [id]="'chart-' + election.id"></canvas>
          </div>

          <div class="candidates-list">
            <!-- Vote blanc -->
            <div class="candidate-result blank-vote">
              <div class="candidate-info">
                <h3>Votes blancs</h3>
                <p>Bulletins sans candidat sélectionné</p>
              </div>
              <div class="vote-count">
                <span class="percentage">{{ election.blankVotePercentage }}%</span>
                <span class="votes">({{ election.blankVotes }} votes)</span>
              </div>
            </div>

            <!-- Résultats des candidats -->
            <div *ngFor="let candidate of election.candidates" class="candidate-result">
              <div class="candidate-info">
                <h3>{{ candidate.name }}</h3>
                <p>{{ candidate.position }}</p>
              </div>
              <div class="vote-count">
                <span class="percentage">{{ candidate.percentage }}%</span>
                <span class="votes">({{ candidate.votes }} votes)</span>
              </div>
            </div>
          </div>

          <div class="election-footer">
            <button class="btn btn-outline" (click)="downloadResults(election)">
              Télécharger le PV
            </button>
            <button class="btn btn-primary" (click)="viewDetails(election)">
              Détails complets
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 16px;
    }

    .page-header p {
      font-size: 1.2rem;
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

    .elections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 32px;
    }

    .election-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-md);
    }

    .election-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .election-header h2 {
      font-size: 1.5rem;
      color: var(--primary);
      margin: 0;
    }

    .election-date {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .results-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
    }

    .stat-label {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .chart-container {
      margin-bottom: 24px;
      height: 200px;
    }

    .candidates-list {
      margin-bottom: 24px;
    }

    .candidate-result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid var(--gray-200);
    }

    .candidate-result:last-child {
      border-bottom: none;
    }

    .candidate-result.blank-vote {
      background: var(--gray-50);
      border-radius: var(--border-radius);
      margin-bottom: 16px;
    }

    .candidate-info h3 {
      margin: 0 0 4px;
      font-size: 1.1rem;
      color: var(--primary);
    }

    .candidate-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .vote-count {
      text-align: right;
    }

    .percentage {
      display: block;
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--primary);
    }

    .votes {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .election-footer {
      display: flex;
      gap: 16px;
    }

    .election-footer button {
      flex: 1;
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      .elections-grid {
        grid-template-columns: 1fr;
      }

      .election-footer {
        flex-direction: column;
      }
    }
  `]
})
export class ResultsComponent implements OnInit {
  completedElections: any[] = [];

  constructor(
    private electionService: ElectionService,
    private statsService: StatsService
  ) {}

  async ngOnInit() {
    await this.loadElections();
  }

  async loadElections() {
    try {
      const elections = await this.electionService.getElections().toPromise();
      if (!elections) {
        console.error('No elections data received');
        return;
      }
      
      this.completedElections = elections.filter(e => e.statut === 'FERMEE');
      
      // Charger les statistiques pour chaque élection
      for (const election of this.completedElections) {
        const stats = await this.statsService.getElectionStats(election.id);
        election.totalVoters = stats.totalVoters;
        election.participationRate = stats.participationRate;
        election.blankVotes = stats.blankVotes;
        election.blankVotePercentage = stats.blankVotePercentage;
        election.candidates = stats.votesPerCandidate;
        
        this.createChart(election, stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des élections:', error);
      this.completedElections = [];
    }
  }

  private createChart(election: any, stats: any) {
    const ctx = document.getElementById('chart-' + election.id) as HTMLCanvasElement;
    if (!ctx) return;

    const labels = ['Votes blancs', ...stats.votesPerCandidate.map((c: any) => c.candidateName)];
    const data = [stats.blankVotes, ...stats.votesPerCandidate.map((c: any) => c.votes)];
    const colors = ['#E0E0E0', ...this.generateColors(stats.votesPerCandidate.length)];

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private generateColors(count: number): string[] {
    const colors = [
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
      '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'
    ];
    return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
  }

  filterByYear(event: any) {
    // Implémenter le filtrage par année
  }

  filterByType(event: any) {
    // Implémenter le filtrage par type
  }

  downloadResults(election: any) {
    // Implémenter le téléchargement des résultats
  }

  viewDetails(election: any) {
    // Implémenter la vue détaillée
  }
}
