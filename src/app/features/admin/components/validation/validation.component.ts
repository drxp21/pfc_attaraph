import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- En-tête de la section -->
    <div class="section-header">
      <div class="header-content">
        <h2>Critères de Validité</h2>
        <p>Définissez les critères de validité pour les élections universitaires</p>
      </div>
    </div>

    <!-- Configuration des critères -->
    <div class="card">
      <h3>Configuration des Critères de Validité</h3>
      <form [formGroup]="validationForm" (ngSubmit)="onSubmit()" class="validation-form">
        <div class="form-section">
          <h4>Critères Généraux</h4>
          
          <div class="form-group">
            <label for="quorumPercentage">Quorum requis (%)</label>
            <input 
              type="number" 
              id="quorumPercentage" 
              formControlName="quorumPercentage" 
              class="form-control" 
              min="0" 
              max="100">
            <p class="help-text">Pourcentage minimum de participation requis pour valider une élection</p>
          </div>

          <div class="form-group">
            <label for="majorityType">Type de majorité requise</label>
            <select id="majorityType" formControlName="majorityType" class="form-control">
              <option value="simple">Majorité simple</option>
              <option value="absolute">Majorité absolue</option>
              <option value="qualified">Majorité qualifiée (2/3)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="switch-label">
              <span>Second tour automatique si quorum non atteint</span>
              <div class="switch">
                <input type="checkbox" formControlName="automaticSecondRound">
                <span class="slider"></span>
              </div>
            </label>
          </div>
        </div>

        <div class="form-section">
          <h4>Validation des Candidatures</h4>
          
          <div class="form-group">
            <label for="minExperience">Expérience minimale requise (années)</label>
            <input 
              type="number" 
              id="minExperience" 
              formControlName="minExperience" 
              class="form-control" 
              min="0" 
              max="20">
          </div>

          <div class="requirements-list">
            <div class="requirement-item" *ngFor="let requirement of candidateRequirements; let i = index">
              <input 
                type="text" 
                [value]="requirement" 
                class="form-control" 
                (input)="updateRequirement(i, $event)"
                placeholder="Ajouter un critère">
              <button type="button" class="btn-icon" (click)="removeRequirement(i)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <button type="button" class="btn btn-outline btn-sm" (click)="addRequirement()">
              Ajouter un critère
            </button>
          </div>
        </div>

        <div class="form-section">
          <h4>Délais et Périodes</h4>
          
          <div class="form-group">
            <label for="candidacyPeriod">Période de candidature (jours)</label>
            <input 
              type="number" 
              id="candidacyPeriod" 
              formControlName="candidacyPeriod" 
              class="form-control" 
              min="1" 
              max="30">
          </div>

          <div class="form-group">
            <label for="campaignPeriod">Période de campagne (jours)</label>
            <input 
              type="number" 
              id="campaignPeriod" 
              formControlName="campaignPeriod" 
              class="form-control" 
              min="1" 
              max="30">
          </div>

          <div class="form-group">
            <label for="votingPeriod">Période de vote (jours)</label>
            <input 
              type="number" 
              id="votingPeriod" 
              formControlName="votingPeriod" 
              class="form-control" 
              min="1" 
              max="7">
          </div>

          <div class="form-group">
            <label class="switch-label">
              <span>Autoriser le vote anticipé</span>
              <div class="switch">
                <input type="checkbox" formControlName="allowEarlyVoting">
                <span class="slider"></span>
              </div>
            </label>
            <p class="help-text">Permet aux électeurs de voter avant la période officielle</p>
          </div>
        </div>

        <div class="form-section">
          <h4>Notifications et Rappels</h4>
          
          <div class="notification-settings">
            <label class="checkbox-container">
              <input type="checkbox" formControlName="notifyStartCandidacy">
              <span class="checkmark"></span>
              Notification de début de période de candidature
            </label>

            <label class="checkbox-container">
              <input type="checkbox" formControlName="notifyStartCampaign">
              <span class="checkmark"></span>
              Notification de début de campagne
            </label>

            <label class="checkbox-container">
              <input type="checkbox" formControlName="notifyStartVoting">
              <span class="checkmark"></span>
              Notification de début de vote
            </label>

            <label class="checkbox-container">
              <input type="checkbox" formControlName="sendReminders">
              <span class="checkmark"></span>
              Envoi de rappels aux électeurs
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="resetForm()">
            Réinitialiser
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="!validationForm.valid">
            Enregistrer les critères
          </button>
        </div>
      </form>
    </div>

    <!-- Aperçu des critères actuels -->
    <div class="card mt-4">
      <h3>Aperçu des Critères Actuels</h3>
      
      <div class="criteria-summary">
        <div class="summary-section">
          <h4>Participation</h4>
          <ul class="summary-list">
            <li>
              <span class="summary-label">Quorum requis:</span>
              <span class="summary-value">50%</span>
            </li>
            <li>
              <span class="summary-label">Type de majorité:</span>
              <span class="summary-value">Absolue</span>
            </li>
            <li>
              <span class="summary-label">Second tour:</span>
              <span class="summary-value">Automatique si quorum non atteint</span>
            </li>
          </ul>
        </div>

        <div class="summary-section">
          <h4>Candidature</h4>
          <ul class="summary-list">
            <li>
              <span class="summary-label">Expérience minimale:</span>
              <span class="summary-value">2 ans</span>
            </li>
            <li>
              <span class="summary-label">Critères supplémentaires:</span>
              <ul class="nested-list">
                <li>Être titulaire</li>
                <li>Avoir un projet d'établissement</li>
                <li>Pas de sanction disciplinaire</li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="summary-section">
          <h4>Périodes</h4>
          <ul class="summary-list">
            <li>
              <span class="summary-label">Candidature:</span>
              <span class="summary-value">15 jours</span>
            </li>
            <li>
              <span class="summary-label">Campagne:</span>
              <span class="summary-value">21 jours</span>
            </li>
            <li>
              <span class="summary-label">Vote:</span>
              <span class="summary-value">3 jours</span>
            </li>
          </ul>
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
    .validation-form {
      display: grid;
      gap: 32px;
    }

    .form-section {
      display: grid;
      gap: 20px;
    }

    .form-section h4 {
      color: var(--primary);
      font-size: 1.1rem;
      margin: 0 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--gray-200);
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

    .help-text {
      font-size: 0.9rem;
      color: var(--gray-500);
      margin: 0;
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

    /* Styles des switches */
    .switch-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--gray-300);
      transition: .4s;
      border-radius: 34px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--secondary);
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    /* Styles des critères de candidature */
    .requirements-list {
      display: grid;
      gap: 12px;
    }

    .requirement-item {
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

    /* Styles des notifications */
    .notification-settings {
      display: grid;
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

    /* Styles de l'aperçu des critères */
    .criteria-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .summary-section {
      padding: 16px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
    }

    .summary-section h4 {
      color: var(--primary);
      margin: 0 0 16px;
      font-size: 1rem;
    }

    .summary-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .summary-list li {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .summary-label {
      color: var(--gray-500);
      font-size: 0.9rem;
    }

    .summary-value {
      font-weight: 500;
      color: var(--primary);
    }

    .nested-list {
      list-style: none;
      padding-left: 16px;
      margin: 8px 0 0;
    }

    .nested-list li {
      color: var(--gray-700);
      font-size: 0.9rem;
      margin-bottom: 4px;
      position: relative;
    }

    .nested-list li::before {
      content: "•";
      position: absolute;
      left: -12px;
      color: var(--secondary);
    }

    /* Utilitaires */
    .mt-4 {
      margin-top: 24px;
    }

    .btn-sm {
      padding: 8px 12px;
      font-size: 0.9rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }
  `]
})
export class ValidationComponent {
  validationForm: FormGroup;
  candidateRequirements: string[] = [
    'Être titulaire',
    'Avoir un projet d\'établissement',
    'Pas de sanction disciplinaire'
  ];

  constructor(private fb: FormBuilder) {
    this.validationForm = this.fb.group({
      // Critères généraux
      quorumPercentage: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
      majorityType: ['absolute', Validators.required],
      automaticSecondRound: [true],

      // Validation des candidatures
      minExperience: [2, [Validators.required, Validators.min(0), Validators.max(20)]],

      // Délais et périodes
      candidacyPeriod: [15, [Validators.required, Validators.min(1), Validators.max(30)]],
      campaignPeriod: [21, [Validators.required, Validators.min(1), Validators.max(30)]],
      votingPeriod: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      allowEarlyVoting: [false],

      // Notifications
      notifyStartCandidacy: [true],
      notifyStartCampaign: [true],
      notifyStartVoting: [true],
      sendReminders: [true]
    });
  }

  addRequirement() {
    this.candidateRequirements.push('');
  }

  removeRequirement(index: number) {
    this.candidateRequirements.splice(index, 1);
  }

  updateRequirement(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.candidateRequirements[index] = input.value;
  }

  resetForm() {
    this.validationForm.reset({
      quorumPercentage: 50,
      majorityType: 'absolute',
      automaticSecondRound: true,
      minExperience: 2,
      candidacyPeriod: 15,
      campaignPeriod: 21,
      votingPeriod: 3,
      allowEarlyVoting: false,
      notifyStartCandidacy: true,
      notifyStartCampaign: true,
      notifyStartVoting: true,
      sendReminders: true
    });
    this.candidateRequirements = [
      'Être titulaire',
      'Avoir un projet d\'établissement',
      'Pas de sanction disciplinaire'
    ];
  }

  onSubmit() {
    if (this.validationForm.valid) {
      console.log('Critères de validité:', {
        ...this.validationForm.value,
        candidateRequirements: this.candidateRequirements
      });
      // Logique pour sauvegarder les critères
    }
  }
}
