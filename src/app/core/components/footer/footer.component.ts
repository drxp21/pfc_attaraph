import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container py-5">
        <div class="footer-grid">
          <div class="footer-section">
            <h3>E-Vote</h3>
            <p>Système électoral numérique de l'université pour assurer la transparence, la sécurité et l'anonymat des votes.</p>
          </div>
          
          <div class="footer-section">
            <h4>Liens Rapides</h4>
            <ul>
              <li><a routerLink="/">Accueil</a></li>
              <li><a routerLink="/elections">Élections</a></li>
              <li><a routerLink="/procedure">Procédures</a></li>
              <li><a routerLink="/about">À propos</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Types d'Élections</h4>
            <ul>
              <li><a routerLink="/elections/chef-departement">Chef de département</a></li>
              <li><a routerLink="/elections/directeur-ufr">Directeur/Vice-Directeur d'UFR</a></li>
              <li><a routerLink="/elections/vice-recteur">Vice-Recteur</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Contact</h4>
            <p>Email: elections&#64;universite.thies.sn</p>
            <p>Téléphone: +221 77 299 86 64</p>
            <div class="social-links">
              <a href="https://www.facebook.com/profile.php?id=61575912871999" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://x.com/home" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Système Électoral Universitaire. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--primary);
      color: white;
      padding: 60px 0 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .py-5 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-section h3 {
      color: var(--accent);
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    .footer-section h4 {
      color: white;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }

    .footer-section p {
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section li {
      margin-bottom: 10px;
    }

    .footer-section a {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section a:hover {
      color: var(--accent);
    }

    .social-links {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .social-links a:hover {
      background-color: var(--accent);
      transform: translateY(-3px);
    }

    .social-links svg {
      width: 18px;
      height: 18px;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}