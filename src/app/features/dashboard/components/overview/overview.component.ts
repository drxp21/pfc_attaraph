import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Define interfaces for the data structure
interface QuickStats {
  ongoingElectionsCount: number;
  activeCandidacyCount: number;
  votesCastCount: number;
}

interface UpcomingElection {
  id: string;
  title: string;
  startDate: string;
  detailsLink: string;
}

interface RecentActivity {
  id: string;
  icon: string;
  description: string;
  dateRelative: string;
}

interface OverviewData {   
  quickStats: QuickStats;
  upcomingElections: UpcomingElection[];
  recentActivities: RecentActivity[];
}

const API_URL = `${environment.apiUrl}/dashboard`;

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
    <div *ngIf="overviewData" class="overview-container">
      <!-- Statistiques rapides -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🗳️</div>
          <div class="stat-info">
            <span class="stat-value">{{ overviewData.quickStats.ongoingElectionsCount }}</span>
            <span class="stat-label">Élections en cours</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <span class="stat-value">{{ overviewData.quickStats.activeCandidacyCount }}</span>
            <span class="stat-label">Candidature active</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✓</div>
          <div class="stat-info">
            <span class="stat-value">{{ overviewData.quickStats.votesCastCount }}</span>
            <span class="stat-label">Votes effectués</span>
          </div>
        </div>
      </div>

      <!-- Prochaines élections -->
      <div class="section-card">
        <div class="card-header">
          <h3>Prochaines élections</h3>
          <a routerLink="/dashboard/elections/election" class="btn btn-text">Voir tout</a>
        </div>
        
        <div *ngIf="overviewData.upcomingElections.length > 0; else noElections" class="elections-list">
          <div *ngFor="let election of overviewData.upcomingElections" class="election-item">
            <div class="election-info">
              <h4>{{ election.title }}</h4>
              <p>Début: {{ election.startDate }}</p>
            </div>
            <a [routerLink]="election.detailsLink" class="btn btn-outline">Participer</a>
          </div>
        </div>
        <ng-template #noElections>
          <p>Aucune élection à venir pour le moment.</p>
        </ng-template>
      </div>

      <!-- Activité récente -->
      <div class="section-card">
        <div class="card-header">
          <h3>Activité récente</h3>
          <a routerLink="/dashboard/elections" class="btn btn-text">Historique complet</a>
        </div>
        
        <div *ngIf="overviewData.recentActivities.length > 0; else noActivities" class="activity-list">
          <div *ngFor="let activity of overviewData.recentActivities" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-info">
              <p>{{ activity.description }}</p>
              <span class="activity-date">{{ activity.dateRelative }}</span>
            </div>
          </div>
        </div>
        <ng-template #noActivities>
          <p>Aucune activité récente.</p>
        </ng-template>
      </div>
    </div>
    <div *ngIf="!overviewData">
      <p>Chargement des données du tableau de bord...</p>
    </div>
  `,
  styles: [`
    .overview-container {
      display: grid;
      gap: 24px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
    }
    
    .stat-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }
    
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
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
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
    }
    
    .stat-label {
      color: var(--gray-500);
      font-size: 0.9rem;
    }
    
    .section-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--primary);
    }
    
    .elections-list {
      display: grid;
      gap: 16px;
    }
    
    .election-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
      transition: var(--transition);
    }
    
    .election-item:hover {
      background: var(--gray-200);
    }
    
    .election-info h4 {
      margin: 0 0 4px;
      font-size: 1rem;
      color: var(--primary);
    }
    
    .election-info p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--gray-500);
    }
    
    .activity-list {
      display: grid;
      gap: 16px;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
      transition: var(--transition);
    }
    
    .activity-item:hover {
      background: var(--gray-200);
    }
    
    .activity-icon {
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    .activity-info p {
      margin: 0 0 4px;
      color: var(--primary);
    }
    
    .activity-date {
      font-size: 0.85rem;
      color: var(--gray-500);
    }
    
    .btn-text {
      color: var(--secondary);
      background: none;
      border: none;
      padding: 0;
      font-size: 0.9rem;
      cursor: pointer;
    }
    
    .btn-text:hover {
      color: var(--primary);
      text-decoration: underline;
    }
  `]
})
export class OverviewComponent implements OnInit {
  overviewData: OverviewData | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<OverviewData>(API_URL)
      .pipe(
        catchError(error => {
          console.error('Error fetching dashboard data:', error);
          this.errorMessage = 'Erreur lors du chargement des données du tableau de bord. Veuillez réessayer plus tard.';
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.overviewData = data;
        }
      });
  }
}
