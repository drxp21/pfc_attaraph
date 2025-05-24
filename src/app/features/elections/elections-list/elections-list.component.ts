import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ElectionService, Election, TypeElection } from '../../../core/services/election.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatElectionType',
  standalone: true
})
export class FormatElectionTypePipe implements PipeTransform {
  transform(value: TypeElection): string {
    switch (value) {
      case 'CHEF_DEPARTEMENT':
        return 'Chef de Département';
      case 'DIRECTEUR_UFR':
        return 'Directeur UFR';
      case 'VICE_RECTEUR':
        return 'Vice-Recteur';
      default:
        return value;
    }
  }
}

@Component({
  selector: 'app-elections-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './elections-list.component.html',
  styleUrls: ['./elections-list.component.scss']
})
export class ElectionsListComponent implements OnInit {
  elections: Election[] = [];
  isLoading = false;
  searchTerm: string = '';
  filteredElections: Election[] = [];
  showCandidatesModal = false;
  selectedElection: Election | null = null;

  constructor(private electionService: ElectionService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadElections();
  }

  loadElections(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (data) => {
        this.elections = data;
        this.filteredElections = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des élections:', err);
        this.isLoading = false;
      }
    });
  }

  filterElections(): void {
    if (!this.searchTerm) {
      this.filteredElections = this.elections;
      return;
    }
    this.filteredElections = this.elections.filter(election =>
      election.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterByType(event: any) {
    const type = event.target.value;
    // Implémenter le filtrage par type
  }

  filterByStatus(event: any) {
    const status = event.target.value;
    // Implémenter le filtrage par statut
  }

  viewCandidates(election: Election) {
    this.selectedElection = election;
    this.showCandidatesModal = true;
  }

  closeModal() {
    this.showCandidatesModal = false;
    this.selectedElection = null;
  }
}