import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="section eligibility-section gradient-bg">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2>Éligibilité et Participation</h2>
          <p class="section-subtitle">Qui peut voter et se porter candidat dans notre système électoral ?</p>
        </div>
        
        <div class="eligibility-cards">
          <div class="eligibility-card voters-card">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3>Électeurs</h3>
            <div class="eligibility-content">
              <p>Les personnes suivantes peuvent voter :</p>
              <ul>
                <li><strong>PER (Personnel Enseignant et de Recherche)</strong> - Peut voter dans toutes les élections selon leur département et UFR</li>
                <li><strong>PATS (Personnel Administratif, Technique et de Service)</strong> - Peut voter uniquement pour l'élection du Vice-Recteur</li>
              </ul>
              
              <h4>Types d'élections et électeurs :</h4>
              <div class="election-types">
                <div class="election-type">
                  <div class="type-badge">Chef de département</div>
                  <p>Seuls les <strong>PER du département</strong> concerné peuvent voter</p>
                </div>
                <div class="election-type">
                  <div class="type-badge">Directeur UFR</div>
                  <p>Seuls les <strong>PER de l'UFR</strong> concernée peuvent voter</p>
                </div>
                <div class="election-type">
                  <div class="type-badge">Vice-Recteur</div>
                  <p><strong>Tous les PER et PATS</strong> de l'université peuvent voter</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="eligibility-card candidates-card">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3>Candidats</h3>
            <div class="eligibility-content">
              <p>Seul le <strong>Personnel Enseignant et de Recherche (PER)</strong> peut se porter candidat aux différents postes, avec les conditions suivantes :</p>
              <ul>
                <li>Un candidat ne peut postuler que dans son département/UFR d'appartenance</li>
                <li>Le candidat doit être en fonction depuis au moins 2 ans</li>
                <li>Avoir un dossier administratif à jour</li>
                <li>Ne pas être sous le coup d'une sanction disciplinaire</li>
              </ul>
              
              <h4>Processus de candidature :</h4>
              <ol>
                <li>Créer un compte sur la plateforme</li>
                <li>Remplir le formulaire de candidature</li>
                <li>Soumettre un programme électoral</li>
                <li>Attendre la validation de candidature</li>
              </ol>
              
              <a routerLink="/auth/register" class="btn btn-accent mt-3">Créer un compte pour candidater</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .eligibility-section {
      position: relative;
      color: var(--text-light);
    }
    
    .section-subtitle {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .eligibility-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    
    .eligibility-card {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius);
      padding: 32px;
      backdrop-filter: blur(10px);
      transition: var(--transition);
    }
    
    .eligibility-card:hover {
      transform: translateY(-5px);
      background-color: rgba(255, 255, 255, 0.15);
    }
    
    .card-icon {
      margin-bottom: 20px;
      color: var(--accent);
    }
    
    .eligibility-card h3 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: var(--text-light);
    }
    
    .eligibility-card h4 {
      font-size: 1.2rem;
      margin: 24px 0 16px;
      color: var(--accent);
    }
    
    .eligibility-content p {
      margin-bottom: 16px;
      line-height: 1.6;
    }
    
    .eligibility-content ul, .eligibility-content ol {
      padding-left: 20px;
      margin-bottom: 16px;
    }
    
    .eligibility-content li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
    
    .election-types {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 16px;
    }
    
    .election-type {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: var(--border-radius);
      padding: 16px;
      transition: var(--transition);
    }
    
    .election-type:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
    
    .type-badge {
      display: inline-block;
      background-color: var(--accent);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }
    
    .election-type p {
      margin-bottom: 0;
      font-size: 0.95rem;
    }
    
    @media (max-width: 991px) {
      .eligibility-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EligibilityComponent {}