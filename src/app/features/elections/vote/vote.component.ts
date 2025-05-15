import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ElectionService } from '../../../core/services/election.service';
import { VoteService } from '../../../core/services/vote.service';
import { ValidationService } from '../../../core/services/validation.service';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="vote-container">
      <!-- Étape de vérification d'éligibilité -->
      <div class="verification-step" *ngIf="currentStep === 'verification'">
        <div class="step-header">
          <h2>Vérification d'éligibilité</h2>
          <p>Nous vérifions votre éligibilité pour cette élection</p>
        </div>

        <div class="verification-status" *ngIf="isVerifying">
          <div class="spinner"></div>
          <p>Vérification en cours...</p>
        </div>

        <div class="verification-error" *ngIf="verificationError">
          <div class="error-icon">❌</div>
          <h3>Non éligible</h3>
          <p>{{ verificationError }}</p>
          <button class="btn btn-outline" routerLink="/elections">Retour aux élections</button>
        </div>
      </div>

      <!-- Étape du vote -->
      <div class="voting-step" *ngIf="currentStep === 'voting'">
        <div class="step-header">
          <h2>{{ election?.title }}</h2>
          <p>Sélectionnez votre candidat</p>
        </div>

        <div class="candidates-list">
          <div *ngFor="let candidate of election?.candidates" 
               class="candidate-card"
               [class.selected]="selectedCandidate?.id === candidate.id"
               (click)="selectCandidate(candidate)">
            <div class="candidate-info">
              <h3>{{ candidate.name }}</h3>
              <p>{{ candidate.position }}</p>
            </div>
            <div class="selection-indicator">
              <div class="checkbox" [class.checked]="selectedCandidate?.id === candidate.id">
                <span *ngIf="selectedCandidate?.id === candidate.id">✓</span>
              </div>
            </div>
          </div>
        </div>

        <div class="voting-actions">
          <button class="btn btn-outline" (click)="cancelVote()">Annuler</button>
          <button class="btn btn-primary" 
                  [disabled]="!selectedCandidate"
                  (click)="proceedToConfirmation()">
            Continuer
          </button>
        </div>
      </div>

      <!-- Étape de confirmation -->
      <div class="confirmation-step" *ngIf="currentStep === 'confirmation'">
        <div class="step-header">
          <h2>Confirmation du vote</h2>
          <p>Vérifiez votre choix avant de confirmer</p>
        </div>

        <div class="confirmation-details">
          <div class="detail-group">
            <span class="detail-label">Élection</span>
            <span class="detail-value">{{ election?.title }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Candidat sélectionné</span>
            <span class="detail-value">{{ selectedCandidate?.name }}</span>
          </div>
          <div class="detail-group">
            <span class="detail-label">Date du vote</span>
            <span class="detail-value">{{ currentDate | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>

        <div class="confirmation-warning">
          <p>⚠️ Cette action est définitive et ne pourra pas être modifiée.</p>
        </div>

        <div class="confirmation-actions">
          <button class="btn btn-outline" (click)="currentStep = 'voting'">
            Modifier mon choix
          </button>
          <button class="btn btn-primary" (click)="submitVote()">
            Confirmer mon vote
          </button>
        </div>
      </div>

      <!-- Étape du reçu -->
      <div class="receipt-step" *ngIf="currentStep === 'receipt'" #receiptSection>
        <div class="step-header">
          <h2>Vote enregistré avec succès</h2>
          <p>Votre vote a été comptabilisé</p>
        </div>

        <div class="receipt-card">
          <div class="receipt-header">
            <h3>Reçu de vote</h3>
            <span class="receipt-date">{{ currentDate | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>

          <div class="receipt-details">
            <div class="detail-group">
              <span class="detail-label">Identifiant du vote</span>
              <span class="detail-value">{{ voteId }}</span>
            </div>
            <div class="detail-group">
              <span class="detail-label">Élection</span>
              <span class="detail-value">{{ election?.title }}</span>
            </div>
            <div class="qr-code" *ngIf="qrCodeUrl">
              <img [src]="qrCodeUrl" alt="QR Code du vote">
            </div>
          </div>

          <div class="receipt-footer">
            <p>Ce reçu confirme votre participation à l'élection.</p>
          </div>
        </div>

        <div class="receipt-actions">
      
          <button class="btn btn-primary" routerLink="/elections">
            Retour aux élections
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vote-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px;
    }

    .step-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .step-header h2 {
      font-size: 1.8rem;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .step-header p {
      color: var(--gray-500);
    }

    /* Styles de vérification */
    .verification-status {
      text-align: center;
      padding: 48px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(63, 81, 181, 0.1);
      border-radius: 50%;
      border-top-color: var(--secondary);
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    .verification-error {
      text-align: center;
      padding: 32px;
      background: rgba(244, 67, 54, 0.1);
      border-radius: var(--border-radius);
    }

    .error-icon {
      font-size: 2rem;
      margin-bottom: 16px;
    }

    /* Styles des candidats */
    .candidates-list {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }

    .candidate-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: white;
      border: 2px solid var(--gray-200);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
    }

    .candidate-card:hover {
      border-color: var(--secondary);
      transform: translateY(-2px);
    }

    .candidate-card.selected {
      border-color: var(--secondary);
      background: rgba(63, 81, 181, 0.05);
    }

    .candidate-info h3 {
      margin: 0 0 4px;
      color: var(--primary);
    }

    .candidate-info p {
      margin: 0;
      color: var(--gray-500);
    }

    .checkbox {
      width: 24px;
      height: 24px;
      border: 2px solid var(--gray-300);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
    }

    .checkbox.checked {
      background: var(--secondary);
      border-color: var(--secondary);
      color: white;
    }

    /* Styles de confirmation */
    .confirmation-details {
      background: white;
      padding: 24px;
      border-radius: var(--border-radius);
      margin-bottom: 24px;
    }

    .detail-group {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--gray-200);
    }

    .detail-group:last-child {
      border-bottom: none;
    }

    .detail-label {
      color: var(--gray-500);
    }

    .detail-value {
      font-weight: 500;
      color: var(--primary);
    }

    .confirmation-warning {
      text-align: center;
      padding: 16px;
      background: rgba(255, 152, 0, 0.1);
      border-radius: var(--border-radius);
      margin-bottom: 24px;
    }

    /* Styles du reçu */
    .receipt-card {
      background: white;
      padding: 32px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
      margin-bottom: 32px;
    }

    .receipt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--gray-200);
    }

    .receipt-date {
      color: var(--gray-500);
    }

    .qr-code {
      text-align: center;
      margin: 24px 0;
    }

    .qr-code img {
      max-width: 200px;
      height: auto;
    }

    .receipt-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--gray-200);
      text-align: center;
      color: var(--gray-500);
    }

    /* Styles des actions */
    .voting-actions,
    .confirmation-actions,
    .receipt-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .vote-container {
        padding: 16px;
      }

      .voting-actions,
      .confirmation-actions,
      .receipt-actions {
        flex-direction: column;
      }

      .voting-actions button,
      .confirmation-actions button,
      .receipt-actions button {
        width: 100%;
      }
    }
  `]
})
export class VoteComponent implements OnInit {
  currentStep: 'verification' | 'voting' | 'confirmation' | 'receipt' = 'verification';
  isVerifying = false;
  verificationError: string | null = null;
  election: any = null;
  selectedCandidate: any = null;
  currentDate = new Date();
  voteId: string = '';
  qrCodeUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private voteService: VoteService,
    private validationService: ValidationService
  ) {}

  async ngOnInit() {
    try {
      const electionId = this.route.snapshot.paramMap.get('id');
      if (!electionId) {
        throw new Error('ID de l\'élection non fourni');
      }

      // Vérifier l'éligibilité
      this.isVerifying = true;
      const eligibility = await this.validationService.checkEligibility(
        'current-user-id',
        electionId
      );

      if (!eligibility.eligible) {
        this.verificationError = eligibility.reason || 'Vous n\'êtes pas éligible pour cette élection';
        return;
      }

      // Charger les détails de l'élection
      this.election = await this.electionService.getElections();
      this.currentStep = 'voting';
    } catch (error: any) {
      this.verificationError = error.message;
    } finally {
      this.isVerifying = false;
    }
  }

  selectCandidate(candidate: any) {
    this.selectedCandidate = candidate;
  }

  proceedToConfirmation() {
    if (this.selectedCandidate) {
      this.currentStep = 'confirmation';
    }
  }

  cancelVote() {
    this.router.navigate(['/elections']);
  }

  async submitVote() {
    try {
      if (!this.election || !this.selectedCandidate) return;

      const vote = await this.voteService.submitVote(
        this.election.id,
        this.selectedCandidate.id
      );
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  }

}