import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CandidatureService, Candidature } from '../../../../../core/services/candidature.service';

@Component({
  selector: 'app-validation-candidatures',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="validation-container">
      <div class="page-header">
        <h2>Validation des Candidatures</h2>
        <p>Gérez et validez les candidatures aux élections</p>
      </div>

      <!-- Loading state -->
      <div *ngIf="isLoading" class="loading-state">
        <span class="spinner"></span>
        <p>Chargement des candidatures...</p>
      </div>

      <!-- Error state -->
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Empty state -->
      <div *ngIf="!isLoading && !error && pendingCandidatures.length === 0" class="empty-state">
        <p>Aucune candidature en attente de validation.</p>
      </div>

      <!-- Liste des candidatures en attente -->
      <div class="candidatures-grid" *ngIf="!isLoading && pendingCandidatures.length > 0">
        <div *ngFor="let candidature of pendingCandidatures" class="candidature-card">
          <div class="candidature-header">
            <span class="status-badge" [class]="candidature.statut.toLowerCase()">
              {{ mapStatus(candidature.statut) }}
            </span>
            <span class="submission-date">{{ candidature.date_soumission | date:'dd/MM/yyyy' }}</span>
          </div>

          <div class="candidate-info">
            <h3>{{ candidature.candidat?.nom }} {{ candidature.candidat?.prenom }}</h3>
            <p>{{ candidature.candidat?.type_personnel }}</p>
            <p class="election-title">{{ candidature.election?.titre }}</p>
          </div>

          <div class="program-section">
            <h4>Programme électoral</h4>
            <p>{{ candidature.programme }}</p>
          </div>

          <div class="validation-form" *ngIf="selectedCandidature?.id === candidature.id">
            <form [formGroup]="validationForm" (ngSubmit)="submitValidation(candidature)">
              <div class="form-group">
                <label>Décision</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" formControlName="statut" value="VALIDEE">
                    Approuver
                  </label>
                  <label class="radio-label">
                    <input type="radio" formControlName="statut" value="REJETEE">
                    Rejeter
                  </label>
                </div>
              </div>

              <div class="form-group" *ngIf="validationForm.get('statut')?.value === 'REJETEE'">
                <label for="commentaire_admin">Motif du rejet</label>
                <textarea id="commentaire_admin" formControlName="commentaire_admin" class="form-control" rows="3"
                         placeholder="Veuillez expliquer la raison du rejet..."></textarea>
                <div class="invalid-feedback" *ngIf="validationForm.get('commentaire_admin')?.errors?.['required'] && validationForm.get('commentaire_admin')?.touched">
                  Le motif du rejet est requis.
                </div>
                <div class="invalid-feedback" *ngIf="validationForm.get('commentaire_admin')?.errors?.['minlength'] && validationForm.get('commentaire_admin')?.touched">
                  Le motif doit contenir au moins 10 caractères.
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="cancelValidation()">
                  Annuler
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!validationForm.valid || isSubmitting">
                  {{ isSubmitting ? 'Validation en cours...' : 'Confirmer' }}
                </button>
              </div>
            </form>
          </div>

          <div class="card-actions" *ngIf="!selectedCandidature && candidature.statut === 'EN_ATTENTE'">
            <button class="btn btn-primary" (click)="startValidation(candidature)">
              Valider la candidature
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .validation-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h2 {
      margin: 0;
      font-size: 1.8rem;
      color: var(--primary);
    }

    .page-header p {
      margin: 8px 0 0;
      color: var(--gray-500);
    }

    .loading-state,
    .empty-state {
      text-align: center;
      padding: 48px;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid var(--gray-200);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert {
      padding: 16px;
      border-radius: var(--border-radius);
      margin-bottom: 24px;
    }

    .alert-danger {
      background: #FEE2E2;
      color: #991B1B;
      border: 1px solid #FCA5A5;
    }

    .candidatures-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .candidature-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
    }

    .candidature-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .status-badge.en_attente {
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
    }

    .status-badge.validee {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .status-badge.rejetee {
      background: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }

    .submission-date {
      font-size: 0.9rem;
      color: var(--gray-500);
    }

    .candidate-info {
      margin-bottom: 20px;
    }

    .candidate-info h3 {
      margin: 0 0 8px;
      font-size: 1.25rem;
      color: var(--primary);
    }

    .candidate-info p {
      margin: 0;
      color: var(--gray-500);
    }

    .election-title {
      margin-top: 8px;
      font-weight: 500;
      color: var(--secondary);
    }

    .program-section {
      margin-bottom: 20px;
    }

    .program-section h4 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: var(--primary);
    }

    .program-section p {
      color: var(--gray-500);
      line-height: 1.6;
    }

    .validation-form {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--gray-200);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--primary);
    }

    .radio-group {
      display: flex;
      gap: 24px;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
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

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }

    .card-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .candidatures-grid {
        grid-template-columns: 1fr;
      }

      .card-actions,
      .form-actions {
        flex-direction: column;
      }

      .card-actions button,
      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class ValidationCandidaturesComponent implements OnInit {
  pendingCandidatures: Candidature[] = [];
  selectedCandidature: Candidature | null = null;
  validationForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService,
    private route: ActivatedRoute
  ) {
    this.validationForm = this.fb.group({
      statut: ['', Validators.required],
      commentaire_admin: ['']
    });

    // Add conditional validation for rejection reason
    this.validationForm.get('statut')?.valueChanges.subscribe(value => {
      const commentaireControl = this.validationForm.get('commentaire_admin');
      if (value === 'REJETEE') {
        commentaireControl?.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        commentaireControl?.clearValidators();
      }
      commentaireControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.loadPendingCandidatures();
  }

  loadPendingCandidatures() {
    this.isLoading = true;
    this.error = null;
    
    this.candidatureService.getPendingCandidatures().subscribe({
      next: (candidatures) => {
        this.pendingCandidatures = candidatures;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending candidatures:', err);
        this.error = 'Une erreur est survenue lors du chargement des candidatures.';
        this.isLoading = false;
      }
    });
  }

  startValidation(candidature: Candidature) {
    this.selectedCandidature = candidature;
    this.validationForm.reset();
  }

  cancelValidation() {
    this.selectedCandidature = null;
    this.validationForm.reset();
  }

  submitValidation(candidature: Candidature) {
    if (this.validationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { statut, commentaire_admin } = this.validationForm.value;

      this.candidatureService.validateCandidature(
        candidature.id,
        statut,
        commentaire_admin
      ).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.cancelValidation();
          // Show success message
          this.error = null;
          // Update the candidature in the list with the new data
          const index = this.pendingCandidatures.findIndex(c => c.id === candidature.id);
          if (index !== -1) {
            this.pendingCandidatures[index] = response.candidature;
          }
          // Remove from list if it's no longer pending
          this.pendingCandidatures = this.pendingCandidatures.filter(c => c.statut === 'EN_ATTENTE');
        },
        error: (err) => {
          console.error('Error validating candidature:', err);
          this.error = err.error?.message || 'Une erreur est survenue lors de la validation de la candidature.';
          this.isSubmitting = false;
        }
      });
    }
  }

  mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'SOUMISE': 'Soumise',
      'EN_ATTENTE': 'En attente',
      'VALIDEE': 'Validée',
      'REJETEE': 'Rejetée',
      'RETIREE': 'Retirée'
    };
    return statusMap[status] || status;
  }
}