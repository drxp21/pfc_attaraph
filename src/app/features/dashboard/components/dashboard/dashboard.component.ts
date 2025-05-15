import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>E-<span class="text-accent">Vote</span></h1>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <span class="nav-icon">📊</span>
            Vue d'ensemble
          </a>
          
          <a routerLink="/dashboard/elections" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🗳️</span>
            Élections en cours
          </a>
          
          <a routerLink="/dashboard/candidature" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📝</span>
            Ma candidature
          </a>
          
          <a routerLink="/dashboard/historique" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📅</span>
            Historique des votes
          </a>
        </nav>
        
        <div class="sidebar-footer">
          <button class="btn btn-outline btn-block" (click)="logout()">
            Se déconnecter
          </button>
        </div>
      </aside>
      
      <main class="main-content">
        <header class="content-header">
          <div class="user-welcome">
            <h2>Bienvenue, {{ userName }}</h2>
            <p>{{ userRole }}</p>
          </div>
          
          <div class="header-actions">
            <button class="btn-icon" title="Notifications">
              <span class="icon">🔔</span>
            </button>
            <button class="btn-icon" title="Paramètres">
              <span class="icon">⚙️</span>
            </button>
          </div>
        </header>
        
        <div class="content-body">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--gray-100);
    }
    
    .sidebar {
      width: 280px;
      background: var(--primary);
      color: var(--text-light);
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-header {
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 24px;
    }
    
    .sidebar-header h1 {
      color: var(--text-light);
      font-size: 1.5rem;
      margin: 0;
    }
    
    .text-accent {
      color: var(--accent);
    }
    
    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: rgba(255, 255, 255, 0.7);
      border-radius: var(--border-radius);
      transition: var(--transition);
    }
    
    .nav-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-light);
    }
    
    .nav-item.active {
      background: var(--accent);
      color: var(--primary);
    }
    
    .nav-icon {
      font-size: 1.2rem;
    }
    
    .sidebar-footer {
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .content-header {
      background: white;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
    }
    
    .user-welcome h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .user-welcome p {
      margin: 4px 0 0;
      color: var(--gray-500);
    }
    
    .header-actions {
      display: flex;
      gap: 8px;
    }
    
    .btn-icon {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      transition: var(--transition);
    }
    
    .btn-icon:hover {
      background: var(--gray-100);
    }
    
    .icon {
      font-size: 1.2rem;
    }
    
    .content-body {
      padding: 24px;
      flex: 1;
    }
    
    @media (max-width: 991px) {
      .sidebar {
        position: fixed;
        left: -280px;
        top: 0;
        bottom: 0;
        z-index: 100;
        transition: var(--transition);
      }
      
      .sidebar.active {
        left: 0;
      }
    }
  `]
})
export class DashboardComponent {
  userName = 'Mansour diouf'; // À remplacer par les données de l'utilisateur
  userRole = 'Enseignant-Chercheur'; // À remplacer par les données de l'utilisateur
  
  constructor(private authService: AuthService) {}
  
  async logout() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}
