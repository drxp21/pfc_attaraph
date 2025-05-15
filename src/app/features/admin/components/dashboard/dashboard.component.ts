import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>E-<span class="text-accent">Vote</span></h1>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="elections" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            Gérer les élections
          </a>
          
          <a routerLink="election-types" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
            Types d'élection
          </a>
          
          <a routerLink="validation-candidatures" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Validation des candidatures
          </a>
          
          <a routerLink="security" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            Sécurité
          </a>
          
          <a routerLink="stats" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
            Statistiques
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
          <div class="header-left">
            <button class="menu-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2>Tableau de bord administrateur</h2>
          </div>
          
          <div class="header-right">
            <button class="btn-icon" title="Notifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <button class="btn-icon" title="Paramètres">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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
    .admin-dashboard {
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
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .header-left h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
    }
    
    .header-right {
      display: flex;
      gap: 8px;
    }
    
    .btn-icon {
      background: none;
      border: none;
      color: var(--primary);
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
      transition: var(--transition);
    }
    
    .btn-icon:hover {
      background: var(--gray-100);
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
      
      .menu-toggle {
        display: block;
      }
    }
  `]
})
export class DashboardComponent {
  constructor() {}
  
  logout() {
    // Implémenter la déconnexion
  }
}