import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface ElectionStats {
  totalVoters: number;
  participationRate: number;
  votesPerCandidate: {
    candidateId: string;
    candidateName: string;
    votes: number;
    percentage: number;
  }[];
  votingTrends: {
    date: string;
    votes: number;
  }[];
}

export interface GlobalStats {
  totalElections: number;
  totalVoters: number;
  averageParticipation: number;
  departmentStats: {
    department: string;
    participationRate: number;
    totalElections: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) {}

  async getElectionStats(electionId: string): Promise<ElectionStats> {
    return firstValueFrom(this.http.get<ElectionStats>(
      `${environment.apiUrl}/stats/elections/${electionId}`
    ));
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return firstValueFrom(this.http.get<GlobalStats>(
      `${environment.apiUrl}/stats/global`
    ));
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