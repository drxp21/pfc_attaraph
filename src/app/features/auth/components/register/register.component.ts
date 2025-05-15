import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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
            <div class="user-type-selector">
              <div class="user-type-option">
                <input 
                  type="radio" 
                  id="user-per" 
                  formControlName="userType" 
                  value="per"
                  (change)="onUserTypeChange('per')">
                <label for="user-per">
                  <div class="option-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                  </div>
                  <div class="option-info">
                    <span class="option-title">Personnel Enseignant</span>
                    <span class="option-desc">PER - Personnel Enseignant et de Recherche</span>
                  </div>
                </label>
              </div>
              
              <div class="user-type-option">
                <input 
                  type="radio" 
                  id="user-pats" 
                  formControlName="userType" 
                  value="pats"
                  (change)="onUserTypeChange('pats')">
                <label for="user-pats">
                  <div class="option-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div class="option-info">
                    <span class="option-title">Personnel Administratif</span>
                    <span class="option-desc">PATS - Personnel Administratif, Technique et de Service</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Prénom</label>
                <input 
                  type="text" 
                  id="firstName" 
                  formControlName="firstName" 
                  class="form-control" 
                  [class.is-invalid]="firstName?.invalid && (firstName?.dirty || firstName?.touched)"
                  placeholder="Votre prénom">
                <div *ngIf="firstName?.invalid && (firstName?.dirty || firstName?.touched)" class="error-message">
                  <span *ngIf="firstName?.errors?.['required']">Le prénom est requis</span>
                </div>
              </div>
              
              <div class="form-group">
                <label for="lastName">Nom</label>
                <input 
                  type="text" 
                  id="lastName" 
                  formControlName="lastName" 
                  class="form-control" 
                  [class.is-invalid]="lastName?.invalid && (lastName?.dirty || lastName?.touched)"
                  placeholder="Votre nom">
                <div *ngIf="lastName?.invalid && (lastName?.dirty || lastName?.touched)" class="error-message">
                  <span *ngIf="lastName?.errors?.['required']">Le nom est requis</span>
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
                <span *ngIf="email?.errors?.['required']">L'email est requis</span>
                <span *ngIf="email?.errors?.['email']">Veuillez saisir un email valide</span>
              </div>
            </div>
            
            <div *ngIf="userTypeValue === 'per'" class="form-group">
              <label for="department">Département</label>
              <select 
                id="department" 
                formControlName="department" 
                class="form-control" 
                [class.is-invalid]="department?.invalid && (department?.dirty || department?.touched)">
                <option value="" disabled>Sélectionnez votre département</option>
                <option value="math">Mathématiques</option>
                <option value="physics">Physique</option>
                <option value="cs">Informatique</option>
                <option value="literature">Lettres et Langues</option>
                <option value="history">Histoire et Géographie</option>
                <option value="biology">Biologie</option>
                <option value="chemistry">Chimie</option>
              </select>
              <div *ngIf="department?.invalid && (department?.dirty || department?.touched)" class="error-message">
                <span *ngIf="department?.errors?.['required']">Le département est requis</span>
              </div>
            </div>
            
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
                <span *ngIf="password?.errors?.['required']">Le mot de passe est requis</span>
                <span *ngIf="password?.errors?.['minlength']">Le mot de passe doit contenir au moins 6 caractères</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <div class="password-input-wrapper">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  formControlName="confirmPassword" 
                  class="form-control" 
                  [class.is-invalid]="confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched) || passwordMismatch"
                  placeholder="Confirmez votre mot de passe">
              </div>
              <div *ngIf="(confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)) || passwordMismatch" class="error-message">
                <span *ngIf="confirmPassword?.errors?.['required']">La confirmation du mot de passe est requise</span>
                <span *ngIf="passwordMismatch && !confirmPassword?.errors?.['required']">Les mots de passe ne correspondent pas</span>
              </div>
            </div>
            
            <div class="form-group terms-checkbox">
              <label class="checkbox-container">
                <input type="checkbox" formControlName="termsAccepted">
                <span class="checkmark"></span>
                J'accepte les <a href="#">termes et conditions</a> ainsi que la <a href="#">politique de confidentialité</a>
              </label>
              <div *ngIf="termsAccepted?.invalid && (termsAccepted?.dirty || termsAccepted?.touched)" class="error-message">
                <span *ngIf="termsAccepted?.errors?.['required']">Vous devez accepter les termes et conditions</span>
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isSubmitting || passwordMismatch">
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
      max-width: 580px;
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
      margin-bottom: 24px;
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
    }
    
    .form-control:focus {
      border-color: var(--secondary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.2);
    }
    
    .form-control.is-invalid {
      border-color: var(--error);
    }
    
    .error-message {
      color: var(--error);
      font-size: 0.9rem;
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
    
    .user-type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
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
    }
    
    .user-type-option input[type="radio"]:checked + label {
      border-color: var(--secondary);
      background-color: rgba(63, 81, 181, 0.05);
    }
    
    .option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background-color: var(--gray-200);
      border-radius: 50%;
      margin-right: 16px;
      color: var(--primary);
      transition: var(--transition);
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
      margin-bottom: 4px;
    }
    
    .option-desc {
      font-size: 0.85rem;
      color: var(--gray-500);
    }
    
    .terms-checkbox {
      margin-top: 32px;
    }
    
    .checkbox-container {
      display: flex;
      align-items: flex-start;
      position: relative;
      padding-left: 32px;
      cursor: pointer;
      user-select: none;
      line-height: 1.5;
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
      top: 2px;
      height: 20px;
      width: 20px;
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
      left: 7px;
      top: 3px;
      width: 6px;
      height: 12px;
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
    }
    
    .auth-footer a {
      font-weight: 500;
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
      
      .user-type-selector {
        grid-template-columns: 1fr;
      }
      
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  passwordMismatch = false;
  
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      userType: ['per', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    });
    
    this.registerForm.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }
  
  get userTypeValue() { return this.registerForm.get('userType')?.value; }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get department() { return this.registerForm.get('department'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get termsAccepted() { return this.registerForm.get('termsAccepted'); }
  
  onUserTypeChange(userType: string) {
    if (userType === 'pats') {
      this.registerForm.get('department')?.clearValidators();
      this.registerForm.get('department')?.updateValueAndValidity();
    } else {
      this.registerForm.get('department')?.setValidators(Validators.required);
      this.registerForm.get('department')?.updateValueAndValidity();
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  checkPasswordMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    
    if (password && confirmPassword) {
      this.passwordMismatch = password !== confirmPassword;
    } else {
      this.passwordMismatch = false;
    }
  }
  
  onSubmit() {
    if (this.registerForm.invalid || this.passwordMismatch) return;
    
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      // Handle registration response here
      console.log('Form submitted', this.registerForm.value);
    }, 1500);
  }
}