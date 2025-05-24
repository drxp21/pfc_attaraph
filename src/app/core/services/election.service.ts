import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { AuthService, User as AuthUser } from './auth.service'; // For getting auth headers, aliasing User to avoid conflict
import { Candidature } from './candidature.service';

export type TypeElection = 'CHEF_DEPARTEMENT' | 'DIRECTEUR_UFR' | 'VICE_RECTEUR';

// Interface for the nested departement object in Election
export interface ElectionDepartement {
  id: number;
  nom: string;
  code: string;
  // Add other departement fields if necessary
}

export interface Election {
  id: number;
  titre: string;
  description: string;
  type_election: TypeElection;
  departement_id?: number;
  date_debut_candidature: string;
  date_fin_candidature: string;
  date_debut_vote: string;
  date_fin_vote: string;
  statut: 'BROUILLON'| 'OUVERTE'| 'EN_COURS'| 'FERMEE';
  created_by?: AuthUser; // Added created_by from backend response
  departement?: ElectionDepartement | null; // Added departement object from backend response
  // Optional fields from original interface, review if still needed or if covered by backend response
  candidatures?: Candidature[];
  voters?: string;
  quorum?: number;
  majorityType?: string;
  currentUserHasVoted?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface for the API response structure when fetching multiple elections
export interface ElectionsApiResponse {
  data: Election[];
  // Add other pagination/meta fields if your API returns them
}

export interface Candidate {
  id: number;
  userId: number;
  electionId: number;
  name: string;
  position: string;
  program: string;
  status: 'pending' | 'approved' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  private apiUrl = `${environment.apiUrl}/elections`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getElections(): Observable<Election[]> {
    return this.http.get<ElectionsApiResponse>(this.apiUrl, { headers: this.authService.getAuthHeaders() }).pipe(
      map(response => response.data) // Extract the data array
    );
  }

  getElection(id: number): Observable<Election> {
    // Assuming single election fetch might also be wrapped in 'data' or might be direct
    // If it's direct, this is fine. If wrapped, add .pipe(map(res => res.data))
    return this.http.get<Election>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  createElection(election: Partial<Election>): Observable<Election> {
    return this.http.post<Election>(this.apiUrl, election, { headers: this.authService.getAuthHeaders() });
  }

  updateElection(id: number, election: Partial<Election>): Observable<Election> {
    return this.http.put<Election>(`${this.apiUrl}/${id}`, election, { headers: this.authService.getAuthHeaders() });
  }

  deleteElection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  openElection(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/ouvrir`, {}, { headers: this.authService.getAuthHeaders() });
  }

  closeElection(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/fermer`, {}, { headers: this.authService.getAuthHeaders() });
  }

  getElectionResults(electionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${electionId}/resultats`, { headers: this.authService.getAuthHeaders() });
  }

  calculateResults(electionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${electionId}/calculer-resultats`, {}, { headers: this.authService.getAuthHeaders() });
  }

  generatePV(electionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${electionId}/generer-pv`, {}, { headers: this.authService.getAuthHeaders() });
  }
}