import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  ElectionService,
  Election,
  TypeElection,
} from '../../../../core/services/election.service';
import { AuthService, User } from '../../../../core/services/auth.service';

// Placeholder for Departement interface and service - replace with your actual imports
export interface Departement {
  id: number;
  nom: string;
}

// Mock DepartementService - replace with your actual service injection
// import { DepartementService } from '../../../../core/services/departement.service';

// Validator to ensure a date is not in the past (allows today)
export function notPastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values, let 'required' handle it
    }
    // For <input type="date">, value is "YYYY-MM-DD".
    // Append time to ensure it's compared as local start of day.
    const selectedDateString = control.value + 'T00:00:00';
    const selectedDate = new Date(selectedDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare with start of today

    console.log('[notPastDateValidator] Control Value:', control.value);
    console.log('[notPastDateValidator] Selected Date (as Date object):', selectedDate);
    console.log('[notPastDateValidator] Today (midnight as Date object):', today);
    console.log('[notPastDateValidator] Is selectedDate < today?:', selectedDate < today);

    return selectedDate < today ? { pastDate: true } : null;
  };
}

// Validator to ensure dateTwoControlName is after dateOneControlName
export function dateRangeValidator(dateOneControlName: string, dateTwoControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const dateOneControl = formGroup.get(dateOneControlName);
    const dateTwoControl = formGroup.get(dateTwoControlName);

    if (!dateOneControl || !dateTwoControl || !dateOneControl.value || !dateTwoControl.value) {
      return null; // Don't validate if controls or values are missing
    }

    const d1 = new Date(dateOneControl.value + 'T00:00:00');
    const d2 = new Date(dateTwoControl.value + 'T00:00:00');

    if (d2 <= d1) {
      // Set error on the second date control for specific error message display
      dateTwoControl.setErrors({ ...dateTwoControl.errors, dateOrder: true });
      return { [`${dateTwoControlName}Order`]: true }; // Return a unique error key for the group
    } else {
      // Clear the specific error if it was previously set
      const errors = dateTwoControl.errors;
      if (errors && errors['dateOrder']) {
        delete errors['dateOrder'];
        if (Object.keys(errors).length === 0) {
          dateTwoControl.setErrors(null);
        } else {
          dateTwoControl.setErrors(errors);
        }
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, RouterModule],
  template: `
    <!-- En-tête de la section -->
    <div class="section-header">
      <div class="header-content">
        <h2>Gestion des Élections</h2>
        <p>Gérez les élections en cours et créez de nouvelles élections</p>
      </div>
      <button
        class="btn btn-primary"
        (click)="toggleNewElectionForm()"
      >
        {{ showNewElectionForm ? "Fermer Formulaire" : "Nouvelle Élection" }}
      </button>
    </div>

    <!-- Formulaire de création/modification d'élection -->
    <div class="card" *ngIf="(showNewElectionForm || isEditMode) && isAdmin">
      <h3>
        {{
          isEditMode ? "Modifier l'élection" : "Configurer une nouvelle élection"
        }}
      </h3>
      <form
        [formGroup]="electionForm"
        (ngSubmit)="onSubmit()"
        class="election-form"
      >
       
        <div class="form-group">
          <label for="titre">Nom de l'élection</label>
          <input
            type="text"
            id="titre"
            formControlName="titre"
            class="form-control"
            placeholder="Ex: Élection Chef du Département Informatique"
          />
        </div>

        <div class="form-group">
          <label for="type_election">Type d'élection</label>
          <select
            id="type_election"
            formControlName="type_election"
            class="form-control"
          >
            <option value="" disabled>Sélectionnez un type</option>
            <option *ngFor="let type of electionTypes" [value]="type.value">
              {{ type.viewValue }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            class="form-control"
            rows="4"
            placeholder="Décrivez l'objectif et les modalités de cette élection..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="departement_id">Département</label>
          <select
            id="departement_id"
            formControlName="departement_id"
            class="form-control"
          >
            <option [ngValue]="null">Sélectionnez un département (ou laissez vide)</option>
            <option *ngFor="let dept of departements" [value]="dept.id">
              {{ dept.nom }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date_debut_candidature">Début des candidatures</label>
            <input
              type="date"
              id="date_debut_candidature"
              formControlName="date_debut_candidature"
              class="form-control"
            />
            <div *ngIf="electionForm.controls['date_debut_candidature'].invalid && (electionForm.controls['date_debut_candidature'].dirty || electionForm.controls['date_debut_candidature'].touched)" class="error-message">
              <div *ngIf="electionForm.controls['date_debut_candidature'].errors?.['required']">La date de début des candidatures est requise.</div>
              <div *ngIf="electionForm.controls['date_debut_candidature'].errors?.['pastDate']">La date de début des candidatures ne peut pas être dans le passé.</div>
            </div>
          </div>
          <div class="form-group">
            <label for="date_fin_candidature">Fin des candidatures</label>
            <input
              type="date"
              id="date_fin_candidature"
              formControlName="date_fin_candidature"
              class="form-control"
            />
            <div *ngIf="electionForm.controls['date_fin_candidature'].invalid && (electionForm.controls['date_fin_candidature'].dirty || electionForm.controls['date_fin_candidature'].touched)" class="error-message">
              <div *ngIf="electionForm.controls['date_fin_candidature'].errors?.['required']">La date de fin des candidatures est requise.</div>
              <div *ngIf="electionForm.controls['date_fin_candidature'].errors?.['dateOrder']">La date de fin des candidatures doit être après la date de début.</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date_debut_vote">Début du vote</label>
            <input
              type="date"
              id="date_debut_vote"
              formControlName="date_debut_vote"
              class="form-control"
            />
            <div *ngIf="electionForm.controls['date_debut_vote'].invalid && (electionForm.controls['date_debut_vote'].dirty || electionForm.controls['date_debut_vote'].touched)" class="error-message">
              <div *ngIf="electionForm.controls['date_debut_vote'].errors?.['required']">La date de début du vote est requise.</div>
              <div *ngIf="electionForm.controls['date_debut_vote'].errors?.['dateOrder']">La date de début du vote doit être après la date de fin des candidatures.</div>
            </div>
          </div>
          <div class="form-group">
            <label for="date_fin_vote">Fin du vote</label>
            <input
              type="date"
              id="date_fin_vote"
              formControlName="date_fin_vote"
              class="form-control"
            />
            <div *ngIf="electionForm.controls['date_fin_vote'].invalid && (electionForm.controls['date_fin_vote'].dirty || electionForm.controls['date_fin_vote'].touched)" class="error-message">
              <div *ngIf="electionForm.controls['date_fin_vote'].errors?.['required']">La date de fin du vote est requise.</div>
              <div *ngIf="electionForm.controls['date_fin_vote'].errors?.['dateOrder']">La date de fin du vote doit être après la date de début du vote.</div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
          <button type="button" class="btn btn-outline" (click)="cancelEdit()">
            {{ isEditMode ? "Annuler" : "Réinitialiser" }}
          </button>
          <button
            type="submit"
            class="btn btn-primary"
          >
            {{ isEditMode ? "Mettre à jour" : "Créer l'élection" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div class="modal-overlay" *ngIf="showDeleteConfirmation">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4>Confirmation de suppression</h4>
            <button type="button" class="close-btn" (click)="cancelDelete()">
              &times;
            </button>
          </div>
          <div class="modal-body">
            <p>
              Êtes-vous sûr de vouloir supprimer l'élection "{{
                electionToDelete?.titre
              }}" ?
            </p>
            <p class="warning">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" (click)="cancelDelete()">
              Annuler
            </button>
            <button type="button" class="btn btn-danger" (click)="deleteElection()">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des élections -->
    <div class="card mt-4">
      <h3>Liste des Élections</h3>
      <div *ngIf="elections.length === 0 && !isLoading" class="empty-state">
        Aucune élection à afficher pour le moment.
      </div>
      <div *ngIf="isLoading" class="loading-state">Chargement des élections...</div>
      <div class="table-responsive" *ngIf="elections.length > 0 && !isLoading">
        <table class="elections-table">
          <thead>
            <tr>
              <th>Nom de l'élection</th>
              <th>Type</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Statut</th>
              <th *ngIf="isAdmin">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let election of elections">
              <td>{{ election.titre }}</td>
              <td>{{ election.type_election }}</td>
              <td>{{ election.date_debut_candidature | date : "dd/MM/yyyy" }}</td>
              <td>{{ election.date_fin_candidature | date : "dd/MM/yyyy" }}</td>
              <td>
                <span
                  class="status-badge"
                  [ngClass]="getStatutClass(election.statut)"
                >
                  {{ mapStatutForDisplay(election.statut) }}
                </span>
              </td>
              <td *ngIf="isAdmin">
                <div class="actions">
                 
                  <button
                    *ngIf="election.statut === 'EN_COURS'"
                    (click)="closeElection(election.id)"
                    class="btn btn-sm btn-warning"
                    title="Fermer l'élection"
                  >
                    Fermer
                  </button>
                  <!-- Button to navigate to validate candidatures for this election -->
                  <a
                    *ngIf="election.statut === 'BROUILLON' || election.statut === 'OUVERTE' || election.statut === 'EN_COURS'"
                    [routerLink]="[
                      '/dashboard/admin/candidatures/validation',
                    ]"
                    class="btn btn-info"
                  >
                    Valider Candidatures
                  </a>
                  
                  <button
                    *ngIf="election.statut === 'BROUILLON'"
                    class="btn-icon"
                    title="Modifier"
                    (click)="editElection(election)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                  <button
                    *ngIf="election.statut === 'BROUILLON'"
                    class="btn-icon"
                    title="Supprimer"
                    (click)="confirmDeleteElection(election)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    /* Election Management Component Styles */

    /* Section Header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 24px 0;
      border-bottom: 1px solid var(--gray-200);
    }
    
    .header-content h2 {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .header-content p {
      color: var(--gray-500);
      font-size: 1rem;
      margin: 0;
    }
    
    /* Card Components */
    .card {
      background: white;
      border-radius: var(--border-radius);
      padding: 32px;
      box-shadow: var(--shadow-md);
      margin-bottom: 24px;
    }
    
    .card h3 {
      color: var(--primary);
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 24px;
    }
    
    .mt-4 {
      margin-top: 32px;
    }
    
    /* Form Styles */
    .election-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-weight: 500;
      color: var(--primary);
      font-size: 0.95rem;
    }
    
    .form-control {
      padding: 12px;
      border: 1px solid var(--gray-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: var(--transition);
      background: white;
    }
    
    .form-control:focus {
      border-color: var(--secondary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }
    
    .form-control::placeholder {
      color: var(--gray-400);
    }
    
    /* Form Row Layout */
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
    
    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid var(--gray-200);
    }
    
    @media (max-width: 480px) {
      .form-actions {
        flex-direction: column;
      }
    }
    
    /* Button Styles */
    .btn {
      padding: 12px 24px;
      border-radius: var(--border-radius);
      font-weight: 500;
      font-size: 0.95rem;
      cursor: pointer;
      transition: var(--transition);
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    .btn-outline {
      background: transparent;
      color: var(--primary);
      border: 1px solid var(--gray-300);
    }
    
    .btn-outline:hover {
      background: var(--gray-50);
      border-color: var(--primary);
    }
    
    .btn-success {
      background: var(--success, #4caf50);
      color: white;
    }
    
    .btn-success:hover {
      background: #45a049;
    }
    
    .btn-warning {
      background: var(--warning, #ff9800);
      color: white;
    }
    
    .btn-warning:hover {
      background: #f57c00;
    }
    
    .btn-danger {
      background: var(--error, #f44336);
      color: white;
    }
    
    .btn-danger:hover {
      background: #d32f2f;
    }
    
    .btn-info {
      background: var(--info, #2196f3);
      color: white;
      font-size: 0.9rem;
      padding: 8px 16px;
    }
    
    .btn-info:hover {
      background: #1976d2;
    }
    
    .btn-sm {
      padding: 8px 16px;
      font-size: 0.9rem;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Icon Buttons */
    .btn-icon {
      background: none;
      border: none;
      padding: 8px;
      border-radius: var(--border-radius);
      color: var(--gray-500);
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-icon:hover {
      background: var(--gray-100);
      color: var(--primary);
    }
    
    /* Table Styles */
    .table-responsive {
      overflow-x: auto;
      border-radius: var(--border-radius);
      border: 1px solid var(--gray-200);
    }
    
    .elections-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    
    .elections-table th {
      background: var(--gray-50);
      color: var(--primary);
      font-weight: 600;
      padding: 16px;
      text-align: left;
      border-bottom: 2px solid var(--gray-200);
      font-size: 0.95rem;
    }
    
    .elections-table td {
      padding: 16px;
      border-bottom: 1px solid var(--gray-200);
      color: var(--gray-700);
    }
    
    .elections-table tr:hover {
      background: var(--gray-50);
    }
    
    /* Status Badges */
    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-badge.BROUILLON {
      background: rgba(158, 158, 158, 0.1);
      color: #757575;
    }
    
    .status-badge.OUVERTE {
      background: rgba(76, 175, 80, 0.1);
      color: #388e3c;
    }
    
    .status-badge.EN_COURS {
      background: rgba(33, 150, 243, 0.1);
      color: #1976d2;
    }
    
    .status-badge.FERMEE {
      background: rgba(244, 67, 54, 0.1);
      color: #d32f2f;
    }
    
    /* Actions Column */
    .actions {
      display: flex;
      justify-content: end;
      gap: 8px;
      align-items: center;
    }
     .error-message {
      color: #f44336;
      padding: 15px;
      margin: 10px 0;
      background-color: #ffebee;
      border-radius: 4px;
    }

    /* Modal Styles */
    .modal-overlay {
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
      padding: 20px;
    }
    
    .modal-dialog {
      width: 100%;
      max-width: 500px;
    }
    
    .modal-content {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    
    .modal-header {
      padding: 24px 32px 16px;
      border-bottom: 1px solid var(--gray-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h4 {
      color: var(--primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--gray-500);
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: var(--transition);
    }
    
    .close-btn:hover {
      background: var(--gray-100);
      color: var(--primary);
    }
    
    .modal-body {
      padding: 24px 32px;
    }
    
    .modal-body p {
      color: var(--gray-700);
      margin-bottom: 16px;
      line-height: 1.5;
    }
    
    .modal-body .warning {
      color: var(--warning, #ff9800);
      font-weight: 500;
      margin: 0;
    }
    
    .modal-footer {
      padding: 16px 32px 24px;
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
    
    /* State Messages */
    .empty-state, .loading-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--gray-500);
      font-size: 1.1rem;
    }
    
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    
    .loading-state::before {
      content: '';
      width: 20px;
      height: 20px;
      border: 2px solid var(--gray-300);
      border-radius: 50%;
      border-top-color: var(--primary);
      animation: spin 1s linear infinite;
    }
    
    /* Error Messages */
    .error-message {
      color: var(--error);
      font-size: 0.85rem;
      margin-top: 4px;
    }
    
    /* Animations */
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .card {
        padding: 24px;
      }
      
      .elections-table {
        font-size: 0.9rem;
      }
      
      .elections-table th,
      .elections-table td {
        padding: 12px 8px;
      }
      
      .actions {
        flex-direction: column;
        gap: 4px;
      }
      
      .modal-content {
        margin: 20px;
      }
      
      .modal-header,
      .modal-body,
      .modal-footer {
        padding-left: 24px;
        padding-right: 24px;
      }
    }
    
    /* Focus States for Accessibility */
    .btn:focus,
    .form-control:focus,
    .btn-icon:focus {
      outline: 2px solid var(--secondary);
      outline-offset: 2px;
    }
    
    /* Print Styles */
    @media print {
      .btn, .actions, .modal-overlay {
        display: none !important;
      }
      
      .card {
        box-shadow: none;
        border: 1px solid var(--gray-300);
      }
    }
  `]
})
export class ElectionsComponent implements OnInit, OnDestroy {
  electionTypes: { value: TypeElection; viewValue: string }[] = [
    { value: 'CHEF_DEPARTEMENT', viewValue: 'Chef de Département' },
    { value: 'DIRECTEUR_UFR', viewValue: "Directeur d'UFR" },
    { value: 'VICE_RECTEUR', viewValue: 'Vice-Recteur' },
  ];
  showNewElectionForm = false;
  electionForm: FormGroup;
  elections: Election[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  departements: Departement[] = []; // To store fetched departments
  isLoadingDepartements = false; // To track loading state for departments

  isEditMode = false;
  currentElectionId: number | null = null;
  showDeleteConfirmation = false;
  electionToDelete: Election | null = null;

  isAdmin = false;
  private userSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private electionService: ElectionService,
    private authService: AuthService,
    // private departementService: DepartementService, // Uncomment and use your actual service
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.electionForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      type_election: ['', Validators.required],
      departement_id: [null], // Optional, will be a number (ID) or null
      date_debut_candidature: ['', [Validators.required, notPastDateValidator()]],
      date_fin_candidature: ['', Validators.required],
      date_debut_vote: ['', Validators.required],
      date_fin_vote: ['', Validators.required],
    }, {
      validators: [
        dateRangeValidator('date_debut_candidature', 'date_fin_candidature'),
        dateRangeValidator('date_fin_candidature', 'date_debut_vote'),
        dateRangeValidator('date_debut_vote', 'date_fin_vote') // Assuming fin_vote should be after debut_vote
      ]
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      console.log('ElectionsComponent - User from AuthService:', user);
      this.isAdmin = user?.type_personnel === 'ADMIN';
      console.log('ElectionsComponent - isAdmin:', this.isAdmin);
    });
    this.loadElections();
    this.loadDepartements(); // Load departments
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.elections = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des élections:', err);
        this.isLoading = false;
        // TODO: Afficher un message d'erreur à l'utilisateur
      },
    });
  }

  loadDepartements(): void {
    this.isLoadingDepartements = true;
    // MOCK IMPLEMENTATION: Replace with your actual service call
    // For example: this.departementService.getDepartements().subscribe({ ... });
    setTimeout(() => { // Simulating an API call
      this.departements = [
        { id: 1, nom: 'Département Informatique' },
        { id: 2, nom: 'Département Mathématiques' },
        { id: 3, nom: 'Département Physique' },
        { id: 10, nom: 'UFR Sciences et Technologies' },
      ];
      this.isLoadingDepartements = false;
      console.log('Mock departements loaded:', this.departements);
    }, 1000);
    // Handle errors appropriately in your actual implementation
  }

  toggleNewElectionForm(): void {
    this.showNewElectionForm = !this.showNewElectionForm;
    if (!this.showNewElectionForm) {
      this.resetForm();
    }
  }

  viewResults(election: Election) {
    this.router.navigate(['election', election.id, 'results'], { relativeTo: this.route });
  }

  // Also adding the other working methods from your component for consistency
  viewElection(election: Election, event?: Event) {
    // Prevent event bubbling if this was called from a button click
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['election', election.id], { relativeTo: this.route });
  }

  // Keep this method for backward compatibility
  vote(election: Election) {
    this.viewElection(election);
  }

  viewCandidates(election: Election) {
    this.router.navigate(['election', election.id], { relativeTo: this.route });
  }

  resetForm(): void {
    this.electionForm.reset({
      titre: '',
      description: '',
      type_election: '',
      departement_id: null, // Ensure this is reset to null for the dropdown
      date_debut_candidature: '',
      date_fin_candidature: '',
      date_debut_vote: '',
      date_fin_vote: '',
      // Set other defaults if needed, e.g., departement_id: null if it's not automatically null
    });
    this.isEditMode = false;
    this.currentElectionId = null;
  }

  cancelEdit(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.currentElectionId = null;
      this.showNewElectionForm = false;
    } else {
      this.resetForm();
    }
  }

  editElection(election: Election): void {
    window.scrollTo(0, 0);
    if (election.statut !== 'BROUILLON') return;

    this.isEditMode = true;
    this.currentElectionId = election.id;
    this.showNewElectionForm = false; // Hide the new election form if it's open

    // Format dates for the form (YYYY-MM-DD format for input[type=date])
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr); // dateStr est la date de l'API

      // Extrait les composantes de la date locale
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() est 0-indexed
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    const valuesToPatch = {
      titre: election.titre,
      description: election.description,
      type_election: election.type_election,
      departement_id: election.departement_id !== undefined && election.departement_id !== null ? Number(election.departement_id) : null,
      date_debut_candidature: formatDate(election.date_debut_candidature),
      date_fin_candidature: formatDate(election.date_fin_candidature),
      date_debut_vote: formatDate(election.date_debut_vote),
      date_fin_vote: formatDate(election.date_fin_vote),
    };
    console.log('[editElection] Values to patch form with:', valuesToPatch);

    this.electionForm.patchValue(valuesToPatch);
  }

  confirmDeleteElection(election: Election): void {
    if (!this.isAdmin) return;

    this.electionToDelete = election;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.electionToDelete = null;
  }

  deleteElection(): void {
    if (!this.isAdmin || !this.electionToDelete) return;

    this.electionService.deleteElection(this.electionToDelete.id).subscribe({
      next: () => {
        console.log(
          `Élection ${this.electionToDelete?.id} supprimée avec succès.`
        );
        this.loadElections(); // Refresh list
        this.cancelDelete(); // Close the confirmation dialog
        // TODO: Afficher un message de succès
      },
      error: (err) => {
        console.error(
          `Erreur lors de la suppression de l'élection ${this.electionToDelete?.id}:`,
          err
        );
        // TODO: Afficher un message d'erreur
      },
    });
  }

  onSubmit(): void {
 
      // Ensure all fields expected by the backend are present, even if optional and empty
      const formValue = this.electionForm.value;

      const electionData: Partial<Election> = {
        titre: formValue.titre,
        description: formValue.description,
        type_election: formValue.type_election,
        date_debut_candidature: formValue.date_debut_candidature,
        date_fin_candidature: formValue.date_fin_candidature,
        date_debut_vote: formValue.date_debut_vote,
        date_fin_vote: formValue.date_fin_vote,
        // statut will be set below
      };

      // Only set statut for new elections, not when editing
      if (!this.isEditMode) {
        electionData.statut = 'BROUILLON'; // Backend expects this for new/draft elections
      }

      // Handle optional departement_id: if it's null or not a valid number from the form,
      // make it undefined or omit it. Since it's type number, empty input becomes null.
      if (
        formValue.departement_id !== null &&
        formValue.departement_id !== '' && // Check for empty string if select allows it
        !isNaN(Number(formValue.departement_id))
      ) {
        electionData.departement_id = Number(formValue.departement_id);
      } else {
        electionData.departement_id = undefined; // Ensure it's undefined if not set or invalid
        // If null, or NaN (e.g. if input was text), treat as not provided.
        // It will be undefined by not being set on electionData if it's not added above.
        // Or explicitly: electionData.departement_id = undefined;
      }

      if (this.isEditMode && this.currentElectionId) {
        // Update existing election
        console.log(
          `Mise à jour de l'élection ${this.currentElectionId} (payload):`,
          electionData
        );
        this.electionService
          .updateElection(this.currentElectionId, electionData)
          .subscribe({
            next: (updatedElection) => {
              console.log(
                `Élection ${this.currentElectionId} mise à jour avec succès:`,
                updatedElection
              );
              this.loadElections(); // Refresh list
              this.resetForm();
              this.isEditMode = false;
              this.currentElectionId = null;
              // TODO: Afficher un message de succès
            },
            error: (err) => {
              console.error(`Erreur lors de la mise à jour de l'élection ${this.currentElectionId}:`, err);
              this.errorMessage = 'Erreur lors de la mise à jour de l\'élection.'; // Default message
              if (err.error && err.error.errors && typeof err.error.errors === 'object') {
                const fieldErrors = err.error.errors;
                const errorKeys = Object.keys(fieldErrors);
                if (errorKeys.length > 0) {
                  const firstErrorFieldKey = errorKeys[0];
                  const messagesForField = fieldErrors[firstErrorFieldKey];
                  if (Array.isArray(messagesForField) && messagesForField.length > 0) {
                    this.errorMessage = messagesForField[0];
                  }
                }
              } else if (err.error && typeof err.error.message === 'string') { // Fallback for general backend error message
                this.errorMessage = err.error.message;
              } else if (typeof err.message === 'string') { // Fallback for top-level error message
                  this.errorMessage = err.message;
              }
              // TODO: Afficher un message d'erreur détaillé (partially addressed)
            },
          });
      } else {
        // Create new election
        console.log('Nouvelle élection (payload):', electionData);
        this.electionService.createElection(electionData).subscribe({
          next: (newElection) => {
            console.log('Élection créée avec succès:', newElection);
            this.loadElections(); // Refresh list
            this.resetForm();
            this.showNewElectionForm = false;
            // TODO: Afficher un message de succès
          },
          error: (err) => {
            console.error("Erreur lors de la création de l'élection:", err);
            // TODO: Afficher un message d'erreur détaillé
          },
        });
      }
    
  }

  openElection(electionId: number): void {
    if (!this.isAdmin) return;
    this.electionService.openElection(electionId).subscribe({
      next: () => {
        console.log(`Élection ${electionId} ouverte avec succès.`);
        this.loadElections(); // Refresh list
        // TODO: Afficher un message de succès
      },
      error: (err) => {
        console.error(
          `Erreur lors de l'ouverture de l'élection ${electionId}:`,
          err
        );
        // TODO: Afficher un message d'erreur
      },
    });
  }

  closeElection(electionId: number): void {
    if (!this.isAdmin) return;
    this.electionService.closeElection(electionId).subscribe({
      next: () => {
        console.log(`Élection ${electionId} fermée avec succès.`);
        this.loadElections(); // Refresh list
        // TODO: Afficher un message de succès (e.g., via a toast notification)
        // this.toastService.showSuccess(`Élection ${electionId} fermée avec succès.`);
      },
      error: (err) => {
        console.error(
          `Erreur lors de la fermeture de l'élection ${electionId}:`,
          err
        );
        const errorMessage = err.error?.message || `Erreur lors de la fermeture de l'élection.`
        // TODO: Afficher un message d'erreur à l'utilisateur (e.g., via a toast notification)
        // this.toastService.showError(errorMessage);
        alert(errorMessage); // Using alert as a placeholder for a toast
      },
    });
  }

  // Helper for template to map status to CSS class
  getStatutClass(statut: string | undefined): string {
    if (!statut) return '';
    switch (statut) {
      case 'OUVERTE':
        return 'active'; // Or a new class like 'ouverte'
      case 'EN_COURS':
        return 'active'; // Or a new class like 'en-cours'
      case 'BROUILLON':
        return 'draft';
      case 'FERMEE':
        return 'closed'; // Or a new class like 'fermee'
      default:
        return ''; // Should not happen if statut is one of the defined types
    }
  }

  mapStatutForDisplay(statut: string | undefined): string {
    if (!statut) return 'N/A';
    const mapping: { [key: string]: string } = {
      'BROUILLON': 'Brouillon',
      'OUVERTE': 'Ouverte',
      'EN_COURS': 'En Cours',
      'FERMEE': 'Fermée',
    };
    return mapping[statut] || statut; // Fallback to raw statut if not in map
  }
}