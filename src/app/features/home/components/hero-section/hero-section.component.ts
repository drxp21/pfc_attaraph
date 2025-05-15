import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="overlay"></div>
      <div class="container hero-content">
        <div class="text-content slide-up">
          <h1>Système Électoral<br>de l'Université Iba der thiam de thies</h1>
          <p class="subtitle">Une plateforme transparente et sécurisée pour les élections universitaires</p>
          <div class="buttons mt-4">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">S'inscrire</a>
            <a routerLink="/elections" class="btn btn-outline btn-lg ml-3">Voir les élections</a>
          </div>
        </div>
        <div class="stats-container mt-5 fade-in">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">3</div>
              <div class="stat-label">Types d'Élections</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">100%</div>
              <div class="stat-label">Sécurisé</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Disponible</div>
            </div>
          </div>
        </div>
      </div>
      <div class="wave-bottom">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            class="wave-fill"></path>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      height: 100vh;
      min-height: 600px;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--text-light);
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') center/cover no-repeat;
      opacity: 0.15;
      z-index: 1;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      padding-top: 80px;
    }
    
    .text-content {
      max-width: 600px;
    }
    
    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 24px;
      line-height: 1.2;
      color: var(--text-light);
    }
    
    .subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    
    .ml-3 {
      margin-left: 24px;
    }
    
    .stats-container {
      width: 100%;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    
    .stat-card {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius);
      padding: 24px;
      text-align: center;
      backdrop-filter: blur(5px);
      transition: var(--transition);
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      background-color: rgba(255, 255, 255, 0.15);
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-weight: 500;
    }
    
    .wave-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      line-height: 0;
      z-index: 3;
    }
    
    .wave-bottom svg {
      position: relative;
      display: block;
      width: calc(100% + 1.3px);
      height: 80px;
    }
    
    .wave-fill {
      fill: var(--gray-100);
    }
    
    @media (max-width: 991px) {
      h1 {
        font-size: 2.8rem;
      }
      
      .stats-grid {
        grid-template-columns: repeat(1, 1fr);
      }
    }
    
    @media (max-width: 767px) {
      .hero {
        min-height: 700px;
        height: auto;
        padding: 120px 0 100px;
      }
      
      h1 {
        font-size: 2.2rem;
      }
      
      .buttons {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .ml-3 {
        margin-left: 0;
      }
    }
  `]
})
export class HeroSectionComponent {}