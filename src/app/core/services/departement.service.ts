import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Departement {
  id: number;
  nom: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for API response when fetching multiple departements if needed (e.g., with pagination)
export interface DepartementsApiResponse {
  data: Departement[];
  // Add other pagination/meta fields if your API returns them
}

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = `${environment.apiUrl}/departements`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getDepartements(): Observable<Departement[]> {
    // Adjust if your API wraps the array in a 'data' property
    return this.http.get<Departement[]>(this.apiUrl, { headers: this.authService.getAuthHeaders() });
    // Example if wrapped: return this.http.get<DepartementsApiResponse>(this.apiUrl, { headers: this.authService.getAuthHeaders() }).pipe(map(response => response.data));
  }

  getDepartement(id: number): Observable<Departement> {
    return this.http.get<Departement>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  createDepartement(departementData: Partial<Departement>): Observable<Departement> {
    return this.http.post<Departement>(this.apiUrl, departementData, { headers: this.authService.getAuthHeaders() });
  }

  updateDepartement(id: number, departementData: Partial<Departement>): Observable<Departement> {
    return this.http.put<Departement>(`${this.apiUrl}/${id}`, departementData, { headers: this.authService.getAuthHeaders() });
  }

  deleteDepartement(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }
}
