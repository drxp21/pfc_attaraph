import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, ElectionStats, GlobalStats } from '../../core/services/stats.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="page-header">
        <h1>Rapports et Statistiques</h1>
        <p>Analyse détaillée des élections universitaires</p>
      </div>

      <!-- Statistiques globales -->
      <div class="global-stats">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ globalStats?.totalElections }}</span>
              <span class="stat-label">Élections totales</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <span class="stat-value">{{ globalStats?.totalVoters }}</span>
              <span class="stat-label">Votants</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <span class="stat-value">{{ globalStats?.averageParticipation }}%</span>
              <span class="stat-label">Participation moyenne</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="charts-section">
        <div class="chart-container">
          <h2>Tendances de participation</h2>
          <canvas id="participationTrends"></canvas>
        </div>

        <div class="chart-container">
          <h2>Statistiques par département</h2>
          <canvas id="departmentStats"></canvas>
        </div>
      </div>

      <!-- Tableau des élections récentes -->
      <div class="recent-elections">
        <div class="section-header">
          <h2>Élections récentes</h2>
          <div class="header-actions">
            <button class="btn btn-outline" (click)="generateReport('pdf')">
              Exporter en PDF
            </button>
            <button class="btn btn-outline" (click)="generateReport('csv')">
              Exporter en CSV
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="stats-table">
            <thead>
              <tr>
                <th>Élection</th>
                <th>Date</th>
                <th>Participation</th>
                <th>Candidats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let election of recentElections">
                <td>{{ election.title }}</td>
                <td>{{ election.date | date:'dd/MM/yyyy' }}</td>
                <td>{{ election.participationRate }}%</td>
                <td>{{ election.candidates }}</td>
                <td>
                  <button class="btn btn-sm btn-outline" 
                          (click)="viewDetails(election.id)">
                    Détails
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px;
    }

    .page-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .page-header p {
      font-size: 1.2rem;
      color: var(--gray-500);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: var(--gray-100);
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
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--primary);
    }

    .stat-label {
      color: var(--gray-500);
      font-size: 0.9rem;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .chart-container {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .chart-container h2 {
      font-size: 1.25rem;
      color: var(--primary);
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 1.25rem;
      color: var(--primary);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .stats-table {
      width: 100%;
      border-collapse: collapse;
    }

    .stats-table th,
    .stats-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--gray-200);
    }

    .stats-table th {
      background: var(--gray-100);
      font-weight: 600;
      color: var(--primary);
    }

    .stats-table tr:hover {
      background: var(--gray-50);
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .stats-container {
        padding: 16px;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .header-actions {
        flex-direction: column;
      }

      .header-actions button {
        width: 100%;
      }
    }
  `]
})
export class StatsComponent implements OnInit {
  globalStats: GlobalStats | null = null;
  recentElections: any[] = [];

  constructor(private statsService: StatsService) {}

  async ngOnInit() {
    await this.loadGlobalStats();
    await this.loadParticipationTrends();
    await this.loadDepartmentStats();
    this.initializeCharts();
  }

  async loadGlobalStats() {
    try {
      this.globalStats = await this.statsService.getGlobalStats();
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques globales:', error);
    }
  }

  async loadParticipationTrends() {
    try {
      const trends = await this.statsService.getParticipationTrends('month');
      // Implémenter la logique d'affichage des tendances
    } catch (error) {
      console.error('Erreur lors du chargement des tendances:', error);
    }
  }

  async loadDepartmentStats() {
    try {
      // Implémenter la logique de chargement des statistiques par département
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques par département:', error);
    }
  }

  initializeCharts() {
    this.initializeParticipationChart();
    this.initializeDepartmentChart();
  }

  initializeParticipationChart() {
    const ctx = document.getElementById('participationTrends') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Taux de participation',
            data: [65, 70, 75, 80, 85, 90],
            borderColor: 'rgb(63, 81, 181)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  initializeDepartmentChart() {
    const ctx = document.getElementById('departmentStats') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Informatique', 'Mathématiques', 'Physique', 'Chimie'],
          datasets: [{
            label: 'Participation par département',
            data: [85, 75, 80, 70],
            backgroundColor: 'rgba(63, 81, 181, 0.8)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  async generateReport(format: 'pdf' | 'csv') {
    try {
      const blob = await this.statsService.generateReport('all', format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-elections.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    }
  }

  viewDetails(electionId: string) {
    // Implémenter la logique d'affichage des détails
  }
}
