import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CandidatureService, MyCandidatureDisplay, NewCandidaturePayload, Candidature } from '../../../../core/services/candidature.service';
import { ElectionService, Election } from '../../../../core/services/election.service'; // For fetching available elections
import { AuthService, User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-candidature',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.scss']
})
export class CandidatureComponent implements OnInit, OnDestroy {
  candidatureForm: FormGroup;
  availableElections: Election[] = [];
  myCandidatures: MyCandidatureDisplay[] = [];
  isLoadingElections = false;
  isLoadingMyCandidatures = false;
  isSubmitting = false;
  showForm = false;
  submissionError: string | null = null;
  currentUser: User | null = null;
  private authSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private candidatureService: CandidatureService,
    private electionService: ElectionService, // Or use candidatureService.getAvailableElectionsForCandidature()
    private authService: AuthService
  ) {
    this.candidatureForm = this.fb.group({
      election_id: ['', Validators.required],
      programme: ['', [Validators.required, Validators.minLength(50)]],
      // Documents might be added here if needed: cv: [null], lettre_motivation: [null]
    });
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user && user.type_personnel !== 'PER') {
        // Non-PER users should not see this page or form, handle redirection or message
        console.warn('User is not PER, candidature submission is not allowed.');
        // Potentially navigate away or disable form actions
      }
    });
    this.loadAvailableElections();
    this.loadMyCandidatures();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  loadAvailableElections(): void {
    this.isLoadingElections = true;
    // Assuming ElectionService has a method to get elections open for candidature
    // Or use this.candidatureService.getAvailableElectionsForCandidature()
    this.electionService.getElections().subscribe({
      next: (elections) => {
        // Filter for elections that are 'OUVERTE' for candidatures
        // This logic might be more complex based on actual election statuses for candidature period
        this.availableElections = elections.filter(e => e.statut === 'OUVERTE' || e.statut === 'EN_COURS'); // Adjust as per actual election status meaning
        this.isLoadingElections = false;
      },
      error: (err) => {
        console.error('Erreur chargement élections disponibles:', err);
        this.isLoadingElections = false;
      }
    });
  }

  loadMyCandidatures(): void {
    this.isLoadingMyCandidatures = true;
    this.candidatureService.getMyCandidatures().subscribe({
      next: (candidatures) => {
        this.myCandidatures = candidatures;
        this.isLoadingMyCandidatures = false;
      },
      error: (err) => {
        console.error('Erreur chargement mes candidatures:', err);
        this.isLoadingMyCandidatures = false;
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.candidatureForm.reset();
      this.submissionError = null;
    } else {
      this.submissionError = null; // Clear error when hiding form
    }
  }

  onSubmit(): void {
    if (!this.currentUser || this.currentUser.type_personnel !== 'PER') {
      this.submissionError = 'Seuls les PER peuvent soumettre une candidature.';
      console.error('Attempted submission by non-PER user or no user.');
      return;
    }

    if (this.candidatureForm.invalid) {
      this.submissionError = 'Veuillez remplir tous les champs requis.';
      return;
    }

    this.isSubmitting = true;
    this.submissionError = null;

    const payload: NewCandidaturePayload = {
      election_id: this.candidatureForm.value.election_id,
      programme: this.candidatureForm.value.programme,
      // candidat_id will be set by the backend using the authenticated user
    };

    this.candidatureService.submitCandidature(payload).subscribe({
      next: (newCandidature) => {
        console.log('Candidature soumise avec succès:', newCandidature);
        this.isSubmitting = false;
        this.showForm = false;
        this.loadMyCandidatures(); // Refresh the list
        // Optionally, reset form if staying on page: this.candidatureForm.reset();
      },
      error: (err) => {
        console.error('Erreur soumission candidature:', err);
        this.isSubmitting = false;
        this.submissionError = err.error?.message || 'Une erreur est survenue lors de la soumission.';
        if (err.error?.errors) {
          // Handle specific field errors if backend provides them
          console.log('Field errors:', err.error.errors);
          // You could map these to form controls if needed
        }
      }
    });
  }

  // Helper to get displayable status for MyCandidatureDisplay
  mapCandidatureStatut(statut: Candidature['statut'] | undefined): string {
    if (!statut) return 'N/A';
    const mapping: { [key: string]: string } = {
      'SOUMISE': 'Soumise',
      'EN_ATTENTE': 'En attente de validation',
      'VALIDEE': 'Validée',
      'REJETEE': 'Rejetée',
      'RETIREE': 'Retirée / Annulée'
    };
    return mapping[statut] || statut;
  }

  // TODO: Implement withdrawCandidature if needed
  // withdrawCandidature(candidatureId: number): void { ... }
}