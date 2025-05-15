import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="overview-container">
      <!-- Statistiques rapides -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🗳️</div>
          <div class="stat-info">
            <span class="stat-value">3</span>
            <span class="stat-label">Élections en cours</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <span class="stat-value">1</span>
            <span class="stat-label">Candidature active</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✓</div>
          <div class="stat-info">
            <span class="stat-value">5</span>
            <span class="stat-label">Votes effectués</span>
          </div>
        </div>
      </div>

      <!-- Prochaines élections -->
      <div class="section-card">
        <div class="card-header">
          <h3>Prochaines élections</h3>
          <a routerLink="/dashboard/elections" class="btn btn-text">Voir tout</a>
        </div>
        
        <div class="elections-list">
          <div class="election-item">
            <div class="election-info">
              <h4>Chef du Département Informatique</h4>
              <p>Début: 15 Mai 2025</p>
            </div>
            <a routerLink="/dashboard/elections" class="btn btn-outline">Participer</a>
          </div>
          
          <div class="election-item">
            <div class="election-info">
              <h4>Directeur UFR Sciences</h4>
              <p>Début: 1 Juin 2025</p>
            </div>
            <a routerLink="/dashboard/elections" class="btn btn-outline">Participer</a>
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div class="section-card">
        <div class="card-header">
          <h3>Activité récente</h3>
          <a routerLink="/dashboard/historique" class="btn btn-text">Historique complet</a>
        </div>
        
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">✓</div>
            <div class="activity-info">
              <p>Vote effectué - Élection Chef de Département</p>
              <span class="activity-date">Il y a 2 jours</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">📝</div>
            <div class="activity-info">
              <p>Candidature soumise - Directeur UFR</p>
              <span class="activity-date">Il y a 5 jours</span>
            </div>
          </div>
        </div>
      </div>
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
export class OverviewComponent {}
