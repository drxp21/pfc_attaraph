import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private requires2FASubject = new BehaviorSubject<boolean>(false);
  
  user$ = this.userSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  requires2FA$ = this.requires2FASubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.tokenSubject.next(token);
      this.loadUser();
    }
  }

  async signIn(email: string, password: string): Promise<{requires2FA: boolean}> {
    try {
      // Get CSRF cookie from Laravel Sanctum
      await this.http.get(environment.sanctumUrl).toPromise();
      
      const response = await this.http.post<{token: string, user: User, requires2FA: boolean}>(
        `${environment.apiUrl}/auth/login`,
        { email, password }
      ).toPromise();

      if (response?.token) {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
        this.userSubject.next(response.user);
        this.requires2FASubject.next(response.requires2FA);
        return { requires2FA: response.requires2FA };
      }
      
      throw new Error('Échec de la connexion');
    } catch (error: any) {
      if (error.status === 422) {
        throw new Error('Email ou mot de passe incorrect');
      }
      throw new Error('Une erreur est survenue lors de la connexion');
    }
  }

  async signUp(userData: any): Promise<User> {
    try {
      await this.http.get(environment.sanctumUrl).toPromise();
      
      const response = await this.http.post<{token: string, user: User}>(
        `${environment.apiUrl}/auth/register`,
        userData
      ).toPromise();

      if (response?.token) {
        localStorage.setItem('token', response.token);
        this.tokenSubject.next(response.token);
        this.userSubject.next(response.user);
        return response.user;
      }

      throw new Error('Échec de l\'inscription');
    } catch (error: any) {
      if (error.status === 422) {
        throw new Error('Données d\'inscription invalides');
      }
      throw new Error('Une erreur est survenue lors de l\'inscription');
    }
  }

  async signOut() {
    try {
      await this.http.post(`${environment.apiUrl}/auth/logout`, {}).toPromise();
      localStorage.removeItem('token');
      this.tokenSubject.next(null);
      this.userSubject.next(null);
      this.requires2FASubject.next(false);
      await this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  }

  private async loadUser() {
    try {
      const user = await this.http.get<User>(`${environment.apiUrl}/auth/user`).toPromise();
      if (user) {
        this.userSubject.next(user);
      }
    } catch (error) {
      console.error('Erreur de chargement utilisateur:', error);
      this.signOut();
    }
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }
}