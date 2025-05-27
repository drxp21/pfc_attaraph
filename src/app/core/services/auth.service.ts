import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, of, catchError, finalize, switchMap, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  type_personnel: 'ADMIN' | 'PER' | 'PATS';
  telephone?: string | null;
  departement_id?: number | null;
  departement?: {
    id: number;
    nom: string;
    code: string;
  } | null;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  access_token: string;
  user?: User;
  token_type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  private tokenKey = 'authToken';
  private initialized = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (!token) {
      this.isLoadingSubject.next(false);
      return;
    }

    this.fetchUser().pipe(
      catchError(() => {
        this.clearTokenAndNavigateToLogin();
        return of(null);
      }),
      finalize(() => {
        this.isLoadingSubject.next(false);
        this.initialized = true;
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.currentUserSubject.next(user);
        }
      }
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  public setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.initialized = !!user;
    this.isLoadingSubject.next(false);
  }
  
  private clearTokenAndNavigateToLogin(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    this.isLoadingSubject.next(true);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      switchMap(response => {
        if (response && response.access_token) {
          this.setToken(response.access_token);
          return this.fetchUser().pipe(
            map(user => {
              if (!user) {
                throw new Error('Failed to fetch user after login.');
              }
              return response;
            })
          );
        } else {
          this.currentUserSubject.next(null);
          this.initialized = false;
          this.isLoadingSubject.next(false);
          return throwError(() => new Error('Login failed: No access token received.'));
        }
      }),
      catchError(err => {
        this.clearToken();
        this.currentUserSubject.next(null);
        this.initialized = false;
        this.isLoadingSubject.next(false);
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        this.clearTokenAndNavigateToLogin();
      })
    );
  }

  fetchUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      this.currentUserSubject.next(null);
      this.initialized = false;
      this.isLoadingSubject.next(false);
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user`, { headers }).pipe(
      tap(user => {
        this.currentUserSubject.next(user.user);
        this.initialized = true;
        this.isLoadingSubject.next(false);
      }),
      catchError(error => {
        this.clearToken();
        this.currentUserSubject.next(null);
        this.initialized = false;
        this.isLoadingSubject.next(false);
        return of(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && (this.initialized || this.isLoadingSubject.value);
  }

  getUserRole(): 'ADMIN' | 'PER' | 'PATS' | null {
    return this.currentUserValue ? this.currentUserValue.type_personnel : null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }
}