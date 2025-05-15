

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <div class="hero-section">
        <div class="container">
          <h1>À propos du Système Électoral</h1>
          <p class="lead">Une plateforme moderne pour des élections universitaires transparentes et sécurisées</p>
        </div>
      </div>

      <div class="container content-section">
        <div class="mission-section">
          <h2>Notre Mission</h2>
          <p>
            Le système électoral universitaire numérique a été conçu pour moderniser et simplifier 
            le processus électoral au sein de notre institution. Notre mission est de garantir :
          </p>
          <ul>
            <li>La transparence totale des processus électoraux</li>
            <li>L'accessibilité pour tous les membres de la communauté universitaire</li>
            <li>La sécurité et l'intégrité des votes</li>
            <li>L'efficacité et la rapidité du dépouillement</li>
          </ul>
        </div>

        <div class="features-section">
          <h2>Caractéristiques Principales</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h3>Sécurité Maximale</h3>
              <p>Chiffrement de bout en bout et authentification à deux facteurs pour protéger chaque vote.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Accessibilité</h3>
              <p>Interface adaptative accessible depuis n'importe quel appareil, à tout moment.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3>Rapidité</h3>
              <p>Résultats instantanés et vérifiables dès la clôture du scrutin.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Transparence</h3>
              <p>Suivi en temps réel du taux de participation et résultats détaillés.</p>
            </div>
          </div>
        </div>

        <div class="team-section">
          <h2>L'Équipe</h2>
          <p>
            Notre système est géré par une équipe dédiée composée de :
          </p>
          <ul>
            <li>Administrateurs système qualifiés</li>
            <li>Experts en sécurité informatique</li>
            <li>Personnel administratif formé</li>
            <li>Support technique disponible</li>
          </ul>
        </div>

         <div class="contact-section">
        <h2>Contact</h2>
        <p>Pour toute question ou assistance :</p>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-label">Email :</span>
            <span class="contact-value">support.elections&#64;universite.edu</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">Téléphone :</span>
            <span class="contact-value">+33 (0)1 23 45 67 89</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">Horaires :</span>
            <span class="contact-value">Lundi au Vendredi, 9h-17h</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: var(--text-light);
      padding: 120px 0 80px;
      text-align: center;
    }

    .hero-section h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      color: var(--text-light);
    }

    .lead {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 800px;
      margin: 0 auto;
    }

    .content-section {
      padding: 80px 0;
    }

    .mission-section,
    .features-section,
    .team-section,
    .contact-section {
      margin-bottom: 80px;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 32px;
      color: var(--primary);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      margin-top: 40px;
    }

    .feature-card {
      background: white;
      padding: 32px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      text-align: center;
      transition: var(--transition);
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      margin-bottom: 16px;
      color: var(--primary);
    }

    .feature-card p {
      color: var(--gray-500);
      line-height: 1.6;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    ul li {
      margin-bottom: 12px;
      padding-left: 24px;
      position: relative;
    }

    ul li::before {
      content: "•";
      color: var(--secondary);
      font-size: 1.5rem;
      position: absolute;
      left: 0;
      top: -4px;
    }

    .contact-info {
      background: white;
      padding: 32px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .contact-item {
      margin-bottom: 16px;
      display: flex;
      gap: 16px;
    }

    .contact-label {
      font-weight: 600;
      color: var(--primary);
      min-width: 100px;
    }

    .contact-value {
      color: var(--gray-500);
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 80px 0 60px;
      }

      .hero-section h1 {
        font-size: 2rem;
      }

      .lead {
        font-size: 1.1rem;
      }

      .content-section {
        padding: 40px 0;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .contact-item {
        flex-direction: column;
        gap: 4px;
      }
    }
  `]
})
export class AboutComponent {}