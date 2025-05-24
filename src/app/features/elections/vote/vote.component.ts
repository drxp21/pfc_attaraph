import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectionService, Election } from '../../../core/services/election.service';
import { VoteService } from '../../../core/services/vote.service';
import { Candidature } from '../../../core/services/candidature.service';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vote-container">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de l'élection...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Vote Content -->
      <div *ngIf="!isLoading && !errorMessage" class="vote-content">
        <div class="vote-header">
          <h2>{{ election?.titre }}</h2>
          <p>Sélectionnez votre choix de vote</p>
        </div>

        <!-- Vote Blanc Option -->
        <div class="vote-option" 
             [class.selected]="isBlankVote" 
             (click)="selectBlankVote()">
          <h3>Vote Blanc</h3>
          <p>Choisir cette option pour un vote blanc</p>
        </div>

        <!-- Candidats -->
        <div class="candidates-list" *ngIf="!isBlankVote">
          <div *ngIf="validCandidatures.length === 0 && !isBlankVote" class="no-candidates-message">
            <p>Aucun candidat validé pour cette élection.</p>
          </div>
          <div *ngFor="let candidature of validCandidatures" 
               class="candidate-option" 
               [class.selected]="selectedCandidature?.id === candidature.id"
               (click)="selectCandidate(candidature)">
            <div class="candidate-info">
              <h3>{{ candidature.candidat?.nom }} {{ candidature.candidat?.prenom }}</h3>
              <p class="programme">{{ candidature.programme }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="vote-actions">
          <button class="btn btn-secondary" (click)="cancel()">Annuler</button>
          <button class="btn btn-primary" 
                  [disabled]="!canVote()" 
                  (click)="submitVote()">
            {{ isSubmitting ? 'Vote en cours...' : 'Voter' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vote-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .loading-state {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #2196F3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      color: #f44336;
      padding: 15px;
      margin: 10px 0;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .vote-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .vote-header h2 {
      margin: 0 0 10px;
      color: #1976D2;
    }

    .vote-option, .candidate-option {
      padding: 20px;
      margin: 10px 0;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .vote-option:hover, .candidate-option:hover {
      border-color: #2196F3;
      background-color: #f5f5f5;
    }

    .selected {
      border-color: #2196F3;
      background-color: #e3f2fd;
    }

    .candidate-info h3 {
      margin: 0 0 10px;
      color: #1976D2;
    }

    .programme {
      color: #616161;
      line-height: 1.5;
      margin: 0;
    }

    .vote-actions {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #2196F3;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1976D2;
    }

    .btn-primary:disabled {
      background-color: #90CAF9;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #9E9E9E;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #757575;
    }

    .no-candidates-message {
      padding: 20px;
      margin: 10px 0;
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      text-align: center;
      color: #616161;
    }
  `]
})
export class VoteComponent implements OnInit {
  election: Election | null = null;
  selectedCandidature: Candidature | null = null;
  isBlankVote = false;
  errorMessage: string | null = null;
  isLoading = true;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private voteService: VoteService
  ) {}

  ngOnInit() {
    const electionId = this.route.snapshot.paramMap.get('id');
    if (!electionId) {
      this.errorMessage = 'ID de l\'élection non fourni';
      this.isLoading = false;
      return;
    }

    // Vérifier si l'utilisateur a déjà voté
    this.voteService.hasVoted(Number(electionId)).subscribe({
      next: (hasVoted) => {
        if (hasVoted) {
          this.errorMessage = 'Vous avez déjà voté pour cette élection';
          this.isLoading = false;
          return;
        }
        
        // Charger les détails de l'élection
        this.loadElection(Number(electionId));
      },
      error: (error) => {
        if (error.status === 403) {
          this.errorMessage = error.error?.message || 'Vous n\'êtes pas autorisé à participer à cette élection.';
        } else if (error.status === 404) {
          this.errorMessage = 'Élection non trouvée pour la vérification du vote.';
        } else {
          this.errorMessage = 'Erreur lors de la vérification du statut de vote.';
        }
        this.isLoading = false;
        console.error('Error checking vote status:', error);
      }
    });
  }

  private loadElection(electionId: number) {
    this.electionService.getElection(electionId).subscribe({
      next: (election) => {
        this.election = election;
        
        // Vérifier si l'élection est en cours
        const now = new Date();
        const startDate = new Date(election.date_debut_vote);
        const endDate = new Date(election.date_fin_vote);
        
        if (election.statut !== 'EN_COURS') {
          this.errorMessage = 'Cette élection n\'est pas en cours';
        } else if (now < startDate) {
          this.errorMessage = 'La période de vote n\'a pas encore commencé';
        } else if (now > endDate) {
          this.errorMessage = 'La période de vote est terminée';
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'élection';
        console.error('Error loading election:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get validCandidatures(): Candidature[] {
    if (!this.election || !this.election.candidatures) {
      return [];
    }
    return this.election.candidatures.filter(c => c.statut === 'VALIDEE');
  }

  selectCandidate(candidature: Candidature) {
    this.selectedCandidature = candidature;
    this.isBlankVote = false;
  }

  selectBlankVote() {
    this.isBlankVote = true;
    this.selectedCandidature = null;
  }

  canVote(): boolean {
    if (this.isSubmitting) return false;
    if (this.isBlankVote) return true;
    return this.selectedCandidature !== null && this.validCandidatures.some(c => c.id === this.selectedCandidature?.id);
  }

  submitVote() {
    if (!this.election || !this.canVote()) {
      if (!this.election) this.errorMessage = "Les informations de l'élection n'ont pas pu être chargées.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const voteData = {
      election_id: this.election.id,
      candidature_id: this.selectedCandidature?.id || null,
      vote_blanc: this.isBlankVote
    };

    this.voteService.submitVote(voteData).subscribe({
      next: (response) => {
        console.log('Vote submitted successfully:', response);
        this.router.navigate(['/dashboard/elections'], { queryParams: { voteSuccess: true } });
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.error?.errors) {
          const messages = Object.values(error.error.errors).flat();
          this.errorMessage = messages.join(' ');
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 0 || error.status === 503) {
          this.errorMessage = 'Service de vote indisponible. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de la soumission du vote.';
        }
        console.error('Error submitting vote:', error);
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/elections']);
  }
}