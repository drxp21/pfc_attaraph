import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: '2fa-setup',
    loadComponent: () => import('./components/two-factor-setup/two-factor-setup.component').then(c => c.TwoFactorSetupComponent)
  },
  {
    path: '2fa-verify',
    loadComponent: () => import('./components/two-factor-verify/two-factor-verify.component').then(c => c.TwoFactorVerifyComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];