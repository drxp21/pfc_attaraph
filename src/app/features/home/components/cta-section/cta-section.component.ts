import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="section cta-section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-content">
            <h2>Prêt à participer aux élections ?</h2>
            <p>Rejoignez notre système électoral numérique pour voter ou vous porter candidat aux prochaines élections universitaires.</p>
            <div class="cta-buttons">
              <a routerLink="/auth/register" class="btn btn-primary btn-lg">Créer un compte</a>
              <a routerLink="/auth/login" class="btn btn-outline btn-lg">Se connecter</a>
            </div>
          </div>
          <div class="cta-image">
            <img src="https://www.bing.com/images/search?q=photo+election+digitaliser&id=7FDA0CCED38A97CF0F68DC71E97CC856E82C9CCE&form=IQFRBA&first=1&disoverlay=1" 
                alt="Participez aux élections universitaires">
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta-section {
      padding-bottom: var(--spacing-5);
    }
    
    .cta-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      border-radius: var(--border-radius);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }
    
    .cta-content {
      padding: 48px;
      color: var(--text-light);
    }
    
    .cta-content h2 {
      font-size: 2.2rem;
      color: var(--text-light);
      margin-bottom: 16px;
    }
    
    .cta-content p {
      font-size: 1.1rem;
      margin-bottom: 32px;
      opacity: 0.9;
    }
    
    .cta-buttons {
      display: flex;
      gap: 16px;
    }
    
    .cta-image {
      height: 100%;
      overflow: hidden;
    }
    
    .cta-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.6s ease;
    }
    
    .cta-card:hover .cta-image img {
      transform: scale(1.05);
    }
    
    @media (max-width: 991px) {
      .cta-card {
        grid-template-columns: 1fr;
      }
      
      .cta-image {
        height: 300px;
        order: -1;
      }
    }
    
    @media (max-width: 767px) {
      .cta-content {
        padding: 32px 24px;
      }
      
      .cta-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class CtaSectionComponent {}