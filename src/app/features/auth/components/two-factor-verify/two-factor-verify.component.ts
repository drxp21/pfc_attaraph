import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TwoFactorService } from '../../../../core/services/two-factor.service';

@Component({
  selector: 'app-two-factor-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="verify-2fa-container">
      <div class="verify-card">
        <h2>Vérification en deux étapes</h2>
        <p class="verify-description">
          Veuillez entrer le code à 6 chiffres généré par votre application d'authentification.
        </p>

        <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()" class="verify-form">
          <div class="form-group">
            <input 
              type="text" 
              formControlName="token"
              class="verification-input"
              placeholder="000000"
              maxlength="6"
              pattern="[0-9]*"
              autocomplete="off">
            <div *ngIf="verifyError" class="error-message">
              {{ verifyError }}
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="!verifyForm.valid || isVerifying">
            <span *ngIf="!isVerifying">Vérifier</span>
            <span *ngIf="isVerifying">Vérification en cours...</span>
          </button>
        </form>

        <div class="help-text">
          <p>Vous n'avez pas accès à votre application d'authentification ?</p>
          <button class="btn btn-text" (click)="onNeedHelp()">Contacter le support</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-2fa-container {
      padding: 32px;
      max-width: 400px;
      margin: 0 auto;
    }

    .verify-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 32px;
      box-shadow: var(--shadow-md);
      text-align: center;
    }

    .verify-description {
      color: var(--gray-500);
      margin-bottom: 32px;
    }

    .verify-form {
      margin-bottom: 24px;
    }

    .verification-input {
      width: 200px;
      padding: 12px;
      font-size: 1.5rem;
      letter-spacing: 8px;
      text-align: center;
      border: 2px solid var(--gray-300);
      border-radius: var(--border-radius);
      transition: var(--transition);
      margin: 0 auto;
      display: block;

      &:focus {
        border-color: var(--secondary);
        outline: none;
        box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
      }
    }

    .error-message {
      color: var(--error);
      font-size: 0.9rem;
      margin-top: 8px;
    }

    .btn-block {
      width: 100%;
      margin-top: 24px;
    }

    .help-text {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid var(--gray-200);
      
      p {
        color: var(--gray-500);
        margin-bottom: 8px;
      }
    }

    .btn-text {
      background: none;
      border: none;
      color: var(--secondary);
      padding: 0;
      font-size: inherit;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: var(--primary);
      }
    }
  `]
})
export class TwoFactorVerifyComponent {
  @Output() verified = new EventEmitter<boolean>();
  
  verifyForm: FormGroup;
  isVerifying = false;
  verifyError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private twoFactorService: TwoFactorService
  ) {
    this.verifyForm = this.fb.group({
      token: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  async onSubmit() {
    if (!this.verifyForm.valid) return;

    this.isVerifying = true;
    this.verifyError = null;

    try {
      const token = this.verifyForm.get('token')?.value;
      const isValid = await this.twoFactorService.verifyToken(token);
      
      if (isValid) {
        this.verified.emit(true);
      } else {
        this.verifyError = 'Code invalide. Veuillez réessayer.';
      }
    } catch (error) {
      this.verifyError = 'Une erreur est survenue. Veuillez réessayer.';
      console.error('Erreur lors de la vérification du code:', error);
    } finally {
      this.isVerifying = false;
    }
  }

  onNeedHelp() {
    // Implémenter la logique pour contacter le support
    console.log('Contacter le support');
  }
}