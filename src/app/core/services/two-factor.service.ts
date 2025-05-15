import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwoFactorService {
  constructor(private http: HttpClient) {}

  // Générer un secret unique pour l'utilisateur
  async generateSecret(): Promise<string> {
    const response = await this.http.post<{secret: string}>(
      `${environment.apiUrl}/auth/2fa/generate`,
      {}
    ).toPromise();
    
    return response?.secret || '';
  }

  // Générer un QR code pour l'application d'authentification
  async generateQRCode(email: string): Promise<string> {
    const response = await this.http.post<{qrCode: string}>(
      `${environment.apiUrl}/auth/2fa/qr-code`,
      { email }
    ).toPromise();
    
    return response?.qrCode || '';
  }

  // Vérifier le code 2FA
  async verifyToken(token: string): Promise<boolean> {
    const response = await this.http.post<{valid: boolean}>(
      `${environment.apiUrl}/auth/2fa/verify`,
      { token }
    ).toPromise();
    
    return response?.valid || false;
  }

  // Activer le 2FA pour un utilisateur
  async enable2FA(): Promise<void> {
    await this.http.post(
      `${environment.apiUrl}/auth/2fa/enable`,
      {}
    ).toPromise();
  }

  // Vérifier si le 2FA est activé pour un utilisateur
  async is2FAEnabled(): Promise<boolean> {
    const response = await this.http.get<{enabled: boolean}>(
      `${environment.apiUrl}/auth/2fa/status`
    ).toPromise();
    
    return response?.enabled || false;
  }

  // Désactiver le 2FA pour un utilisateur
  async disable2FA(): Promise<void> {
    await this.http.post(
      `${environment.apiUrl}/auth/2fa/disable`,
      {}
    ).toPromise();
  }
}