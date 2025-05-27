import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="(authService.currentUser$ | async) as user; else loadingOrError">
      <!-- Log the user object for debugging -->
   
      <div class="dashboard-layout">
        <aside class="sidebar">
          <div class="sidebar-header">
            <h1>E-<span class="text-accent">Vote</span></h1>
          </div>
          
          <nav class="sidebar-nav">
            <a routerLink="." routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
              <span class="nav-icon">📊</span>
              Vue d'ensemble
            </a>
            
            <a *ngIf="user.type_personnel === 'PER' || user.type_personnel === 'PATS' || user.type_personnel === 'ADMIN'" 
               routerLink="elections" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🗳️</span>
              Élections
            </a>
            
            <a *ngIf="user.type_personnel === 'PER'" routerLink="candidature" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📝</span>
              Ma candidature
            </a>
            
            <a *ngIf="user.type_personnel === 'PER' || user.type_personnel === 'PATS'" 
               routerLink="historique" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📅</span>
              Historique des votes
            </a>

            <ng-container *ngIf="user.type_personnel === 'ADMIN'">
              <hr class="nav-divider">
              <span class="nav-section-title">Administration</span>
              <a routerLink="admin/elections" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🛠️</span>
                Gestion Élections
              </a>
             <!-- <a routerLink="admin/election-types" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🏷️</span>
                Types d'Élection
              </a> -->
              <a routerLink="admin/departements" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🏢</span>
                Départements
              </a>
           <!--   <a routerLink="admin/validation" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🛡️</span>
                Validation (Général)
              </a> -->
              <a routerLink="admin/candidatures/validation" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">✅</span>
                Validation Candidatures
              </a>
             <!-- <a routerLink="admin/security" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🔒</span>
                Sécurité
              </a> -->
              <a routerLink="admin/stats" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📈</span>
                Statistiques
              </a>
            </ng-container>
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
              <h2>Bienvenue, {{ user.prenom }} {{ user.nom }}</h2>
              <p>{{ user.type_personnel }}</p>
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
    </ng-container>
    <ng-template #loadingOrError>
      <!-- You can put a loading spinner or an error message here -->
      <p>Chargement des données utilisateur...</p>
    </ng-template>
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
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout().subscribe({
      error: (err) => console.error('Erreur lors de la déconnexion depuis le dashboard:', err)
    });
  }
}
