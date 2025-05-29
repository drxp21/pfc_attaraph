import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private loginUrl = `${environment.apiUrl}/login`; // Define login URL

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);

    if (token && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if the error is 401 and if the request URL is NOT the login URL
        if (error.status === 401 && error.url !== this.loginUrl) {
          // Only logout if 401 is from a non-login API call
          this.authService.logout().subscribe({
            // Navigate to login or handle error, ensure this doesn't cause loops
            // The logout method in AuthService should ideally handle navigation
            error: (e) => console.error('Error during automatic logout on 401', e)
          });
        }
        // For 401 on login or any other error, just rethrow to be handled by the calling service/component
        return throwError(() => error);
      })
    );
  }
}