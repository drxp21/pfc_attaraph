import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>E-<span class="text-accent">Vote</span></h1>
            <p>Connectez-vous pour accéder au système électoral</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email">Email universitaire</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                class="form-control" 
                [class.is-invalid]="email?.invalid && (email?.dirty || email?.touched)"
                placeholder="nom.prenom@univ.edu">
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="error-message">
                <span *ngIf="email?.errors?.['required']">L'email est requis</span>
                <span *ngIf="email?.errors?.['email']">Veuillez saisir un email valide</span>
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
                  placeholder="Votre mot de passe">
                <button 
                  type="button" 
                  class="password-toggle" 
                  (click)="togglePasswordVisibility()">
                  <span class="password-toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
                </button>
              </div>
              <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="error-message">
                <span *ngIf="password?.errors?.['required']">Le mot de passe est requis</span>
              </div>
            </div>

            <div *ngIf="loginError" class="alert alert-error">
              {{ loginError }}
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || isSubmitting">
              <span *ngIf="isSubmitting" class="spinner"></span>
              <span *ngIf="!isSubmitting">Se connecter</span>
            </button>
            
            <div class="auth-links">
              <a routerLink="/auth/forgot-password">Mot de passe oublié ?</a>
              <a routerLink="/auth/register">Créer un compte</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 20px;
    }
    
    .auth-container {
      width: 100%;
      max-width: 400px;
    }
    
    .auth-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 32px;
      box-shadow: var(--shadow-md);
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .auth-header h1 {
      font-size: 2rem;
      color: var(--primary);
      margin-bottom: 8px;
    }
    
    .text-accent {
      color: var(--accent);
    }
    
    .auth-header p {
      color: var(--gray-500);
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-weight: 500;
      color: var(--primary);
    }
    
    .form-control {
      padding: 12px;
      border: 1px solid var(--gray-300);
      border-radius: var(--border-radius);
      font-size: 1rem;
      transition: var(--transition);
    }
    
    .form-control:focus {
      border-color: var(--secondary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
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
      padding: 0;
    }
    
    .password-toggle-icon {
      font-size: 1.2rem;
    }
    
    .btn-block {
      width: 100%;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .auth-links {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    
    .error-message {
      color: var(--error);
      font-size: 0.85rem;
    }
    
    .alert {
      padding: 12px;
      border-radius: var(--border-radius);
      font-size: 0.9rem;
    }
    
    .alert-error {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error);
      border: 1px solid rgba(244, 67, 54, 0.2);
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  loginError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (response) => {
        // AuthService.login now ensures fetchUser is complete and currentUser$ is updated.
        // So, if we reach here, login was successful, token is set, and user is fetched.
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.loginError = error.error?.message || error.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}