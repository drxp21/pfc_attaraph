import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ElectionService, Election } from '../../../../core/services/election.service';
import { ElectionResultsData, ElectionResultItem } from '../../../../core/models/election-results.model';
import { FormatElectionTypePipe } from '../../../elections/elections-list/elections-list.component'; // Assuming this pipe is reusable

@Component({
  selector: 'app-election-results',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe, FormatElectionTypePipe],
  templateUrl: './election-results.component.html',
  styleUrls: ['./election-results.component.css']
})
export class ElectionResultsComponent implements OnInit {
  electionId: number | null = null;
  electionResults: ElectionResultsData | null = null;
  electionDetails: Election | null = null; // To store basic election info like title
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.electionId = +id;
        this.loadElectionDetails();
        this.loadResults();
      } else {
        this.errorMessage = 'ID de l\'élection non trouvé.';
        this.isLoading = false;
      }
    });
  }

  loadElectionDetails(): void {
    if (this.electionId) {
      this.electionService.getElection(this.electionId).subscribe({
        next: (election) => {
          this.electionDetails = election;
        },
        error: (err) => {
          console.error('Error loading election details:', err);
          // Potentially set a less critical error message for details
        }
      });
    }
  }

  loadResults(): void {
    if (this.electionId) {
      this.isLoading = true;
      this.errorMessage = null;
      this.electionService.getElectionResults(this.electionId).subscribe({
        next: (data) => {
          this.electionResults = data;
          // Sort results by rank, then by number of votes if ranks are equal
          this.electionResults.resultats.sort((a, b) => {
            if (a.rang !== b.rang) {
              return a.rang - b.rang;
            }
            return b.nb_voix - a.nb_voix; // Higher votes first for same rank
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading election results:', err);
          this.errorMessage = 'Erreur lors du chargement des résultats. Veuillez réessayer plus tard.';
          if (err.status === 404) {
            this.errorMessage = 'Résultats non trouvés pour cette élection.';
          }
          this.isLoading = false;
        }
      });
    }
  }

  getWinner(): ElectionResultItem | undefined {
    return this.electionResults?.resultats.find(r => r.rang === 1);
  }

  goBack(): void {
    // Navigate back to the main elections list or a specific dashboard page
    // Assuming the dashboard is one level up from '../election/:id/results'
    this.router.navigate(['../'], { relativeTo: this.route });
  }
} 