import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
  constructor(private http: HttpClient) {}

  // Récupérer les critères de validation pour un type d'élection
  async getValidationCriteria(electionType: string): Promise<ValidationCriteria> {
    return firstValueFrom(this.http.get<ValidationCriteria>(
      `${environment.apiUrl}/validation-criteria/${electionType}`
    ));
  }

  // Valider une candidature
  async validateCandidacy(candidateId: number, decision: 'approve' | 'reject', reason?: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(
      `${environment.apiUrl}/candidates/${candidateId}/validate`,
      { decision, reason }
    ));
  }

  // Vérifier l'éligibilité d'un utilisateur
  async checkEligibility(userId: string, electionType: string): Promise<{eligible: boolean, reason?: string}> {
    return firstValueFrom(this.http.get<{eligible: boolean, reason?: string}>(
      `${environment.apiUrl}/eligibility-check`,
      { params: { userId, electionType } }
    ));
  }
}