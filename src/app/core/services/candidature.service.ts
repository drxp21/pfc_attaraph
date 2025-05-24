import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Candidate } from './election.service'; // Assuming Candidate interface is exported from election.service
import { AuthService, User } from './auth.service';
import { Election } from './election.service'; // For fetching available elections

// Interface for the main Candidature object based on backend fields
export interface Candidature {
  id: number; // Typically assigned by the backend
  election_id: number;
  candidat_id: number;
  programme: string;
  statut: 'SOUMISE' | 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE' | 'RETIREE'; // Extend as needed
  commentaire_admin?: string | null;
  date_soumission: string; // ISO date string
  date_validation?: string | null; // ISO date string
  validee_par?: number | null; // Admin user ID
  created_at?: string;
  updated_at?: string;

  // Optional: For display purposes, these might be populated by backend joins
  election?: Partial<Election>; // Details of the election
  candidat?: Partial<User>;     // Details of the candidate (user)
  valideur?: Partial<User>;    // Details of the admin who validated
}

// Interface for the payload when creating a new candidature
// Only fields the user provides or are contextually set
export interface NewCandidaturePayload {
  election_id: number;
  // candidat_id is usually taken from the authenticated user on the backend
  programme: string;
  // statut is usually set by the backend initially
  // Documents might be handled separately or as part of this payload if backend supports it
}

// Interface for displaying user's candidatures (might be slightly different)
export interface MyCandidatureDisplay extends Candidature {
  electionTitre?: string; // Convenience for display
  // any other display-specific transformations
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = `${environment.apiUrl}/candidatures`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get elections open for new candidatures
  getAvailableElectionsForCandidature(): Observable<Election[]> {
    // This endpoint might be different, e.g., /elections/available-for-candidature
    // Or it might be all elections with a certain status, filtered client-side or backend-side.
    // For now, assuming a generic endpoint on ElectionService or a dedicated one here.
    // This is a placeholder; you'll need to implement the actual API call.
    // return this.http.get<Election[]>(`${environment.apiUrl}/elections?statut=OUVERTE_CANDIDATURES`, { headers: this.authService.getAuthHeaders() });
    console.warn('getAvailableElectionsForCandidature() needs a real API endpoint.');
    return new Observable<Election[]>(observer => observer.next([])); // Placeholder
  }

  // Submit a new candidature
  submitCandidature(payload: NewCandidaturePayload): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, payload, { headers: this.authService.getAuthHeaders() });
  }

  // Get all candidatures submitted by the current user
  getMyCandidatures(): Observable<MyCandidatureDisplay[]> {
    // The backend should ensure this only returns candidatures for the authenticated user.
    return this.http.get<MyCandidatureDisplay[]>(`${environment.apiUrl}/owncandidatures`, { headers: this.authService.getAuthHeaders() });
    // Or if it's a general endpoint that needs user ID:
    // const userId = this.authService.currentUserValue?.id;
    // if (!userId) return new Observable(observer => observer.error('User not authenticated'));
    // return this.http.get<MyCandidatureDisplay[]>(`${this.apiUrl}?candidat_id=${userId}`, { headers: this.authService.getAuthHeaders() });
  }

  // Get all candidatures, possibly with query params for filtering by election_id
  getCandidatures(electionId?: number): Observable<Candidature[]> {
    let url = this.apiUrl;
    if (electionId) {
      // Assuming your Laravel API supports filtering like /candidatures?election_id=X
      // Adjust if your API expects a different filtering mechanism (e.g., /elections/X/candidatures)
      url = `${this.apiUrl}?election_id=${electionId}`;
    }
    return this.http.get<Candidature[]>(url, { headers: this.authService.getAuthHeaders() });
  }

  // Get a specific candidature by its ID
  getCandidature(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  }

  // PER applies for a candidature
  applyForCandidature(candidatureData: { election_id: number; motivation?: string /* add other required fields */ }): Observable<Candidature> {
    return this.http.post<Candidature>(this.apiUrl, candidatureData, { headers: this.authService.getAuthHeaders() });
  }

  // ADMIN validates a candidature
  validateCandidature(id: number, statut: 'VALIDEE' | 'REJETEE', commentaire_admin?: string): Observable<{message: string, candidature: Candidature}> {
    return this.http.post<{message: string, candidature: Candidature}>(
      `${this.apiUrl}/${id}/valider`,
      { statut, commentaire_admin },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // ADMIN invalidates/retires a candidature
  retireCandidature(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/retirer`, {}, { headers: this.authService.getAuthHeaders() });
  }
  
  // ADMIN can also update a candidature if needed (e.g. correcting details, not status changes which have specific routes)
  // updateCandidature(id: number, data: Partial<Candidature>): Observable<Candidature> {
  //   return this.http.put<Candidature>(`${this.apiUrl}/${id}`, data, { headers: this.authService.getAuthHeaders() });
  // }

  // ADMIN can delete a candidature record if necessary (less common for audit trails)
  // deleteCandidature(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authService.getAuthHeaders() });
  // }

  // submitCandidature(candidatureData: Partial<Candidate>): Observable<Candidate> { // electionId is now part of candidatureData
  //   // Ensure candidatureData contains election_id, or handle error
  //   if (!candidatureData.electionId) {
  //     return new Observable(observer => observer.error('electionId is required in candidatureData'));
  //   }
  //   return this.http.post<Candidate>(
  //     `${environment.apiUrl}/candidatures`,
  //     candidatureData
  //   );
  // }

  getCandidatureStatus(candidatureId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/candidatures/${candidatureId}`
    );
  }

  // Pour l'admin - Liste des candidatures à valider
  getPendingCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${environment.apiUrl}/pendingcandidatures`, { headers: this.authService.getAuthHeaders() });
  }
}