import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface ElectionStats {
  totalVoters: number;
  participationRate: number;
  blankVotes: number;
  blankVotePercentage: number;
  votesPerCandidate: {
    candidateId: string;
    candidateName: string;
    votes: number;
    percentage: number;
  }[];
  votingTrends: {
    date: string;
    votes: number;
    blankVotes: number;
  }[];
}

export interface GlobalStats {
  totalElections: number;
  totalVoters: number;
  averageParticipation: number;
  totalBlankVotes: number;
  averageBlankVoteRate: number;
  departmentStats: {
    department: string;
    participationRate: number;
    blankVoteRate: number;
    totalElections: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) { }

  async getElectionStats(electionId: number): Promise<ElectionStats> {
    return firstValueFrom(
      this.http.get<ElectionStats>(`${this.apiUrl}/elections/${electionId}`)
    );
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return firstValueFrom(
      this.http.get<GlobalStats>(`${this.apiUrl}/global`)
    );
  }

  async getDepartmentStats(departmentId: number): Promise<GlobalStats> {
    return firstValueFrom(
      this.http.get<GlobalStats>(`${this.apiUrl}/departments/${departmentId}`)
    );
  }

  async generateReport(electionId: string, format: 'pdf' | 'csv'): Promise<Blob> {
    return firstValueFrom(this.http.get(
      `${environment.apiUrl}/stats/elections/${electionId}/report?format=${format}`,
      { responseType: 'blob' }
    ));
  }

  async getParticipationTrends(period: 'day' | 'week' | 'month'): Promise<any> {
    return firstValueFrom(this.http.get(
      `${environment.apiUrl}/stats/trends?period=${period}`
    ));
  }
}