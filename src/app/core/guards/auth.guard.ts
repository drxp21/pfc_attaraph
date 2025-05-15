import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isAuthenticated()) {
      // Vérifier si l'utilisateur nécessite une vérification 2FA
      const requires2FA = await this.authService.requires2FA$.pipe().toPromise();
      
      if (requires2FA) {
        await this.router.navigate(['/auth/2fa-verify']);
        return false;
      }
      
      return true;
    }

    await this.router.navigate(['/auth/login']);
    return false;
  }
}