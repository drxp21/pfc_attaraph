import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElectionService } from '../../../../core/services/election.service';

@Component({
  selector: 'app-candidature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="candidature-container">
      <div class="page-header">
        <h2>Ma Candidature</h2>
        <p>Gérez vos candidatures aux élections universitaires</p>
      </div>

      <!-- Formulaire de candidature -->
      <div class="candidature-form-container" *ngIf="showForm">
        <form [formGroup]="candidatureForm" (ngSubmit)="onSubmit()" class="candidature-form">
          <div class="form-section">
            <h3>Informations de candidature</h3>
            
            <div class="form-group">
              <label for="election">Élection</label>
              <select id="election" formControlName="electionId" class="form-control">
                <option value="">Sélectionnez une élection</option>
                <option *ngFor="let election of availableElections" [value]="election.id">
                  {{ election.title }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="position">Poste visé</label>
              <input type="text" id="position" formControlName="position" class="form-control">
            </div>

            <div class="form-group">
              <label for="program">Programme électoral</label>
              <textarea id="program" formControlName="program" class="form-control" rows="6"
                        placeholder="Décrivez votre programme et vos objectifs..."></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3>Documents requis</h3>
            
            <div class="document-upload">
              <label class="upload-label">
                <input type="file" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)">
                <span class="upload-text">CV académique (PDF, DOC)</span>
              </label>
            </div>

            <div class="document-upload">
              <label class="upload-label">
                <input type="file" accept=".pdf" (change)="onFileSelected($event)">
                <span class="upload-text">Lettre de motivation (PDF)</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="cancelForm()">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!candidatureForm.valid">
              Soumettre ma candidature
            </button>
          </div>
        </form>
      </div>

      <!-- Liste des candidatures -->
      <div class="candidatures-list">
        <div class="list-header">
          <h3>Mes candidatures</h3>
          <button class="btn btn-primary" (click)="showForm = true" *ngIf="!showForm">
            Nouvelle candidature
          </button>
        </div>

        <div class="candidature-cards">
          <div *ngFor="let candidature of candidatures" class="candidature-card">
            <div class="candidature-header">
              <h4>{{ candidature.election }}</h4>
              <span class="status-badge" [class]="candidature.status">
                {{ candidature.status }}
              </span>
            </div>

            <div class="candidature-details">
              <div class="detail-item">
                <span class="detail-label">Poste</span>
                <span class="detail-value">{{ candidature.position }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date de soumission</span>
                <span class="detail-value">{{ candidature.submissionDate | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>

            <div class="candidature-actions">
              <button class="btn btn-outline btn-sm" (click)="viewCandidature(candidature)">
                Voir les détails
              </button>
              <button class="btn btn-outline btn-sm" *ngIf="candidature.status === 'draft'"
                      (click)="editCandidature(candidature)">
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .candidature-container {
      max-width: 1200px;
      margin: 0 auto;
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

    .candidature-form-container {
      background: white;
      border-radius: var(--border-radius);
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: var(--shadow-sm);
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      font-size: 1.25rem;
      margin-bottom: 20px;
      color: var(--primary);
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

    .document-upload {
      margin-bottom: 16px;
    }

    .upload-label {
      display: block;
      padding: 16px;
      border: 2px dashed var(--gray-300);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
    }

    .upload-label:hover {
      border-color: var(--secondary);
      background: rgba(63, 81, 181, 0.05);
    }

    .upload-label input {
      display: none;
    }

    .upload-text {
      display: block;
      text-align: center;
      color: var(--gray-500);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .list-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--primary);
    }

    .candidature-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .candidature-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }

    .candidature-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .candidature-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .candidature-header h4 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--primary);
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

    .status-badge.approved {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    .status-badge.rejected {
      background: rgba(244, 67, 54, 0.1);
      color: #F44336;
    }

    .status-badge.draft {
      background: rgba(158, 158, 158, 0.1);
      color: #9E9E9E;
    }

    .candidature-details {
      margin-bottom: 20px;
    }

    .detail-item {
      margin-bottom: 8px;
    }

    .detail-label {
      font-size: 0.9rem;
      color: var(--gray-500);
      display: block;
      margin-bottom: 4px;
    }

    .detail-value {
      font-weight: 500;
      color: var(--primary);
    }

    .candidature-actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      padding: 8px 12px;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .candidature-form-container {
        padding: 20px;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class CandidatureComponent {
  showForm = false;
  candidatureForm: FormGroup;
  availableElections: any[] = [];
  candidatures: any[] = [];

  constructor(
    private fb: FormBuilder,
    private electionService: ElectionService
  ) {
    this.candidatureForm = this.fb.group({
      electionId: ['', Validators.required],
      position: ['', Validators.required],
      program: ['', [Validators.required, Validators.minLength(100)]]
    });

    // Données de démonstration
    this.candidatures = [
      {
        id: 1,
        election: 'Chef de Département Informatique',
        position: 'Chef de département',
        status: 'pending',
        submissionDate: new Date()
      },
      {
        id: 2,
        election: 'Directeur UFR Sciences',
        position: 'Directeur',
        status: 'draft',
        submissionDate: new Date()
      }
    ];
  }

  async onSubmit() {
    if (this.candidatureForm.valid) {
      try {
        const candidatureData = this.candidatureForm.value;
        await this.electionService.submitCandidacy(
          candidatureData.electionId,
          candidatureData
        );
        this.showForm = false;
        this.candidatureForm.reset();
      } catch (error) {
        console.error('Erreur lors de la soumission de la candidature:', error);
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Implémenter la logique de téléchargement de fichier
  }

  cancelForm() {
    this.showForm = false;
    this.candidatureForm.reset();
  }

  viewCandidature(candidature: any) {
    // Implémenter la logique d'affichage des détails
  }

  editCandidature(candidature: any) {
    // Implémenter la logique de modification
  }
}