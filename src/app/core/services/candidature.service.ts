import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  constructor(private http: HttpClient) {}

  submitCandidature(electionId: number, candidatureData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/elections/${electionId}/candidates`,
      candidatureData
    );
  }

  getCandidatureStatus(candidatureId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/candidates/${candidatureId}`
    );
  }

  // Pour l'admin
  validateCandidature(candidatureId: number, status: 'approved' | 'rejected', reason?: string): Observable<any> {
    return this.http.patch(
      `${environment.apiUrl}/candidates/${candidatureId}/validate`,
      { status, rejection_reason: reason }
    );
  }

  // Pour l'admin - Liste des candidatures à valider
  getPendingCandidatures(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/pending-candidatures`);
  }
}