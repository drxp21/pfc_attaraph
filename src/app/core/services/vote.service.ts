import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

// Define interfaces for related data
export interface Candidat {
  id: number;
  nom: string;
  prenom: string;
}

export interface Candidature {
  id: number;
  candidat: Candidat;
  programme: string;
}

export interface Election {
  id: number;
  titre: string;
  type_election: string;
  date_debut_vote: string;
  date_fin_vote: string;
  statut: string;
}

// Define interface for Vote data
export interface Vote {
  id?: number;
  election_id: number;
  electeur_id?: number;
  candidature_id?: number | null;
  vote_blanc: boolean;
  date_vote?: string;
  // Include related data
  election?: Election;
  candidature?: Candidature;
}

export interface VoteResponse {
  message: string;
  vote: Vote;
}

@Injectable({
  providedIn: 'root'
})
export class VoteService {
  private apiUrl = `${environment.apiUrl}/votes`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Submit a vote
  submitVote(voteData: { election_id: number; candidature_id?: number | null; vote_blanc: boolean }): Observable<VoteResponse> { 
    return this.http.post<VoteResponse>(this.apiUrl, voteData, { headers: this.authService.getAuthHeaders() });
  }

  // Check if user has already voted in an election
  hasVoted(electionId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/has-voted/${electionId}`, { headers: this.authService.getAuthHeaders() });
  }

  // Get vote history for the current user
  getVoteHistory(): Observable<Vote[]> {
    return this.http.get<Vote[]>(`${this.apiUrl}/history`, { headers: this.authService.getAuthHeaders() });
  }

  // You might have a method to check if a user has voted in a specific election
  // This would typically be part of the Election object or User object from the backend
  // e.g., GET /elections/{id}/has_voted or as a property on the User/Election model.
  // For now, assuming this logic is handled by the backend and reflected in UI availability.
}



