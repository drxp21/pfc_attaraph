import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Document { // Assuming a simple Document interface
  id: number;
  name: string;
  url: string; // Or path, depending on how you handle file access
}

export interface Candidature {
  id: number;
  election_id: number;
  candidat_id: number; // Assuming numeric ID, adjust if string
  programme: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE' | 'RETIREE'; // Based on typical statuses
  date_soumission: string | Date;
  documents: Document[];

  // Fields likely populated by backend joins for display purposes
  candidateName?: string; // e.g., from User model linked by candidat_id
  position?: string;      // e.g., from User model
  electionTitle?: string; // e.g., from Election model linked by election_id
  // Add other relevant fields from your API response
}
import { firstValueFrom } from 'rxjs';

export interface ValidationCriteria {
  id: number;
  electionType: string;
  minimumExperience: number;
  requiredDocuments: string[];
  additionalRequirements: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Récupérer les critères de validation pour un type d'élection
  async getValidationCriteria(electionType: string): Promise<ValidationCriteria> {
    return firstValueFrom(this.http.get<ValidationCriteria>(
      `${this.apiUrl}/validation-criteria/${electionType}`
    ));
  }

  // Valider une candidature
  async validateCandidacy(candidateId: number, decision: 'approve' | 'reject', reason?: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(
      `${this.apiUrl}/candidatures/${candidateId}/valider`,
      { decision, reason }
    ));
  }

  // Vérifier l'éligibilité d'un utilisateur
  async checkEligibility(userId: string, electionType: string): Promise<{eligible: boolean, reason?: string}> {
    return firstValueFrom(this.http.get<{eligible: boolean, reason?: string}>(
      `${this.apiUrl}/eligibility-check`,
      { params: { userId, electionType } }
    ));
  }

  // Récupérer les candidatures en attente de validation
  async getPendingCandidatures(electionId: number): Promise<Candidature[]> {
    // TODO: Adjust endpoint if it's different, e.g., /api/candidatures?status=pending or a specific admin route
    const params = new HttpParams()
      .set('election_id', electionId.toString())
      .set('statut', 'EN_ATTENTE');
    return firstValueFrom(this.http.get<Candidature[]>(`${this.apiUrl}/candidatures`, { params }));
  }
}