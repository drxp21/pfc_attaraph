import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Departement, DepartementService } from '../../../../core/services/departement.service';

@Component({
  selector: 'app-departements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departements.component.html',
  styleUrls: ['./departements.component.scss']
})
export class DepartementsComponent implements OnInit {
  departements: Departement[] = [];
  departementForm: FormGroup;
  isEditing = false;
  currentDepartementId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService
  ) {
    this.departementForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      code: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartements();
  }

  loadDepartements(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.departementService.getDepartements().subscribe({
      next: (data) => {
        this.departements = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des départements.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.departementForm.invalid) {
      this.errorMessage = 'Veuillez corriger les erreurs du formulaire.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const departementData = this.departementForm.value;

    if (this.isEditing && this.currentDepartementId !== null) {
      this.departementService.updateDepartement(this.currentDepartementId, departementData).subscribe({
        next: (updatedDepartement) => {
          this.successMessage = 'Département mis à jour avec succès.';
          this.loadDepartements();
          this.resetForm();
        },
        error: (err) => this.handleError(err, 'mise à jour')
      });
    } else {
      this.departementService.createDepartement(departementData).subscribe({
        next: (newDepartement) => {
          this.successMessage = 'Département créé avec succès.';
          this.loadDepartements(); 
          this.resetForm();
        },
        error: (err) => this.handleError(err, 'création')
      });
    }
  }

  editDepartement(departement: Departement): void {
    this.isEditing = true;
    this.currentDepartementId = departement.id;
    this.departementForm.patchValue(departement);
    this.errorMessage = null;
    this.successMessage = null;
    window.scrollTo(0, 0); // Scroll to top to see the form
  }

  deleteDepartement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;
      this.departementService.deleteDepartement(id).subscribe({
        next: () => {
          this.successMessage = 'Département supprimé avec succès.';
          this.loadDepartements();
        },
        error: (err) => this.handleError(err, 'suppression')
      });
    }
  }

  resetForm(): void {
    this.departementForm.reset();
    this.isEditing = false;
    this.currentDepartementId = null;
    this.isLoading = false;
    this.errorMessage = null;
    // Keep success message for a bit if needed, or clear it
    // setTimeout(() => this.successMessage = null, 3000);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private handleError(error: any, action: string): void {
    this.isLoading = false;
    if (error.error?.errors) { // Laravel validation errors
      const messages = Object.values(error.error.errors).flat();
      this.errorMessage = `Erreur de ${action}: ${messages.join(' ')}`;
    } else if (error.error?.message) {
      this.errorMessage = `Erreur de ${action}: ${error.error.message}`;
    } else {
      this.errorMessage = `Une erreur est survenue lors de la ${action} du département.`;
    }
    console.error(error);
  }
}

