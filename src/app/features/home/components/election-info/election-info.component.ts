import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-election-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="election-info">
      <div class="container">
        <h2 class="section-title">Informations sur les Élections</h2>
        
        <div class="election-grid">
          <div class="election-card">
            <div class="election-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Chef de Département</h3>
            <p>Élection des responsables de département pour un mandat de 3 ans.</p>
            <a routerLink="/elections/chef-departement" class="learn-more">En savoir plus</a>
          </div>

          <div class="election-card">
            <div class="election-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Directeur d'UFR</h3>
            <p>Élection des directeurs et vice-directeurs des unités de formation et de recherche.</p>
            <a routerLink="/elections/directeur-ufr" class="learn-more">En savoir plus</a>
          </div>

          <div class="election-card">
            <div class="election-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="M7 15h0M2 9.5h20"></path>
              </svg>
            </div>
            <h3>Vice-Recteur</h3>
            <p>Élection des vice-recteurs pour représenter les différentes facultés.</p>
            <a routerLink="/elections/vice-recteur" class="learn-more">En savoir plus</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .election-info {
      padding: 80px 0;
      background-color: var(--gray-100);
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 60px;
      color: var(--primary);
    }

    .election-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .election-card {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .election-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }

    .election-icon {
      width: 60px;
      height: 60px;
      background-color: var(--primary-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .election-icon svg {
      width: 24px;
      height: 24px;
      color: var(--primary);
    }

    .election-card h3 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: var(--primary-dark);
    }

    .election-card p {
      color: var(--gray-600);
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .learn-more {
      color: var(--accent);
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }

    .learn-more::after {
      content: '→';
      margin-left: 5px;
      transition: margin-left 0.3s ease;
    }

    .learn-more:hover::after {
      margin-left: 10px;
    }

    @media (max-width: 768px) {
      .election-grid {
        grid-template-columns: 1fr;
      }
      
      .section-title {
        font-size: 2rem;
      }
    }
  `]
})
export class ElectionInfoComponent {}