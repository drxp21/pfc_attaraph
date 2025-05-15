import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- En-tête de la section -->
    <div class="section-header">
      <div class="header-content">
        <h2>Sécurité et Accès</h2>
        <p>Gérez les paramètres de sécurité et les autorisations d'accès au système</p>
      </div>
    </div>

    <!-- Paramètres de sécurité généraux -->
    <div class="card">
      <h3>Paramètres de Sécurité Généraux</h3>
      <form [formGroup]="securityForm" (ngSubmit)="onSubmit()" class="security-form">
        <div class="form-section">
          <h4>Authentification</h4>
          
          <div class="form-group">
            <label class="switch-label">
              <span>Double authentification (2FA)</span>
              <div class="switch">
                <input type="checkbox" formControlName="twoFactorAuth">
                <span class="slider"></span>
              </div>
            </label>
            <p class="help-text">Exiger une vérification en deux étapes pour les connexions</p>
          </div>

          <div class="form-group">
            <label for="sessionTimeout">Durée de session (minutes)</label>
            <input type="number" id="sessionTimeout" formControlName="sessionTimeout" 
                   class="form-control" min="5" max="120">
            <p class="help-text">Délai avant la déconnexion automatique des utilisateurs inactifs</p>
          </div>

          <div class="form-group">
            <label for="maxLoginAttempts">Tentatives de connexion maximales</label>
            <input type="number" id="maxLoginAttempts" formControlName="maxLoginAttempts" 
                   class="form-control" min="3" max="10">
            <p class="help-text">Nombre d'essais avant le verrouillage temporaire du compte</p>
          </div>
        </div>

        <div class="form-section">
          <h4>Politique des Mots de Passe</h4>
          
          <div class="form-group">
            <label for="passwordMinLength">Longueur minimale</label>
            <input type="number" id="passwordMinLength" formControlName="passwordMinLength" 
                   class="form-control" min="8" max="32">
          </div>

          <div class="password-requirements">
            <label class="checkbox-container">
              <input type="checkbox" formControlName="requireUppercase">
              <span class="checkmark"></span>
              Exiger une majuscule
            </label>

            <label class="checkbox-container">
              <input type="checkbox" formControlName="requireNumbers">
              <span class="checkmark"></span>
              Exiger un chiffre
            </label>

            <label class="checkbox-container">
              <input type="checkbox" formControlName="requireSpecialChars">
              <span class="checkmark"></span>
              Exiger un caractère spécial
            </label>
          </div>

          <div class="form-group">
            <label for="passwordExpiration">Expiration du mot de passe (jours)</label>
            <input type="number" id="passwordExpiration" formControlName="passwordExpiration" 
                   class="form-control" min="30" max="365">
            <p class="help-text">0 = pas d'expiration</p>
          </div>
        </div>

        <div class="form-section">
          <h4>Journalisation</h4>
          
          <div class="form-group">
            <label class="switch-label">
              <span>Journalisation des connexions</span>
              <div class="switch">
                <input type="checkbox" formControlName="logLogins">
                <span class="slider"></span>
              </div>
            </label>
          </div>

          <div class="form-group">
            <label class="switch-label">
              <span>Journalisation des actions administratives</span>
              <div class="switch">
                <input type="checkbox" formControlName="logAdminActions">
                <span class="slider"></span>
              </div>
            </label>
          </div>

          <div class="form-group">
            <label class="switch-label">
              <span>Journalisation des votes</span>
              <div class="switch">
                <input type="checkbox" formControlName="logVotes">
                <span class="slider"></span>
              </div>
            </label>
            <p class="help-text">Enregistre uniquement l'horodatage, préserve l'anonymat</p>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-outline" (click)="resetForm()">
            Réinitialiser
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="!securityForm.valid">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>

    <!-- Journal d'activité -->
    <div class="card mt-4">
      <div class="card-header">
        <h3>Journal d'Activité</h3>
        <div class="header-actions">
          <button class="btn btn-outline btn-sm">
            Exporter
          </button>
          <button class="btn btn-outline btn-sm">
            Filtrer
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Détails</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of activityLogs">
              <td>{{ log.date | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ log.user }}</td>
              <td>
                <span class="action-badge" [class]="log.actionType">
                  {{ log.action }}
                </span>
              </td>
              <td>{{ log.details }}</td>
              <td>{{ log.ip }}</td>
            </tr>
          </tbody>
        </table>
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

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    /* Styles du formulaire */
    .security-form {
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

    /* Styles des checkboxes */
    .password-requirements {
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

    /* Styles de la table d'activité */
    .table-responsive {
      overflow-x: auto;
    }

    .activity-table {
      width: 100%;
      border-collapse: collapse;
    }

    .activity-table th,
    .activity-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--gray-200);
    }

    .activity-table th {
      font-weight: 600;
      color: var(--primary);
      background: var(--gray-100);
    }

    .action-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .action-badge.auth {
      background: rgba(63, 81, 181, 0.1);
      color: var(--secondary);
    }

    .action-badge.admin {
      background: rgba(255, 152, 0, 0.1);
      color: #FF9800;
    }

    .action-badge.vote {
      background: rgba(76, 175, 80, 0.1);
      color: #4CAF50;
    }

    /* Utilitaires */
    .mt-4 {
      margin-top: 24px;
    }

    .btn-sm {
      padding: 8px 12px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }
  `]
})
export class SecurityComponent {
  securityForm: FormGroup;

  // Données de démonstration pour le journal d'activité
  activityLogs = [
    {
      date: new Date(),
      user: 'admin@univ.edu',
      action: 'Connexion',
      actionType: 'auth',
      details: 'Connexion réussie',
      ip: '192.168.1.100'
    },
    {
      date: new Date(Date.now() - 3600000),
      user: 'admin@univ.edu',
      action: 'Configuration',
      actionType: 'admin',
      details: 'Modification des paramètres de sécurité',
      ip: '192.168.1.100'
    },
    {
      date: new Date(Date.now() - 7200000),
      user: 'prof.dupont@univ.edu',
      action: 'Vote',
      actionType: 'vote',
      details: 'Vote enregistré - Élection Chef Département',
      ip: '192.168.1.105'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.securityForm = this.fb.group({
      // Authentification
      twoFactorAuth: [true],
      sessionTimeout: [30, [Validators.required, Validators.min(5), Validators.max(120)]],
      maxLoginAttempts: [5, [Validators.required, Validators.min(3), Validators.max(10)]],
      
      // Politique des mots de passe
      passwordMinLength: [12, [Validators.required, Validators.min(8), Validators.max(32)]],
      requireUppercase: [true],
      requireNumbers: [true],
      requireSpecialChars: [true],
      passwordExpiration: [90, [Validators.required, Validators.min(0), Validators.max(365)]],
      
      // Journalisation
      logLogins: [true],
      logAdminActions: [true],
      logVotes: [true]
    });
  }

  resetForm() {
    this.securityForm.reset({
      twoFactorAuth: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 12,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      passwordExpiration: 90,
      logLogins: true,
      logAdminActions: true,
      logVotes: true
    });
  }

  onSubmit() {
    if (this.securityForm.valid) {
      console.log('Paramètres de sécurité:', this.securityForm.value);
      // Logique pour sauvegarder les paramètres
    }
  }
}