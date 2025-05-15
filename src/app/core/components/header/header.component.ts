import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header [class.scrolled]="isScrolled" class="header">
      <div class="container flex justify-between items-center">
        <div class="logo">
          <a routerLink="/">
            <h1>E-<span class="text-accent">Vote</span></h1>
          </a>
        </div>
        
        <nav class="nav">
          <ul class="flex gap-3">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
            <li><a routerLink="/elections" routerLinkActive="active">Élections</a></li>
            <li><a routerLink="/procedure" routerLinkActive="active">Procédures</a></li>
            <li><a routerLink="/about" routerLinkActive="active">À propos</a></li>
          </ul>
        </nav>
        
        <div class="auth-buttons flex gap-2">
          <a routerLink="/auth/login" class="btn btn-outline">Se connecter</a>
          <a routerLink="/auth/register" class="btn btn-primary">S'inscrire</a>
        </div>
        
        <button (click)="toggleMobileMenu()" class="mobile-menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div class="mobile-menu" [class.active]="mobileMenuOpen">
        <nav>
          <ul>
            <li><a routerLink="/" (click)="closeMobileMenu()">Accueil</a></li>
            <li><a routerLink="/elections" (click)="closeMobileMenu()">Élections</a></li>
            <li><a routerLink="/procedure" (click)="closeMobileMenu()">Procédures</a></li>
            <li><a routerLink="/about" (click)="closeMobileMenu()">À propos</a></li>
            <li class="mt-3">
              <a routerLink="/auth/login" class="btn btn-outline w-full" (click)="closeMobileMenu()">Se connecter</a>
            </li>
            <li class="mt-2">
              <a routerLink="/auth/register" class="btn btn-primary w-full" (click)="closeMobileMenu()">S'inscrire</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 16px 0;
      transition: all 0.3s ease;
      background: var(--primary);
    }
    
    .header.scrolled {
      background: var(--primary);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      padding: 8px 0;
    }
    
    .logo h1 {
      font-size: 1.8rem;
      font-weight: 800;
      color: white;
      margin: 0;
    }
    
    .text-accent {
      color: var(--accent);
    }
    
    .nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .nav a {
      color: white;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }
    
    .nav a:hover, .nav a.active {
      color: var(--accent);
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .auth-buttons {
      display: flex;
    }
    
    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      height: 24px;
      width: 30px;
      background: transparent;
      border: none;
      cursor: pointer;
    }
    
    .mobile-menu-toggle span {
      display: block;
      height: 3px;
      width: 100%;
      background-color: white;
      border-radius: 3px;
      transition: var(--transition);
    }
    
    .mobile-menu {
      display: none;
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      background: var(--primary);
      padding: 24px;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    
    .mobile-menu.active {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    
    .mobile-menu ul {
      list-style: none;
      padding: 0;
    }
    
    .mobile-menu li {
      margin-bottom: 16px;
    }
    
    .mobile-menu a {
      color: white;
      font-size: 1.2rem;
      font-weight: 500;
      display: block;
      padding: 8px 0;
    }
    
    .w-full {
      width: 100%;
      display: block;
      text-align: center;
    }
    
    @media (max-width: 991px) {
      .nav, .auth-buttons {
        display: none;
      }
      
      .mobile-menu-toggle {
        display: flex;
      }
      
      .mobile-menu {
        display: block;
      }
    }
  `]
})
export class HeaderComponent {
  isScrolled = false;
  mobileMenuOpen = false;
  
  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}