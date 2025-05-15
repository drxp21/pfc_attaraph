import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Interface pour représenter une élection
interface Election {
  id: number;
  type: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: 'active' | 'en attente' | 'terminée';
  candidats: number;
}

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- En-tête de la section -->
    <div class="section-header">
      <div class="header-content">
        <h2>Gestion des Élections</h2>
        <p>Gérez les élections en cours et créez de nouvelles élections</p>
      </div>
      <button class="btn btn-primary" (click)="toggleNewElectionForm()">
        {{ showNewElectionForm ? 'Fermer' : 'Nouvelle Élection' }}
      </button>
    </div>

    <!-- Formulaire de création d'élection -->
    <div class="card" *ngIf="showNewElectionForm">
      <h3>Configurer une nouvelle élection</h3>
      <form [formGroup]="electionForm" (ngSubmit)="onSubmit()" class="election-form">
        <div class="form-group">
          <label for="type">Type d'élection</label>
          <select id="type" formControlName="type" class="form-control">
            <option value="">Sélectionnez un type</option>
            <option value="chef-dept">Chef de département</option>
            <option value="directeur-ufr">Directeur/Vice-Directeur d'UFR</option>
            <option value="vice-recteur">Vice-Recteur</option>
          </select>
        </div>

        <div class="form-group">
          <label for="nom">Nom de l'élection</label>
          <input type="text" id="nom" formControlName="nom" class="form-control" 
                 placeholder="Ex: Élection Chef du Département Informatique">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dateDebut">Date de début</label>
            <input type="date" id="dateDebut" formControlName="dateDebut" class="form-control">
          </div>

          <div class="form-group">
            <label for="dateFin">Date de fin</label>
            <input type="date" id="dateFin" formControlName="dateFin" class="form-control">
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" class="form-control" 
                    rows="4" placeholder="Décrivez l'objectif et les modalités de cette élection..."></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="resetForm()">Réinitialiser</button>
          <button type="submit" class="btn btn-primary" [disabled]="!electionForm.valid">
            Créer l'élection
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des élections en cours -->
    <div class="card mt-4">
      <h3>Élections en cours</h3>
      <div class="table-responsive">
        <table class="elections-table">
          <thead>
            <tr>
              <th>Type d'élection</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Statut</th>
              <th>Candidats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let election of elections">
              <td>{{ election.type }}</td>
              <td>{{ election.dateDebut | date:'dd/MM/yyyy' }}</td>
              <td>{{ election.dateFin | date:'dd/MM/yyyy' }}</td>
              <td>
                <span class="status-badge" [class]="election.statut">
                  {{ election.statut }}
                </span>
              </td>
              <td>{{ election.candidats }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon" title="Modifier">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button class="btn-icon" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                  <button class="btn-icon" title="Voir les détails">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statistiques des élections -->
    <div class="stats-grid mt-4">
      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">3</span>
          <span class="stat-label">Élections actives</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">12</span>
          <span class="stat-label">Candidats total</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">78%</span>
          <span class="stat-label">Taux participation</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Styles de l'en-tête de section */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-content h2 {
      margin: 0;
      color: var(--primary);
    }

    .header-content p {
      margin: 4px 0 0;
      color: var(--gray-500);
    }

    /* Styles des cartes */
    .card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .card h3 {
      margin: 0 0 24px;
      color: var(--primary);
    }

    /* Styles du formulaire */
    .election-form {
      display: grid;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 500;
      color: var(--primary);
    }

    .form-control {
      padding: 10px;
      border: 1px solid var(--gray-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--secondary);
      box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }

    /* Styles de la table */
    .table-responsive {
      overflow-x: auto;
    }

    .elections-table {
      width: 100%;
      border-collapse: collapse;
    }

    .elections-table th,
    .elections-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--gray-200);
    }

    .elections-table th {
      font-weight: 600;
      color: var(--primary);
      background: var(--gray-100);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .status-badge.en-attente {
      background: rgba(255, 193, 7, 0.1);
      color: #FFC107;
    }

    .status-badge.terminée {
      background: rgba(158, 158, 158, 0.1);
      color: #9E9E9E;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      padding: 6px;
      border: none;
      background: none;
      color: var(--primary);
      cursor: pointer;
      border-radius: var(--border-radius);
      transition: all 0.3s ease;
    }

    .btn-icon:hover {
      background: var(--gray-100);
    }

    /* Styles des statistiques */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: var(--gray-100);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
    }

    .stat-label {
      color: var(--gray-500);
      font-size: 0.9rem;
    }

    /* Utilitaires */
    .mt-4 {
      margin-top: 24px;
    }
  `]
})
export class ElectionsComponent {
  showNewElectionForm = false;
  electionForm: FormGroup;

  // Données de démonstration
  elections: Election[] = [
    {
      id: 1,
      type: 'Chef de Département Informatique',
      nom: 'Élection Chef Département Info 2025',
      dateDebut: '2025-01-15',
      dateFin: '2025-01-25',
      statut: 'active',
      candidats: 3
    },
    {
      id: 2,
      type: 'Directeur UFR Sciences',
      nom: 'Élection Directeur UFR Sciences 2025',
      dateDebut: '2025-02-01',
      dateFin: '2025-02-15',
      statut: 'en attente',
      candidats: 2
    }
  ];

  constructor(private fb: FormBuilder) {
    this.electionForm = this.fb.group({
      type: ['', Validators.required],
      nom: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  toggleNewElectionForm() {
    this.showNewElectionForm = !this.showNewElectionForm;
    if (!this.showNewElectionForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.electionForm.reset();
  }

  onSubmit() {
    if (this.electionForm.valid) {
      console.log('Nouvelle élection:', this.electionForm.value);
      // Logique pour sauvegarder l'élection
      this.resetForm();
      this.showNewElectionForm = false;
    }
  }
}