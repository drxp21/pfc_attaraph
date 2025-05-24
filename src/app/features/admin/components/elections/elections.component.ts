import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  ElectionService,
  Election,
  TypeElection,
} from '../../../../core/services/election.service';
import { AuthService, User } from '../../../../core/services/auth.service';

// Validator to ensure a date is not in the past (allows today)
export function notPastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values, let 'required' handle it
    }
    // For <input type="date">, value is "YYYY-MM-DD".
    // Append time to ensure it's compared as local start of day.
    const selectedDate = new Date(control.value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare with start of today

    return selectedDate < today ? { pastDate: true } : null;
  };
}

// Validator to ensure dateTwoControlName is after dateOneControlName
export function dateRangeValidator(dateOneControlName: string, dateTwoControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const dateOneControl = formGroup.get(dateOneControlName);
    const dateTwoControl = formGroup.get(dateTwoControlName);

    if (!dateOneControl || !dateTwoControl || !dateOneControl.value || !dateTwoControl.value) {
      return null; // Don't validate if controls or values are missing
    }

    const d1 = new Date(dateOneControl.value + 'T00:00:00');
    const d2 = new Date(dateTwoControl.value + 'T00:00:00');

    if (d2 <= d1) {
      // Set error on the second date control for specific error message display
      dateTwoControl.setErrors({ ...dateTwoControl.errors, dateOrder: true });
      return { [`${dateTwoControlName}Order`]: true }; // Return a unique error key for the group
    } else {
      // Clear the specific error if it was previously set
      const errors = dateTwoControl.errors;
      if (errors && errors['dateOrder']) {
        delete errors['dateOrder'];
        if (Object.keys(errors).length === 0) {
          dateTwoControl.setErrors(null);
        } else {
          dateTwoControl.setErrors(errors);
        }
      }
    }
    return null;
  };
}

@Component({
  selector: 'app-elections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, RouterModule],
  templateUrl: './elections.component.html',
  styles: [`
    /* Add component-specific styles here if needed */
  `]
})
export class ElectionsComponent implements OnInit, OnDestroy {
  electionTypes: { value: TypeElection; viewValue: string }[] = [
    { value: 'CHEF_DEPARTEMENT', viewValue: 'Chef de Département' },
    { value: 'DIRECTEUR_UFR', viewValue: "Directeur d'UFR" },
    { value: 'VICE_RECTEUR', viewValue: 'Vice-Recteur' },
  ];
  showNewElectionForm = false;
  electionForm: FormGroup;
  elections: Election[] = [];
  isLoading = false;
  isEditMode = false;
  currentElectionId: number | null = null;
  showDeleteConfirmation = false;
  electionToDelete: Election | null = null;

  isAdmin = false;
  private userSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private electionService: ElectionService,
    private authService: AuthService
  ) {
    this.electionForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      type_election: ['', Validators.required],
      departement_id: [null], // Optional, no validator for now
      date_debut_candidature: ['', [Validators.required, notPastDateValidator()]],
      date_fin_candidature: ['', Validators.required],
      date_debut_vote: ['', Validators.required],
      date_fin_vote: ['', Validators.required],
    }, {
      validators: [
        dateRangeValidator('date_debut_candidature', 'date_fin_candidature'),
        dateRangeValidator('date_fin_candidature', 'date_debut_vote'),
        dateRangeValidator('date_debut_vote', 'date_fin_vote') // Assuming fin_vote should be after debut_vote
      ]
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe((user: User | null) => {
      console.log('ElectionsComponent - User from AuthService:', user);
      this.isAdmin = user?.type_personnel === 'ADMIN';
      console.log('ElectionsComponent - isAdmin:', this.isAdmin);
    });
    this.loadElections();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.elections = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des élections:', err);
        this.isLoading = false;
        // TODO: Afficher un message d'erreur à l'utilisateur
      },
    });
  }

  toggleNewElectionForm(): void {
    this.showNewElectionForm = !this.showNewElectionForm;
    if (!this.showNewElectionForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.electionForm.reset({
      titre: '',
      description: '',
      type_election: '',
      departement_id: null,
      date_debut_candidature: '',
      date_fin_candidature: '',
      date_debut_vote: '',
      date_fin_vote: '',
      // Set other defaults if needed, e.g., departement_id: null if it's not automatically null
    });
    this.isEditMode = false;
    this.currentElectionId = null;
  }

  cancelEdit(): void {
    if (this.isEditMode) {
      this.isEditMode = false;
      this.currentElectionId = null;
      this.showNewElectionForm = false;
    } else {
      this.resetForm();
    }
  }

  editElection(election: Election): void {
    if (!this.isAdmin) return;

    this.isEditMode = true;
    this.currentElectionId = election.id;
    this.showNewElectionForm = false; // Hide the new election form if it's open

    // Format dates for the form (YYYY-MM-DD format for input[type=date])
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    };

    this.electionForm.patchValue({
      titre: election.titre,
      description: election.description,
      type_election: election.type_election,
      departement_id: election.departement_id || null,
      date_debut_candidature: formatDate(election.date_debut_candidature),
      date_fin_candidature: formatDate(election.date_fin_candidature),
      date_debut_vote: formatDate(election.date_debut_vote),
      date_fin_vote: formatDate(election.date_fin_vote),
    });
  }

  confirmDeleteElection(election: Election): void {
    if (!this.isAdmin) return;

    this.electionToDelete = election;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.electionToDelete = null;
  }

  deleteElection(): void {
    if (!this.isAdmin || !this.electionToDelete) return;

    this.electionService.deleteElection(this.electionToDelete.id).subscribe({
      next: () => {
        console.log(
          `Élection ${this.electionToDelete?.id} supprimée avec succès.`
        );
        this.loadElections(); // Refresh list
        this.cancelDelete(); // Close the confirmation dialog
        // TODO: Afficher un message de succès
      },
      error: (err) => {
        console.error(
          `Erreur lors de la suppression de l'élection ${this.electionToDelete?.id}:`,
          err
        );
        // TODO: Afficher un message d'erreur
      },
    });
  }

  onSubmit(): void {
    if (this.electionForm.valid) {
      // Ensure all fields expected by the backend are present, even if optional and empty
      const formValue = this.electionForm.value;
      const electionData: Partial<Election> = {
        titre: formValue.titre,
        description: formValue.description,
        type_election: formValue.type_election,
        date_debut_candidature: formValue.date_debut_candidature,
        date_fin_candidature: formValue.date_fin_candidature,
        date_debut_vote: formValue.date_debut_vote,
        date_fin_vote: formValue.date_fin_vote,
        // statut will be set below
      };

      // Only set statut for new elections, not when editing
      if (!this.isEditMode) {
        electionData.statut = 'BROUILLON'; // Backend expects this for new/draft elections
      }

      // Handle optional departement_id: if it's null or not a valid number from the form,
      // make it undefined or omit it. Since it's type number, empty input becomes null.
      if (
        formValue.departement_id !== null &&
        !isNaN(Number(formValue.departement_id))
      ) {
        electionData.departement_id = Number(formValue.departement_id);
      } else {
        // If null, or NaN (e.g. if input was text), treat as not provided.
        // It will be undefined by not being set on electionData if it's not added above.
        // Or explicitly: electionData.departement_id = undefined;
      }

      if (this.isEditMode && this.currentElectionId) {
        // Update existing election
        console.log(
          `Mise à jour de l'élection ${this.currentElectionId} (payload):`,
          electionData
        );
        this.electionService
          .updateElection(this.currentElectionId, electionData)
          .subscribe({
            next: (updatedElection) => {
              console.log(
                `Élection ${this.currentElectionId} mise à jour avec succès:`,
                updatedElection
              );
              this.loadElections(); // Refresh list
              this.resetForm();
              this.isEditMode = false;
              this.currentElectionId = null;
              // TODO: Afficher un message de succès
            },
            error: (err) => {
              console.error(
                `Erreur lors de la mise à jour de l'élection ${this.currentElectionId}:`,
                err
              );
              // TODO: Afficher un message d'erreur détaillé
            },
          });
      } else {
        // Create new election
        console.log('Nouvelle élection (payload):', electionData);
        this.electionService.createElection(electionData).subscribe({
          next: (newElection) => {
            console.log('Élection créée avec succès:', newElection);
            this.loadElections(); // Refresh list
            this.resetForm();
            this.showNewElectionForm = false;
            // TODO: Afficher un message de succès
          },
          error: (err) => {
            console.error("Erreur lors de la création de l'élection:", err);
            // TODO: Afficher un message d'erreur détaillé
          },
        });
      }
    }
  }

  openElection(electionId: number): void {
    if (!this.isAdmin) return;
    this.electionService.openElection(electionId).subscribe({
      next: () => {
        console.log(`Élection ${electionId} ouverte avec succès.`);
        this.loadElections(); // Refresh list
        // TODO: Afficher un message de succès
      },
      error: (err) => {
        console.error(
          `Erreur lors de l'ouverture de l'élection ${electionId}:`,
          err
        );
        // TODO: Afficher un message d'erreur
      },
    });
  }

  closeElection(electionId: number): void {
    if (!this.isAdmin) return;
    this.electionService.closeElection(electionId).subscribe({
      next: () => {
        console.log(`Élection ${electionId} fermée avec succès.`);
        this.loadElections(); // Refresh list
        // TODO: Afficher un message de succès
      },
      error: (err) => {
        console.error(
          `Erreur lors de la fermeture de l'élection ${electionId}:`,
          err
        );
        // TODO: Afficher un message d'erreur
      },
    });
  }

  // Helper for template to map status to CSS class
  getStatutClass(statut: string | undefined): string {
    if (!statut) return '';
    switch (statut) {
      case 'OUVERTE':
        return 'active'; // Or a new class like 'ouverte'
      case 'EN_COURS':
        return 'active'; // Or a new class like 'en-cours'
      case 'BROUILLON':
        return 'draft';
      case 'FERMEE':
        return 'closed'; // Or a new class like 'fermee'
      default:
        return ''; // Should not happen if statut is one of the defined types
    }
  }

  mapStatutForDisplay(statut: string | undefined): string {
    if (!statut) return 'N/A';
    const mapping: { [key: string]: string } = {
      'BROUILLON': 'Brouillon',
      'OUVERTE': 'Ouverte',
      'EN_COURS': 'En Cours',
      'FERMEE': 'Fermée',
    };
    return mapping[statut] || statut; // Fallback to raw statut if not in map
  }
}