import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment'; // Adjusted path
import { AuthService, LoginResponse, User } from '../../../../core/services/auth.service';

// Custom validator for password confirmation
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('password_confirmation');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};

interface Departement {
  id: number;
  nom: string; // Assuming your department object has at least id and nom
  // Add other properties if needed
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule], // HttpClientModule is not needed here for standalone with provideHttpClient
  template: `
    <div class="auth-wrapper">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <a routerLink="/" class="logo">E-<span class="text-accent">Vote</span></a>
            <h1>Créer un compte</h1>
            <p>Rejoignez le système électoral numérique de l'université</p>
          </div>
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-row">
              <div class="form-group">
                <label for="nom">Nom</label>
                <input 
                  type="text" 
                  id="nom" 
                  formControlName="nom" 
                  class="form-control" 
                  [class.is-invalid]="nom?.invalid && (nom?.dirty || nom?.touched)"
                  placeholder="Votre nom">
                <div *ngIf="nom?.invalid && (nom?.dirty || nom?.touched)" class="error-message">
                  <span *ngIf="nom?.errors?.['required']">Le nom est requis.</span>
                  <span *ngIf="nom?.errors?.['maxlength']">Le nom ne doit pas dépasser 255 caractères.</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="prenom">Prénom</label>
                <input 
                  type="text" 
                  id="prenom" 
                  formControlName="prenom" 
                  class="form-control" 
                  [class.is-invalid]="prenom?.invalid && (prenom?.dirty || prenom?.touched)"
                  placeholder="Votre prénom">
                <div *ngIf="prenom?.invalid && (prenom?.dirty || prenom?.touched)" class="error-message">
                  <span *ngIf="prenom?.errors?.['required']">Le prénom est requis.</span>
                  <span *ngIf="prenom?.errors?.['maxlength']">Le prénom ne doit pas dépasser 255 caractères.</span>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email universitaire</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                class="form-control" 
                [class.is-invalid]="email?.invalid && (email?.dirty || email?.touched)"
                placeholder="votre-email@universite.edu">
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="error-message">
                <span *ngIf="email?.errors?.['required']">L'email est requis.</span>
                <span *ngIf="email?.errors?.['email']">Veuillez saisir un email valide.</span>
                <span *ngIf="email?.errors?.['maxlength']">L'email ne doit pas dépasser 255 caractères.</span>
              </div>
            </div>

            <div class="form-group">
              <label for="telephone">Téléphone (Optionnel)</label>
              <input 
                type="tel" 
                id="telephone" 
                formControlName="telephone" 
                class="form-control"
                [class.is-invalid]="telephone?.invalid && (telephone?.dirty || telephone?.touched)"
                placeholder="Votre numéro de téléphone">
              <div *ngIf="telephone?.invalid && (telephone?.dirty || telephone?.touched)" class="error-message">
                  <span *ngIf="telephone?.errors?.['maxlength']">Le téléphone ne doit pas dépasser 20 caractères.</span>
              </div>
            </div>

            <div class="form-group">
                <label>Type de personnel</label>
                <div class="user-type-selector">
                    <div class="user-type-option">
                        <input 
                            type="radio" 
                            id="type-per" 
                            formControlName="type_personnel" 
                            value="PER"
                            (change)="onUserTypeChange()">
                        <label for="type-per">
                            <div class="option-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                            </div>
                            <div class="option-info">
                                <span class="option-title">Personnel Enseignant (PER)</span>
                                <span class="option-desc">Personnel Enseignant et de Recherche</span>
                            </div>
                        </label>
                    </div>
                    <div class="user-type-option">
                        <input 
                            type="radio" 
                            id="type-pats" 
                            formControlName="type_personnel" 
                            value="PATS"
                            (change)="onUserTypeChange()">
                        <label for="type-pats">
                            <div class="option-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div class="option-info">
                                <span class="option-title">Personnel Administratif (PATS)</span>
                                <span class="option-desc">Administratif, Technique et de Service</span>
                            </div>
                        </label>
                    </div>
                </div>
                 <div *ngIf="type_personnel?.invalid && (type_personnel?.dirty || type_personnel?.touched)" class="error-message">
                    <span *ngIf="type_personnel?.errors?.['required']">Le type de personnel est requis.</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="departement_id">Département</label>
              <div *ngIf="isLoadingDepartements" class="loading-message">Chargement des départements...</div>
              <select 
                *ngIf="!isLoadingDepartements"
                id="departement_id" 
                formControlName="departement_id" 
                class="form-control" 
                [class.is-invalid]="departement_id?.invalid && (departement_id?.dirty || departement_id?.touched)">
                <option [ngValue]="null" disabled>Sélectionnez votre département</option>
                <option *ngFor="let dept of departements" [value]="dept.id">{{ dept.nom }}</option>
              </select>
               <div *ngIf="departement_id?.invalid && (departement_id?.dirty || departement_id?.touched) && departement_id?.errors?.['required']" class="error-message">
                  Le département est requis pour le personnel enseignant.
              </div>
            </div>
            
            <div class="form-row">
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password" 
                  class="form-control" 
                  [class.is-invalid]="password?.invalid && (password?.dirty || password?.touched)"
                  placeholder="Choisissez un mot de passe">
                <button 
                  type="button" 
                  class="password-toggle" 
                  (click)="togglePasswordVisibility()">
                  <svg *ngIf="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <svg *ngIf="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                </button>
              </div>
              <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="error-message">
                  <span *ngIf="password?.errors?.['required']">Le mot de passe est requis.</span>
                  <span *ngIf="password?.errors?.['minlength']">Le mot de passe doit contenir au moins 8 caractères.</span>
                </div>
            </div>
            
            <div class="form-group">
                <label for="password_confirmation">Confirmer le mot de passe</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                    id="password_confirmation" 
                    formControlName="password_confirmation" 
                  class="form-control" 
                    [class.is-invalid]="(password_confirmation?.invalid && (password_confirmation?.dirty || password_confirmation?.touched)) || registerForm.errors?.['passwordMismatch'] && (password?.touched && password_confirmation?.touched)"
                  placeholder="Confirmez votre mot de passe">
              </div>
                <div *ngIf="(password_confirmation?.invalid && (password_confirmation?.dirty || password_confirmation?.touched)) || registerForm.errors?.['passwordMismatch'] && (password?.touched && password_confirmation?.touched)" class="error-message">
                  <span *ngIf="password_confirmation?.errors?.['required']">La confirmation du mot de passe est requise.</span>
                  <span *ngIf="registerForm.errors?.['passwordMismatch'] && !password_confirmation?.errors?.['required']">Les mots de passe ne correspondent pas.</span>
                </div>
              </div>
            </div>
            
            <div class="form-group terms-checkbox">
              <label class="checkbox-container">
                <input type="checkbox" formControlName="termsAccepted">
                <span class="checkmark"></span>
                J'accepte les <a href="#">termes et conditions</a> ainsi que la <a href="#">politique de confidentialité</a>
              </label>
              <div *ngIf="termsAccepted?.invalid && (termsAccepted?.dirty || termsAccepted?.touched)" class="error-message">
                <span *ngIf="termsAccepted?.errors?.['requiredTrue']">Vous devez accepter les termes et conditions.</span>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isSubmitting">
              <span *ngIf="isSubmitting" class="spinner"></span>
              <span *ngIf="!isSubmitting">Créer mon compte</span>
            </button>
          </form>
          
          <div class="auth-footer">
            <p>Vous avez déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 32px 16px;
    }
    
    .auth-container {
      width: 100%;
      max-width: 580px; /* Increased max-width for more fields */
      margin: auto;
    }
    
    .auth-card {
      background-color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
      padding: 40px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .logo {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      display: inline-block;
      margin-bottom: 24px;
    }
    
    .text-accent {
      color: var(--accent);
    }
    
    .auth-header h1 {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }
    
    .auth-header p {
      color: var(--gray-500);
    }
    
    .auth-form {
      margin-bottom: 24px;
    }
    
    .form-group {
      margin-bottom: 20px; /* Adjusted margin */
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--primary);
    }
    
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--gray-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: var(--transition);
      background-color: white; /* Ensure select background is white */
    }
    
    .form-control:focus {
      border-color: var(--secondary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.2);
    }
    
    .form-control.is-invalid {
      border-color: var(--error);
    }

    .form-control:disabled {
      background-color: var(--gray-100);
      cursor: not-allowed;
    }
    
    .error-message {
      color: var(--error);
      font-size: 0.85rem; /* Slightly smaller error messages */
      margin-top: 6px;
    }

    .loading-message {
      color: var(--gray-500);
      font-style: italic;
      margin-top: 8px;
    }
    
    .password-input-wrapper {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--gray-500);
      cursor: pointer;
    }
    
    .terms-checkbox {
      margin-top: 24px; /* Adjusted margin */
    }
    
    .checkbox-container {
      display: flex;
      align-items: flex-start; /* Align checkbox with text start */
      position: relative;
      padding-left: 30px; /* Adjusted padding */
      cursor: pointer;
      user-select: none;
      line-height: 1.4; /* Adjusted line height */
      font-size: 0.9rem; /* Smaller terms text */
    }
    
    .checkbox-container input {
      position: absolute;
      opacity: 0;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: absolute;
      left: 0;
      top: 2px; /* Align with text */
      height: 18px; /* Smaller checkmark */
      width: 18px;
      background-color: var(--gray-200);
      border-radius: 4px;
      transition: var(--transition);
    }
    
    .checkbox-container:hover input ~ .checkmark {
      background-color: var(--gray-300);
    }
    
    .checkbox-container input:checked ~ .checkmark {
      background-color: var(--secondary);
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
      display: block;
    }
    
    .checkbox-container .checkmark:after {
      left: 6px; /* Adjusted for smaller checkmark */
      top: 2px;  /* Adjusted for smaller checkmark */
      width: 5px;  /* Adjusted for smaller checkmark */
      height: 10px; /* Adjusted for smaller checkmark */
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .btn-block {
      display: block;
      width: 100%;
      padding: 12px;
      font-size: 1rem;
    }
    
    .auth-footer {
      text-align: center;
      color: var(--gray-500);
      margin-top: 32px; /* Added margin */
    }
    
    .auth-footer a {
      font-weight: 500;
      color: var(--secondary); /* Consistent link color */
    }
    
    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @media (max-width: 767px) {
      .auth-card {
        padding: 24px;
      }
      .form-row {
        grid-template-columns: 1fr;
        gap: 0; /* Remove gap for single column items */
      }
      .form-row .form-group { /* Ensure full width for items in form-row on mobile */
         margin-bottom: 20px;
      }
      .form-row .form-group:last-child {
         margin-bottom: 0; /* No bottom margin for the last item in a row on mobile */
      }
       .password-input-wrapper { /* Ensure password fields take full width in form-row on mobile */
        margin-bottom: 20px;
      }
       .password-input-wrapper:last-child {
        margin-bottom: 0;
      }
    }

    /* Styles for user type radio buttons */
    .user-type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .user-type-option input[type="radio"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .user-type-option label {
      display: flex;
      align-items: center;
      padding: 16px;
      border: 2px solid var(--gray-300);
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: var(--transition);
      margin-bottom: 0;
    }
    
    .user-type-option input[type="radio"]:checked + label {
      border-color: var(--secondary);
      background-color: rgba(63, 81, 181, 0.05);
    }
    
    .option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: var(--gray-200);
      border-radius: 50%;
      margin-right: 12px;
      color: var(--primary);
      transition: var(--transition);
      flex-shrink: 0;
    }
    
    .user-type-option input[type="radio"]:checked + label .option-icon {
      background-color: var(--secondary);
      color: white;
    }
    
    .option-info {
      display: flex;
      flex-direction: column;
    }
    
    .option-title {
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 2px;
      font-size: 0.95rem;
    }
    
    .option-desc {
      font-size: 0.8rem;
      color: var(--gray-500);
    }
    /* End of user type radio button styles */

    @media (max-width: 480px) {
        .user-type-option label {
            flex-direction: column;
            align-items: flex-start;
        }
        .option-icon {
            margin-bottom: 8px;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  
  departements: Departement[] = [];
  isLoadingDepartements = false;
  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      prenom: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      telephone: ['', Validators.maxLength(20)],
      type_personnel: ['PER', Validators.required], // PER or PATS
      departement_id: [{ value: null, disabled: false }],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadDepartements();
    this.onUserTypeChange(); 
  }

  loadDepartements(): void {
    this.isLoadingDepartements = true;
    this.http.get<Departement[]>(`${this.apiUrl}/departement`)
      .subscribe({
        next: (data) => {
          this.departements = data;
          this.isLoadingDepartements = false;
        },
        error: (err) => {
          console.error('Failed to load departements', err);
          this.isLoadingDepartements = false;
        }
      });
  }

  get nom() { return this.registerForm.get('nom'); }
  get prenom() { return this.registerForm.get('prenom'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get password_confirmation() { return this.registerForm.get('password_confirmation'); }
  get telephone() { return this.registerForm.get('telephone'); }
  get type_personnel() { return this.registerForm.get('type_personnel'); }
  get departement_id() { return this.registerForm.get('departement_id'); }
  get termsAccepted() { return this.registerForm.get('termsAccepted'); }
  
  onUserTypeChange() {
    const type = this.type_personnel?.value;
    const departmentControl = this.registerForm.get('departement_id');

    if (type === 'PER') {
      departmentControl?.enable();
    } else { // PATS
      departmentControl?.disable();
      departmentControl?.setValue(null); 
      departmentControl?.clearValidators(); 
    }
    departmentControl?.updateValueAndValidity();
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    const rawFormData = this.registerForm.getRawValue();

    const payload = {
      nom: rawFormData.nom,
      prenom: rawFormData.prenom,
      email: rawFormData.email,
      password: rawFormData.password,
      password_confirmation: rawFormData.password_confirmation,
      telephone: rawFormData.telephone || null,
      type_personnel: rawFormData.type_personnel,
      departement_id: rawFormData.type_personnel === 'PER' ? rawFormData.departement_id : null
    };

    console.log('Form submitted. Payload:', payload);
    this.http.post<LoginResponse>(`${this.apiUrl}/register`, payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          console.log('Registration successful', response);

          if (response && response.access_token) {
            this.authService.setToken(response.access_token);
            if (response.user) {
              this.authService.setCurrentUser(response.user);
            } else {
              this.authService.fetchUser().subscribe();
            }
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/auth/login'], { queryParams: { registrationSuccess: true, loginRequired: true } });
          }
        },
        error: (error) => {
      this.isSubmitting = false;
          console.error('Registration failed', error);
        }
      });
  }
}