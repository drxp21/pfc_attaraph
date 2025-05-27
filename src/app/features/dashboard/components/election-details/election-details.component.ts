import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ElectionService, Election } from '../../../../core/services/election.service';
import { VoteService } from '../../../../core/services/vote.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
// Assuming AuthService is available for role checking
// import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="election-details-container">
    <div class="admin-actions mt-4 pt-3 border-top">
     <h4>Actions Administrateur</h4>
     <button class="btn btn-warning" (click)="closeAndCalculateElection()">
       Fermer l'élection
     </button>
      <div *ngIf="actionMessage" class="alert mt-2" [ngClass]="actionMessageType === 'success' ? 'alert-success' : 'alert-danger'">
       {{ actionMessage }}
     </div>
   </div>
      <div *ngIf="election" class="election-card">
        <div class="election-header">
          <h2>{{ election.titre }}</h2>
          <span class="badge" [ngClass]="{
            'bg-success': election.statut === 'EN_COURS',
            'bg-warning': election.statut === 'BROUILLON',
            'bg-secondary': election.statut === 'FERMEE'
          }">
            {{ election.statut === 'EN_COURS' ? 'En cours' : election.statut === 'BROUILLON' ? 'À venir' : election.statut === 'OUVERTE' ? 'Ouverte' : election.statut === 'FERMEE' ? 'Fermée' : 'Terminée'                }}
               
          </span>
        </div>

        <div class="election-meta">
          <div class="meta-item">
            <span class="meta-label">Date de début:</span>
            <span class="meta-value">{{ election.date_debut_vote | date:'medium' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Date de fin:</span>
            <span class="meta-value">{{ election.date_fin_vote | date:'medium' }}</span>
          </div>
        </div>

        <div class="election-description">
          <h3>Description</h3>
          <p>{{ election.description || 'Aucune description disponible.' }}</p>
        </div>

        <div class="candidates-section" *ngIf="election.candidatures && election.candidatures.length > 0">
          <h3>Candidats</h3>
          <div class="candidates-grid">
            <div *ngFor="let candidature of election.candidatures" class="candidate-card" 
                 (click)="selectCandidate(candidature)" 
                 [class.selected]="selectedCandidate?.id === candidature.id">
              <div class="candidate-avatar">
                {{ candidature.candidat?.prenom?.charAt(0) || '?' }}{{ candidature.candidat?.nom?.charAt(0) || '?' }}
              </div>
              <div class="candidate-info">
                <h4>{{ candidature.candidat?.prenom }} {{ candidature.candidat?.nom }}</h4>
                <p *ngIf="candidature.programme">{{ candidature.programme | slice:0:100 }}...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Actions Section -->
     

        <div class="vote-actions" *ngIf="election.statut === 'EN_COURS' && !hasVoted && !isAdmin">
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="blankVote" [(ngModel)]="isBlankVote" (change)="onBlankVoteChange()">
            <label class="form-check-label" for="blankVote">
              Voter blanc (ne pas choisir de candidat)
            </label>
          </div>
          
          <button class="btn btn-primary" (click)="submitVote()" [disabled]="!canVote()">
            {{ isSubmitting ? 'Envoi en cours...' : 'Confirmer mon vote' }}
          </button>
          <div *ngIf="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>
        </div>

        <div *ngIf="hasVoted && !isAdmin" class="alert alert-success">
          Vous avez voté pour cette élection. Merci pour votre participation !
        </div>
      </div>

      <div *ngIf="!election && !isLoading" class="alert alert-warning">
        Impossible de charger les détails de l'élection.
      </div>
    </div>
  `,
  styles: [`
    .election-details-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .election-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 2rem;
    }
    
    .election-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .election-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eee;
    }
    
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    
    .meta-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .meta-value {
      font-weight: 500;
    }
    
    .candidates-section {
      margin: 2rem 0;
    }
    
    .candidates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .candidate-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .candidate-card:hover {
      border-color: #0d6efd;
      background-color: #f8f9fa;
    }
    
    .candidate-card.selected {
      border-color: #0d6efd;
      background-color: #e7f1ff;
    }
    
    .candidate-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #0d6efd;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .vote-actions {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }
    
    .alert {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    
    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    
    .alert-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    
    .alert-warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
    
    .btn {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, 
                  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .btn-primary {
      color: #fff;
      background-color: #0d6efd;
      border-color: #0d6efd;
    }
    
    .btn-primary:hover {
      background-color: #0b5ed7;
      border-color: #0a58ca;
    }
    
    .btn-primary:disabled {
      background-color: #6c757d;
      border-color: #6c757d;
      opacity: 0.65;
    }
    
    .btn-link {
      font-weight: 400;
      color: #0d6efd;
      text-decoration: none;
      background-color: transparent;
      border: none;
      padding: 0;
    }
    
    .btn-link:hover {
      color: #0a58ca;
      text-decoration: underline;
    }
    
    .form-check {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .form-check-input {
      margin-right: 0.5rem;
    }
    
    .admin-actions {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }
    .admin-actions h4 {
      margin-bottom: 1rem;
    }
  `]
})
export class ElectionDetailsComponent implements OnInit {
  election: Election | null = null;
  selectedCandidate: any = null;
  isBlankVote = false;
  isSubmitting = false;
  hasVoted = false;
  errorMessage: string | null = null;
  isLoading = true;
  isAdmin = false; // Placeholder: Implement actual admin check
  actionMessage: string | null = null;
  actionMessageType: 'success' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private voteService: VoteService,
    private authService: AuthService,
    // private authService: AuthService // Inject if needed for isAdmin check
  ) { }

  ngOnInit() {
    // Placeholder for isAdmin check - replace with actual logic from AuthService
    this.isAdmin = this.authService.getUserRole() === 'ADMIN'; 
    this.loadElection();
  }

  loadElection() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.electionService.getElection(+id).subscribe({
        next: (data) => {
          this.election = data;
          if (this.election.statut === 'EN_COURS') {
            this.checkIfVoted(); // Only check if voted if election is in progress
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error loading election:', err);
          this.errorMessage = "Impossible de charger les détails de l'élection.";
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = "ID de l'élection non trouvé.";
      this.isLoading = false;
    }
  }

  checkIfVoted() {
    if (!this.election) return;
    this.voteService.hasVoted(this.election.id).subscribe({
      next: (response: any) => {
        this.hasVoted = typeof response === 'boolean' ? response : response?.hasVoted === true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error checking vote status:', error);
        this.hasVoted = false; 
        this.isLoading = false;
      }
    });
  }

  selectCandidate(candidate: any) {
    if (this.isBlankVote) {
      this.isBlankVote = false;
    }
    this.selectedCandidate = candidate;
  }

  onBlankVoteChange() {
    if (this.isBlankVote) {
      this.selectedCandidate = null;
    }
  }

  canVote(): boolean {
    return !this.isSubmitting && (this.isBlankVote || this.selectedCandidate !== null);
  }

  submitVote() {
    if (!this.election || !this.canVote()) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const voteData = {
      election_id: this.election.id,
      candidature_id: this.isBlankVote ? null : this.selectedCandidate?.id,
      vote_blanc: this.isBlankVote
    };

    this.voteService.submitVote(voteData).subscribe({
      next: (response) => {
        this.hasVoted = true;
        this.isSubmitting = false;
        this.actionMessage = 'Votre vote a été enregistré avec succès!';
        this.actionMessageType = 'success';
        // Optionally navigate or show persistent success message
      },
      error: (error) => {
        console.error('Error submitting vote:', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'envoi de votre vote';
        this.isSubmitting = false;
      }
    });
  }

  closeAndCalculateElection(): void {
    if (!this.election || !this.isAdmin) return;
    this.actionMessage = null;
    this.electionService.closeElection(this.election.id).subscribe({
      next: () => {
        this.actionMessage = 'L\'élection a été fermée avec succès. Le calcul des résultats est en cours.';
        this.actionMessageType = 'success';
        this.election!.statut = 'FERMEE'; // Update status locally
        // Optionally, navigate to results page or refresh data more thoroughly
        // this.loadElection(); // to refresh everything including disabling the button
         this.router.navigate(['../results'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error closing election:', err);
        this.actionMessage = err.error?.message || 'Erreur lors de la fermeture de l\'élection.';
        this.actionMessageType = 'error';
      }
    });
  }

  viewResults(election: Election) {
    this.router.navigate(['election', election.id, 'results'], { relativeTo: this.route });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route }); // Navigate to parent (elections list)
  }
}
