import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ElectionService, Election } from '../../../core/services/election.service';

@Component({
  selector: 'app-elections-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="elections-page">
      <div class="hero-section">
        <div class="container">
          <h1>Élections Universitaires</h1>
          <p class="lead">Consultez les élections en cours et à venir</p>
        </div>
      </div>

      <div class="container content-section">
        <!-- Filtres -->
        <div class="filters">
          <div class="filter-group">
            <label>Type d'élection</label>
            <select class="form-control" (change)="filterByType($event)">
              <option value="all">Tous les types</option>
              <option value="department">Chef de département</option>
              <option value="ufr">Directeur UFR</option>
              <option value="vice-rector">Vice-Recteur</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Statut</label>
            <select class="form-control" (change)="filterByStatus($event)">
              <option value="all">Tous les statuts</option>
              <option value="active">En cours</option>
              <option value="upcoming">À venir</option>
              <option value="completed">Terminées</option>
            </select>
          </div>
        </div>

        <!-- Liste des élections -->
        <div class="elections-grid">
          <div *ngFor="let election of elections" class="election-card">
            <div class="election-header">
              <span class="election-type">{{ election.type }}</span>
              <span class="election-status" [class]="election.status">
                {{ election.status === 'active' ? 'En cours' : 
                   election.status === 'upcoming' ? 'À venir' : 'Terminée' }}
              </span>
            </div>

            <h2>{{ election.title }}</h2>
            <p class="election-description">{{ election.description }}</p>

            <div class="election-details">
              <div class="detail-item">
                <span class="detail-label">Début</span>
                <span class="detail-value">{{ election.startDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fin</span>
                <span class="detail-value">{{ election.endDate | date:'dd/MM/yyyy' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Candidats</span>
                <span class="detail-value">{{ election.candidates.length }}</span>
              </div>
            </div>

            <div class="election-info">
              <h3>Informations importantes</h3>
              <ul>
                <li>Électeurs concernés : {{ election.voters }}</li>
                <li>Quorum requis : {{ election.quorum }}%</li>
                <li>Type de majorité : {{ election.majorityType }}</li>
              </ul>
            </div>

            <div class="election-actions">
              <a routerLink="/auth/login" class="btn btn-primary" *ngIf="election.status === 'active'">
                Participer
              </a>
              <button class="btn btn-outline" (click)="viewCandidates(election)">
                Voir les candidats
              </button>
              <a routerLink="/resultats" class="btn btn-outline" *ngIf="election.status === 'completed'">
                Voir les résultats
              </a>
            </div>
          </div>
        </div>

        <!-- Modal des candidats -->
        <div class="modal" *ngIf="showCandidatesModal" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Candidats - {{ selectedElection?.title }}</h3>
              <button class="btn-close" (click)="closeModal()">×</button>
            </div>
            <div class="modal-body">
              <div class="candidates-list">
                <div *ngFor="let candidate of selectedElection?.candidates" class="candidate-item">
                  <div class="candidate-info">
                    <h4>{{ candidate.name }}</h4>
                    <p>{{ candidate.position }}</p>
                  </div>
                  <div class="candidate-program">
                    <h5>Programme électoral</h5>
                    <p>{{ candidate.program }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .elections-page {
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

    .filters {
      display: flex;
      gap: 24px;
      margin-bottom: 40px;
    }

    .filter-group {
      flex: 1;
    }

    .filter-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--primary);
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid var(--gray-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: var(--transition);
    }

    .form-control:focus {
      border-color: var(--secondary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }

    .elections-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }

    .election-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }

    .election-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .election-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .election-type {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .election-status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .election-status.active {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .election-status.upcoming {
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
    }

    .election-status.completed {
      background: rgba(158, 158, 158, 0.1);
      color: #9E9E9E;
    }

    .election-card h2 {
      font-size: 1.5rem;
      margin-bottom: 12px;
      color: var(--primary);
    }

    .election-description {
      color: var(--gray-500);
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .election-details {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 0.85rem;
      color: var(--gray-500);
    }

    .detail-value {
      font-weight: 500;
      color: var(--primary);
    }

    .election-info {
      margin-bottom: 24px;
    }

    .election-info h3 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: var(--primary);
    }

    .election-info ul {
      list-style: none;
      padding: 0;
    }

    .election-info li {
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
      color: var(--gray-500);
    }

    .election-info li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--secondary);
    }

    .election-actions {
      display: flex;
      gap: 12px;
    }

    /* Modal styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: var(--border-radius);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--gray-500);
    }

    .modal-body {
      padding: 20px;
    }

    .candidates-list {
      display: grid;
      gap: 24px;
    }

    .candidate-item {
      padding: 20px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .candidate-info h4 {
      margin: 0 0 8px;
      color: var(--primary);
    }

    .candidate-info p {
      margin: 0;
      color: var(--gray-500);
    }

    .candidate-program {
      margin-top: 16px;
    }

    .candidate-program h5 {
      font-size: 1rem;
      margin-bottom: 8px;
      color: var(--primary);
    }

    .candidate-program p {
      color: var(--gray-500);
      line-height: 1.6;
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

      .filters {
        flex-direction: column;
      }

      .election-details {
        grid-template-columns: 1fr;
      }

      .election-actions {
        flex-direction: column;
      }

      .election-actions button,
      .election-actions a {
        width: 100%;
      }
    }
  `]
})
export class ElectionsListComponent {
  elections: Election[] = [];
  showCandidatesModal = false;
  selectedElection: Election | null = null;

  constructor(private electionService: ElectionService) {
    this.loadElections();
  }

  async loadElections() {
    try {
      // Données de démonstration
      this.elections = [
        {
          id: 1,
          type: 'Chef de Département',
          title: 'Élection Chef du Département Informatique',
          description: 'Élection pour le poste de chef du département informatique pour un mandat de 2 ans.',
          startDate: new Date('2025-05-15'),
          endDate: new Date('2025-05-25'),
          status: 'upcoming',
          voters: 'Personnel enseignant du département',
          quorum: 50,
          majorityType: 'Absolue',
          candidates: [
            {
              id: 1,
              userId: 1,
              electionId: 1,
              name: 'Dr. Mansour diouf',
              position: 'Maître de conférences',
              program: 'Programme axé sur la modernisation des enseignements et le développement de la recherche.',
              status: 'approved'
            },
            {
              id: 2,
              userId: 2,
              electionId: 1,
              name: 'Pr. seny mbaye',
              position: 'Professeure des universités',
              program: 'Programme centré sur l\'innovation pédagogique et les partenariats internationaux.',
              status: 'approved'
            }
          ]
        },
        {
          id: 2,
          type: 'Directeur UFR',
          title: 'Élection Directeur UFR Sciences',
          description: 'Élection pour le poste de directeur de l\'UFR Sciences pour un mandat de 4 ans.',
          startDate: new Date('2025-06-01'),
          endDate: new Date('2025-06-15'),
          status: 'upcoming',
          voters: 'Personnel enseignant de l\'UFR',
          quorum: 60,
          majorityType: 'Absolue',
          candidates: [
            {
              id: 3,
              userId: 3,
              electionId: 2,
              name: 'Pr. Dethie sarr',
              position: 'Professeur des universités',
              program: 'Développement de la recherche et renforcement des liens avec l\'industrie.',
              status: 'approved'
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Erreur lors du chargement des élections:', error);
    }
  }

  filterByType(event: any) {
    const type = event.target.value;
    // Implémenter le filtrage par type
  }

  filterByStatus(event: any) {
    const status = event.target.value;
    // Implémenter le filtrage par statut
  }

  viewCandidates(election: Election) {
    this.selectedElection = election;
    this.showCandidatesModal = true;
  }

  closeModal() {
    this.showCandidatesModal = false;
    this.selectedElection = null;
  }
}