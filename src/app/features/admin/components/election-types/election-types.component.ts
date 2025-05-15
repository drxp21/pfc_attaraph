import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Interface pour représenter un type d'élection
interface ElectionType {
  id: number;
  nom: string;
  description: string;
  electeurs: string[];
  criteres: string[];
  dureeMandat: number;
}

@Component({
  selector: 'app-election-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- En-tête de la section -->
    <div class="section-header">
      <div class="header-content">
        <h2>Types d'Élection</h2>
        <p>Définissez et configurez les différents types d'élections universitaires</p>
      </div>
      <button class="btn btn-primary" (click)="toggleNewTypeForm()">
        {{ showNewTypeForm ? 'Fermer' : 'Nouveau Type' }}
      </button>
    </div>

    <!-- Formulaire de création de type d'élection -->
    <div class="card" *ngIf="showNewTypeForm">
      <h3>Configurer un nouveau type d'élection</h3>
      <form [formGroup]="typeForm" (ngSubmit)="onSubmit()" class="type-form">
        <div class="form-group">
          <label for="nom">Nom du type d'élection</label>
          <input type="text" id="nom" formControlName="nom" class="form-control" 
                 placeholder="Ex: Chef de département">
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" class="form-control" 
                    rows="3" placeholder="Décrivez ce type d'élection..."></textarea>
        </div>

        <div class="form-group">
          <label for="dureeMandat">Durée du mandat (en années)</label>
          <input type="number" id="dureeMandat" formControlName="dureeMandat" 
                 class="form-control" min="1" max="10">
        </div>

        <div class="form-group">
          <label>Électeurs autorisés</label>
          <div class="checkbox-group">
            <label class="checkbox-container">
              <input type="checkbox" formControlName="perAutorise">
              <span class="checkmark"></span>
              Personnel Enseignant et de Recherche (PER)
            </label>
            <label class="checkbox-container">
              <input type="checkbox" formControlName="patsAutorise">
              <span class="checkmark"></span>
              Personnel Administratif (PATS)
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Critères d'éligibilité</label>
          <div class="criteria-list">
            <div class="criteria-item" *ngFor="let critere of criteresEligibilite; let i = index">
              <input type="text" [value]="critere" class="form-control" 
                     (input)="updateCritere(i, $event)">
              <button type="button" class="btn-icon" (click)="removeCritere(i)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <button type="button" class="btn btn-outline btn-sm" (click)="addCritere()">
              Ajouter un critère
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="resetForm()">
            Réinitialiser
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="!typeForm.valid">
            Créer le type
          </button>
        </div>
      </form>
    </div>

    <!-- Liste des types d'élection -->
    <div class="card mt-4">
      <h3>Types d'élection existants</h3>
      <div class="types-grid">
        <div class="type-card" *ngFor="let type of electionTypes">
          <div class="type-header">
            <h4>{{ type.nom }}</h4>
            <div class="type-actions">
              <button class="btn-icon" title="Modifier">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button class="btn-icon" title="Supprimer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
          
          <p class="type-description">{{ type.description }}</p>
          
          <div class="type-info">
            <div class="info-item">
              <span class="info-label">Durée du mandat</span>
              <span class="info-value">{{ type.dureeMandat }} ans</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Électeurs autorisés</span>
              <div class="tags">
                <span class="tag" *ngFor="let electeur of type.electeurs">
                  {{ electeur }}
                </span>
              </div>
            </div>
            
            <div class="info-item">
              <span class="info-label">Critères d'éligibilité</span>
              <ul class="criteria-list">
                <li *ngFor="let critere of type.criteres">{{ critere }}</li>
              </ul>
            </div>
          </div>
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
    .type-form {
      display: grid;
      gap: 20px;
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

    /* Styles des checkboxes */
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid var(--gray-300);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .checkbox-container input:checked + .checkmark {
      background-color: var(--secondary);
      border-color: var(--secondary);
    }

    /* Styles de la liste des critères */
    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .criteria-item {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.9rem;
    }

    /* Styles de la grille des types */
    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .type-card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius);
      padding: 20px;
      transition: all 0.3s ease;
    }

    .type-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .type-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .type-header h4 {
      margin: 0;
      color: var(--primary);
      font-size: 1.2rem;
    }

    .type-actions {
      display: flex;
      gap: 8px;
    }

    .type-description {
      color: var(--gray-500);
      font-size: 0.95rem;
      margin-bottom: 20px;
    }

    .type-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .info-label {
      font-weight: 500;
      color: var(--primary);
      font-size: 0.9rem;
    }

    .info-value {
      color: var(--gray-700);
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background: var(--gray-100);
      color: var(--primary);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    .criteria-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .criteria-list li {
      color: var(--gray-700);
      font-size: 0.9rem;
      margin-bottom: 4px;
      padding-left: 16px;
      position: relative;
    }

    .criteria-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--secondary);
    }

    /* Utilitaires */
    .mt-4 {
      margin-top: 24px;
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

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }
  `]
})
export class ElectionTypesComponent {
  showNewTypeForm = false;
  typeForm: FormGroup;
  criteresEligibilite: string[] = ['Être en poste depuis au moins 2 ans'];

  // Données de démonstration
  electionTypes: ElectionType[] = [
    {
      id: 1,
      nom: 'Chef de département',
      description: 'Élection du responsable d\'un département académique',
      electeurs: ['PER du département'],
      criteres: [
        'Être enseignant-chercheur titulaire',
        'Avoir au moins 2 ans d\'ancienneté',
        'Être rattaché au département concerné'
      ],
      dureeMandat: 2
    },
    {
      id: 2,
      nom: 'Directeur UFR',
      description: 'Élection du directeur d\'une Unité de Formation et de Recherche',
      electeurs: ['PER de l\'UFR'],
      criteres: [
        'Être professeur titulaire',
        'Avoir au moins 5 ans d\'expérience',
        'Avoir un projet pour l\'UFR'
      ],
      dureeMandat: 3
    }
  ];

  constructor(private fb: FormBuilder) {
    this.typeForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dureeMandat: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      perAutorise: [true],
      patsAutorise: [false]
    });
  }

  toggleNewTypeForm() {
    this.showNewTypeForm = !this.showNewTypeForm;
    if (!this.showNewTypeForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.typeForm.reset({
      dureeMandat: 2,
      perAutorise: true,
      patsAutorise: false
    });
    this.criteresEligibilite = ['Être en poste depuis au moins 2 ans'];
  }

  addCritere() {
    this.criteresEligibilite.push('');
  }

  removeCritere(index: number) {
    this.criteresEligibilite.splice(index, 1);
  }

  updateCritere(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.criteresEligibilite[index] = input.value;
  }

  onSubmit() {
    if (this.typeForm.valid) {
      console.log('Nouveau type d\'élection:', {
        ...this.typeForm.value,
        criteres: this.criteresEligibilite
      });
      this.resetForm();
      this.showNewTypeForm = false;
    }
  }
}