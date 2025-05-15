import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-procedure',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="procedure-container">
      <div class="hero-section">
        <div class="container">
          <h1>Procédures Électorales</h1>
          <p class="lead">Guide complet des processus électoraux universitaires</p>
        </div>
      </div>

      <div class="container content-section">
        <!-- Étapes du processus -->
        <div class="process-section">
          <h2>Processus Électoral</h2>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-number">1</div>
              <div class="timeline-content">
                <h3>Annonce de l'élection</h3>
                <p>Publication officielle de l'élection avec le calendrier détaillé et les modalités.</p>
                <ul>
                  <li>Communication par email institutionnel</li>
                  <li>Affichage sur le portail électronique</li>
                  <li>Définition du calendrier électoral</li>
                </ul>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-number">2</div>
              <div class="timeline-content">
                <h3>Dépôt des candidatures</h3>
                <p>Période dédiée au dépôt des candidatures et des programmes.</p>
                <ul>
                  <li>Vérification de l'éligibilité</li>
                  <li>Soumission du programme électoral</li>
                  <li>Validation des candidatures</li>
                </ul>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-number">3</div>
              <div class="timeline-content">
                <h3>Campagne électorale</h3>
                <p>Période de présentation des programmes et des candidats.</p>
                <ul>
                  <li>Présentation des programmes</li>
                  <li>Débats et réunions</li>
                  <li>Communication avec les électeurs</li>
                </ul>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-number">4</div>
              <div class="timeline-content">
                <h3>Vote électronique</h3>
                <p>Phase de vote sécurisé via la plateforme numérique.</p>
                <ul>
                  <li>Authentification sécurisée</li>
                  <li>Vote anonyme</li>
                  <li>Confirmation du vote</li>
                </ul>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-number">5</div>
              <div class="timeline-content">
                <h3>Dépouillement et résultats</h3>
                <p>Publication des résultats et validation officielle.</p>
                <ul>
                  <li>Décompte automatique</li>
                  <li>Publication des résultats</li>
                  <li>Période de recours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Règles et conditions -->
        <div class="rules-section">
          <h2>Règles et Conditions</h2>
          
          <div class="rules-grid">
            <div class="rule-card">
              <h3>Éligibilité des candidats</h3>
              <ul>
                <li>Être membre du personnel enseignant titulaire</li>
                <li>Avoir au moins 2 ans d'ancienneté</li>
                <li>Ne pas avoir de sanctions disciplinaires</li>
                <li>Être rattaché au département/UFR concerné</li>
              </ul>
            </div>

            <div class="rule-card">
              <h3>Conditions de vote</h3>
              <ul>
                <li>Être inscrit sur les listes électorales</li>
                <li>Disposer d'un compte universitaire actif</li>
                <li>Avoir activé l'authentification à deux facteurs</li>
                <li>Voter pendant la période définie</li>
              </ul>
            </div>

            <div class="rule-card">
              <h3>Validation des résultats</h3>
              <ul>
                <li>Quorum minimum requis</li>
                <li>Majorité absolue au premier tour</li>
                <li>Majorité relative au second tour</li>
                <li>Période de contestation de 48h</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Documents requis -->
        <div class="documents-section">
          <h2>Documents Requis</h2>
          
          <div class="documents-grid">
            <div class="document-card">
              <div class="document-icon">📄</div>
              <h3>Pour les candidats</h3>
              <ul>
                <li>CV académique</li>
                <li>Lettre de motivation</li>
                <li>Programme électoral</li>
                <li>Déclaration sur l'honneur</li>
              </ul>
            </div>

            <div class="document-card">
              <div class="document-icon">🗳️</div>
              <h3>Pour les électeurs</h3>
              <ul>
                <li>Carte professionnelle</li>
                <li>Email institutionnel actif</li>
                <li>Authentification à deux facteurs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .procedure-container {
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

    h2 {
      font-size: 2rem;
      margin-bottom: 40px;
      color: var(--primary);
      text-align: center;
    }

    /* Timeline styles */
    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 0;
    }

    .timeline::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50px;
      height: 100%;
      width: 2px;
      background: var(--secondary);
    }

    .timeline-item {
      margin-bottom: 40px;
      position: relative;
      padding-left: 120px;
    }

    .timeline-number {
      position: absolute;
      left: 20px;
      width: 60px;
      height: 60px;
      background: var(--secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }

    .timeline-content {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .timeline-content h3 {
      color: var(--primary);
      margin-bottom: 16px;
    }

    .timeline-content p {
      color: var(--gray-500);
      margin-bottom: 16px;
    }

    /* Rules section styles */
    .rules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      margin-bottom: 80px;
    }

    .rule-card {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .rule-card h3 {
      color: var(--primary);
      margin-bottom: 16px;
      font-size: 1.25rem;
    }

    /* Documents section styles */
    .documents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
    }

    .document-card {
      background: white;
      padding: 32px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      text-align: center;
    }

    .document-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .document-card h3 {
      color: var(--primary);
      margin-bottom: 16px;
    }

    /* Common styles */
    ul {
      list-style-type: none;
      padding: 0;
    }

    ul li {
      margin-bottom: 12px;
      padding-left: 24px;
      position: relative;
      color: var(--gray-500);
    }

    ul li::before {
      content: "•";
      color: var(--secondary);
      font-size: 1.5rem;
      position: absolute;
      left: 0;
      top: -4px;
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

      .timeline::before {
        left: 30px;
      }

      .timeline-item {
        padding-left: 80px;
      }

      .timeline-number {
        left: 0;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }

      .rules-grid,
      .documents-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProcedureComponent {}