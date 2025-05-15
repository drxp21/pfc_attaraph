import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationService } from '../../../../../core/services/validation.service';

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

      <!-- Liste des candidatures en attente -->
      <div class="candidatures-grid">
        <div *ngFor="let candidature of pendingCandidatures" class="candidature-card">
          <div class="candidature-header">
            <span class="status-badge pending">En attente</span>
            <span class="submission-date">{{ candidature.submissionDate | date:'dd/MM/yyyy' }}</span>
          </div>

          <div class="candidate-info">
            <h3>{{ candidature.candidateName }}</h3>
            <p>{{ candidature.position }}</p>
            <p class="election-title">{{ candidature.electionTitle }}</p>
          </div>

          <div class="documents-section">
            <h4>Documents soumis</h4>
            <div class="document-list">
              <a href="#" class="document-link" *ngFor="let doc of candidature.documents">
                <span class="doc-icon">📄</span>
                {{ doc.name }}
              </a>
            </div>
          </div>

          <div class="program-section">
            <h4>Programme électoral</h4>
            <p>{{ candidature.program }}</p>
          </div>

          <div class="validation-form" *ngIf="selectedCandidature?.id === candidature.id">
            <form [formGroup]="validationForm" (ngSubmit)="submitValidation(candidature)">
              <div class="form-group">
                <label>Décision</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" formControlName="decision" value="approve">
                    Approuver
                  </label>
                  <label class="radio-label">
                    <input type="radio" formControlName="decision" value="reject">
                    Rejeter
                  </label>
                </div>
              </div>

              <div class="form-group" *ngIf="validationForm.get('decision')?.value === 'reject'">
                <label for="reason">Motif du rejet</label>
                <textarea id="reason" formControlName="reason" class="form-control" rows="3"></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="cancelValidation()">
                  Annuler
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!validationForm.valid">
                  Confirmer
                </button>
              </div>
            </form>
          </div>

          <div class="card-actions" *ngIf="!selectedCandidature">
            <button class="btn btn-outline" (click)="viewDocuments(candidature)">
              Voir les documents
            </button>
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

    .status-badge.pending {
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
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

    .documents-section,
    .program-section {
      margin-bottom: 20px;
    }

    .documents-section h4,
    .program-section h4 {
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: var(--primary);
    }

    .document-list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .document-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
      color: var(--primary);
      text-decoration: none;
      transition: var(--transition);
    }

    .document-link:hover {
      background: var(--gray-200);
    }

    .doc-icon {
      font-size: 1.2rem;
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
  pendingCandidatures: any[] = [];
  selectedCandidature: any = null;
  validationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private validationService: ValidationService
  ) {
    this.validationForm = this.fb.group({
      decision: ['', Validators.required],
      reason: ['']
    });

    // Ajouter la validation conditionnelle pour le motif
    this.validationForm.get('decision')?.valueChanges.subscribe(value => {
      const reasonControl = this.validationForm.get('reason');
      if (value === 'reject') {
        reasonControl?.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        reasonControl?.clearValidators();
      }
      reasonControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.loadPendingCandidatures();
  }

  async loadPendingCandidatures() {
    try {
      // Données de démonstration
      this.pendingCandidatures = [
        {
          id: 1,
          candidateName: 'Dr. Martin Dupont',
          position: 'Maître de conférences',
          electionTitle: 'Chef du Département Informatique',
          submissionDate: new Date(),
          program: 'Programme axé sur la modernisation des enseignements...',
          documents: [
            { name: 'CV.pdf' },
            { name: 'Lettre de motivation.pdf' },
            { name: 'Programme détaillé.pdf' }
          ]
        },
        {
          id: 2,
          candidateName: 'Pr. Sophie Laurent',
          position: 'Professeure des universités',
          electionTitle: 'Directeur UFR Sciences',
          submissionDate: new Date(),
          program: 'Programme centré sur l\'innovation pédagogique...',
          documents: [
            { name: 'CV.pdf' },
            { name: 'Lettre de motivation.pdf' },
            { name: 'Programme détaillé.pdf' }
          ]
        }
      ];
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
    }
  }

  startValidation(candidature: any) {
    this.selectedCandidature = candidature;
    this.validationForm.reset();
  }

  cancelValidation() {
    this.selectedCandidature = null;
    this.validationForm.reset();
  }

  async submitValidation(candidature: any) {
    if (this.validationForm.valid) {
      try {
        const { decision, reason } = this.validationForm.value;
        await this.validationService.validateCandidacy(
          candidature.id,
          decision,
          reason
        );
        
        // Recharger les candidatures
        await this.loadPendingCandidatures();
        this.cancelValidation();
      } catch (error) {
        console.error('Erreur lors de la validation:', error);
      }
    }
  }

  viewDocuments(candidature: any) {
    // Implémenter la visualisation des documents
  }
}