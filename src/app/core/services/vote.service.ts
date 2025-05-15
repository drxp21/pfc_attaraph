import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Vote {
  id: number;
  electionId: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'rejected';
}
@Injectable({
  providedIn: 'root'
})
export class VoteService {
  constructor(private http: HttpClient) {}

  // Vérifier l'éligibilité pour voter
  checkVoteEligibility(electionId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/elections/${electionId}/check-eligibility`
    );
  }

  // Soumettre un vote (l'anonymat est géré côté backend)
  submitVote(electionId: number, candidateId: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/elections/${electionId}/vote`,
      { candidate_id: candidateId }
    );
  }

  // Vérifier si l'utilisateur a déjà voté
  hasVoted(electionId: number): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/elections/${electionId}/has-voted`
    );
  }
};



