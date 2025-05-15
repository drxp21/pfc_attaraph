import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Election {
  id: number;
  type: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'upcoming'; // Ajout de 'upcoming'
  department?: string;
  candidates: Candidate[];
  voters: string;        // Ajout explicitement
  quorum: number;        // Ajout explicitement
  majorityType: string;  // Ajout explicitement
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
  constructor(private http: HttpClient) {}

  // Récupérer toutes les élections
  getElections(): Observable<Election[]> {
    return this.http.get<Election[]>(`${environment.apiUrl}/elections`);
  }

  // Créer une nouvelle élection
  createElection(electionData: Partial<Election>): Observable<Election> {
    return this.http.post<Election>(`${environment.apiUrl}/elections`, electionData);
  }

  // Mettre à jour une élection
  updateElection(id: number, electionData: Partial<Election>): Observable<Election> {
    return this.http.put<Election>(`${environment.apiUrl}/elections/${id}`, electionData);
  }

  // Supprimer une élection
  deleteElection(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/elections/${id}`);
  }

  // Soumettre une candidature
  submitCandidacy(electionId: number, candidateData: Partial<Candidate>): Observable<Candidate> {
    return this.http.post<Candidate>(
      `${environment.apiUrl}/elections/${electionId}/candidates`,
      candidateData
    );
  }

  // Voter pour un candidat
  vote(electionId: number, candidateId: number): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/elections/${electionId}/vote`,
      { candidateId }
    );
  }

  // Récupérer les résultats d'une élection
  getResults(electionId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/elections/${electionId}/results`);
  }
}