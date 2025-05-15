import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwoFactorService } from '../../../../core/services/two-factor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-two-factor-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="setup-2fa-container">
      <div class="setup-card">
        <h2>Configuration de l'authentification à deux facteurs</h2>
        <p class="setup-description">
          L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte en exigeant 
          un code temporaire en plus de votre mot de passe.
        </p>

        <div *ngIf="!is2FAEnabled" class="setup-steps">
          <div class="step">
            <h3>1. Scannez le QR code</h3>
            <p>Utilisez une application d'authentification comme Google Authenticator ou Authy pour scanner ce QR code :</p>
            <div class="qr-container" *ngIf="qrCodeUrl">
              <img [src]="qrCodeUrl" alt="QR Code pour 2FA">
            </div>
          </div>

          <div class="step">
            <h3>2. Entrez le code de vérification</h3>
            <p>Entrez le code à 6 chiffres généré par votre application :</p>
            <form [formGroup]="verificationForm" (ngSubmit)="verifyAndEnable()" class="verification-form">
              <div class="form-group">
                <input 
                  type="text" 
                  formControlName="token"
                  class="verification-input"
                  placeholder="000000"
                  maxlength="6"
                  pattern="[0-9]*">
                <div *ngIf="verificationError" class="error-message">
                  {{ verificationError }}
                </div>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="!verificationForm.valid || isVerifying">
                <span *ngIf="!isVerifying">Activer l'authentification à deux facteurs</span>
                <span *ngIf="isVerifying">Vérification en cours...</span>
              </button>
            </form>
          </div>
        </div>

        <div *ngIf="is2FAEnabled" class="enabled-state">
          <div class="success-message">
            <div class="check-icon">✓</div>
            <h3>L'authentification à deux facteurs est activée</h3>
            <p>Votre compte est maintenant mieux protégé.</p>
          </div>
          
          <button (click)="disable2FA()" class="btn btn-outline">
            Désactiver l'authentification à deux facteurs
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .setup-2fa-container {
      padding: 32px;
      max-width: 600px;
      margin: 0 auto;
    }

    .setup-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 32px;
      box-shadow: var(--shadow-md);
    }

    .setup-description {
      color: var(--gray-500);
      margin-bottom: 32px;
    }

    .setup-steps {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .step {
      h3 {
        color: var(--primary);
        margin-bottom: 16px;
      }

      p {
        color: var(--gray-500);
        margin-bottom: 16px;
      }
    }

    .qr-container {
      background: white;
      padding: 16px;
      border-radius: var(--border-radius);
      display: inline-block;
      box-shadow: var(--shadow-sm);
      margin: 16px 0;

      img {
        display: block;
        max-width: 200px;
        height: auto;
      }
    }

    .verification-form {
      .form-group {
        margin-bottom: 16px;
      }
    }

    .verification-input {
      width: 200px;
      padding: 12px;
      font-size: 1.2rem;
      letter-spacing: 4px;
      text-align: center;
      border: 2px solid var(--gray-300);
      border-radius: var(--border-radius);
      transition: var(--transition);

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

    .enabled-state {
      text-align: center;
    }

    .success-message {
      margin-bottom: 24px;
    }

    .check-icon {
      width: 48px;
      height: 48px;
      background: var(--success);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin: 0 auto 16px;
    }
  `]
})
export class TwoFactorSetupComponent implements OnInit {
  verificationForm: FormGroup;
  qrCodeUrl: string | null = null;
  is2FAEnabled = false;
  isVerifying = false;
  verificationError: string | null = null;

  constructor(
    private twoFactorService: TwoFactorService,
    private fb: FormBuilder
  ) {
    this.verificationForm = this.fb.group({
      token: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  async ngOnInit() {
    this.is2FAEnabled = await this.twoFactorService.is2FAEnabled();

    if (!this.is2FAEnabled) {
      await this.initializeSetup();
    }
  }

  private async initializeSetup() {
    try {
      const userEmail = 'user@example.com'; // À remplacer par l'email de l'utilisateur actuel
      this.qrCodeUrl = await this.twoFactorService.generateQRCode(userEmail);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du 2FA:', error);
    }
  }

  async verifyAndEnable() {
    if (!this.verificationForm.valid) return;

    this.isVerifying = true;
    this.verificationError = null;

    try {
      const token = this.verificationForm.get('token')?.value;
      const isValid = await this.twoFactorService.verifyToken(token);
      
      if (isValid) {
        await this.twoFactorService.enable2FA();
        this.is2FAEnabled = true;
      } else {
        this.verificationError = 'Code invalide. Veuillez réessayer.';
      }
    } catch (error) {
      this.verificationError = 'Une erreur est survenue. Veuillez réessayer.';
      console.error('Erreur lors de la vérification du code:', error);
    } finally {
      this.isVerifying = false;
    }
  }

  async disable2FA() {
    try {
      await this.twoFactorService.disable2FA();
      this.is2FAEnabled = false;
      await this.initializeSetup();
    } catch (error) {
      console.error('Erreur lors de la désactivation du 2FA:', error);
    }
  }
}