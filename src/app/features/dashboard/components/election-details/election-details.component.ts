import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ElectionService, Election } from '../../../../core/services/election.service';
import { VoteService } from '../../../../core/services/vote.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
// Assuming AuthService is available for role checking
// import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-election-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="election-details-container">
    <div class="admin-actions mt-4 pt-3 border-top" *ngIf="isAdmin && election?.statut === 'EN_COURS'">
     <h4>Actions Administrateur</h4>
     <button class="btn btn-danger" (click)="closeAndCalculateElection()">
       Fermer l'élection
     </button>
      <div *ngIf="actionMessage" class="alert mt-2" [ngClass]="actionMessageType === 'success' ? 'alert-success' : 'alert-danger'">
       {{ actionMessage }}
     </div>
   </div>
      <div *ngIf="election" class="election-card">
        <div class="election-header">
          <h2>{{ election.titre }}</h2>
          <span class="badge" [ngClass]="{
            'bg-success': election.statut === 'EN_COURS',
            'bg-warning': election.statut === 'BROUILLON',
            'bg-secondary': election.statut === 'FERMEE'
          }">
            {{ election.statut === 'EN_COURS' ? 'En cours' : election.statut === 'BROUILLON' ? 'À venir' : election.statut === 'OUVERTE' ? 'Ouverte' : election.statut === 'FERMEE' ? 'Fermée' : 'Terminée'                }}
               
          </span>
        </div>

        <div class="election-meta">
          <div class="meta-item">
            <span class="meta-label">Date de début:</span>
            <span class="meta-value">{{ election.date_debut_vote | date:'medium' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Date de fin:</span>
            <span class="meta-value">{{ election.date_fin_vote | date:'medium' }}</span>
          </div>
        </div>

        <div class="election-description">
          <h3>Description</h3>
          <p>{{ election.description || 'Aucune description disponible.' }}</p>
        </div>

        <div class="candidates-section" *ngIf="election.candidatures && election.candidatures.length > 0">
          <h3>Candidats</h3>
          <div class="candidates-grid">
            <div *ngFor="let candidature of election.candidatures" class="candidate-card" 
                 (click)="selectCandidate(candidature)" 
                 [class.selected]="selectedCandidate?.id === candidature.id">
              <div class="candidate-avatar">
                {{ candidature.candidat?.prenom?.charAt(0) || '?' }}{{ candidature.candidat?.nom?.charAt(0) || '?' }}
              </div>
              <div class="candidate-info">
                <h4>{{ candidature.candidat?.prenom }} {{ candidature.candidat?.nom }}</h4>
                <p *ngIf="candidature.programme">{{ candidature.programme | slice:0:100 }}...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Actions Section -->
     

        <div class="vote-actions" *ngIf="election.statut === 'EN_COURS' && !hasVoted && !isAdmin">
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="blankVote" [(ngModel)]="isBlankVote" (change)="onBlankVoteChange()">
            <label class="form-check-label" for="blankVote">
              Voter blanc (ne pas choisir de candidat)
            </label>
          </div>
          
          <button class="btn btn-primary" (click)="submitVote()" [disabled]="!canVote()">
            {{ isSubmitting ? 'Envoi en cours...' : 'Confirmer mon vote' }}
          </button>
          <div *ngIf="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>
        </div>

        <div *ngIf="hasVoted && !isAdmin" class="alert alert-success">
          Vous avez voté pour cette élection. Merci pour votre participation !
        </div>
      </div>

      <div *ngIf="!election && !isLoading" class="alert alert-warning">
        Impossible de charger les détails de l'élection.
      </div>
    </div>
  `,
  styles: [`/* Election Management Component Styles */

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px 0;
  border-bottom: 1px solid var(--gray-200);
}

.header-content h2 {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 8px;
  font-weight: 600;
}

.header-content p {
  color: var(--gray-500);
  font-size: 1rem;
  margin: 0;
}

/* Card Components */
.card {
  background: white;
  border-radius: var(--border-radius);
  padding: 32px;
  box-shadow: var(--shadow-md);
  margin-bottom: 24px;
}

.card h3 {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.mt-4 {
  margin-top: 32px;
}

/* Form Styles */
.election-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--primary);
  font-size: 0.95rem;
}

.form-control {
  padding: 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background: white;
}

.form-control:focus {
  border-color: var(--secondary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

.form-control::placeholder {
  color: var(--gray-400);
}

/* Form Row Layout */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--gray-200);
}

@media (max-width: 480px) {
  .form-actions {
    flex-direction: column;
  }
}

/* Button Styles */
.btn {
  padding: 12px 24px;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--gray-300);
}

.btn-outline:hover {
  background: var(--gray-50);
  border-color: var(--primary);
}

.btn-success {
  background: var(--success, #4caf50);
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.btn-warning {
  background: var(--warning, #ff9800);
  color: white;
}

.btn-warning:hover {
  background: #f57c00;
}

.btn-danger {
  background: var(--error, #f44336);
  color: white;
}

.btn-danger:hover {
  background: #d32f2f;
}

.btn-info {
  background: var(--info, #2196f3);
  color: white;
  font-size: 0.9rem;
  padding: 8px 16px;
}

.btn-info:hover {
  background: #1976d2;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Icon Buttons */
.btn-icon {
  background: none;
  border: none;
  padding: 8px;
  border-radius: var(--border-radius);
  color: var(--gray-500);
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--gray-100);
  color: var(--primary);
}

/* Table Styles */
.table-responsive {
  overflow-x: auto;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-200);
}

.elections-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.elections-table th {
  background: var(--gray-50);
  color: var(--primary);
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-bottom: 2px solid var(--gray-200);
  font-size: 0.95rem;
}

.elections-table td {
  padding: 16px;
  border-bottom: 1px solid var(--gray-200);
  color: var(--gray-700);
}

.elections-table tr:hover {
  background: var(--gray-50);
}

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.brouillon {
  background: rgba(158, 158, 158, 0.1);
  color: #757575;
}

.status-badge.ouverte {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.status-badge.en-cours {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.status-badge.fermee {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

/* Actions Column */
.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-dialog {
  width: 100%;
  max-width: 500px;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  padding: 24px 32px 16px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h4 {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--gray-500);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--gray-100);
  color: var(--primary);
}

.modal-body {
  padding: 24px 32px;
}

.modal-body p {
  color: var(--gray-700);
  margin-bottom: 16px;
  line-height: 1.5;
}

.modal-body .warning {
  color: var(--warning, #ff9800);
  font-weight: 500;
  margin: 0;
}

.modal-footer {
  padding: 16px 32px 24px;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

/* State Messages */
.empty-state, .loading-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--gray-500);
  font-size: 1.1rem;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-state::before {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
}

/* Error Messages */
.error-message {
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 4px;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .card {
    padding: 24px;
  }
  
  .elections-table {
    font-size: 0.9rem;
  }
  
  .elections-table th,
  .elections-table td {
    padding: 12px 8px;
  }
  
  .actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .modal-content {
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 24px;
    padding-right: 24px;
  }
}

/* Focus States for Accessibility */
.btn:focus,
.form-control:focus,
.btn-icon:focus {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

/* Candidature Form Styles */
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.mb-3 {
  margin-bottom: 24px;
}

.mb-4 {
  margin-bottom: 32px;
}

/* Select Dropdown Styling */
select.form-control {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 40px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

select.form-control:focus {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%233f51b5" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
}

/* Textarea Styling */
textarea.form-control {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

textarea.form-control::placeholder {
  color: var(--gray-400);
  font-style: italic;
}

/* Loading Text */
.text-muted {
  color: var(--gray-500);
}

.small {
  font-size: 0.85rem;
}

/* Validation States */
.form-control.is-invalid {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.invalid-feedback {
  display: block;
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 4px;
  line-height: 1.4;
}

/* Alert Styles */
.alert {
  padding: 16px 20px;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid transparent;
}

.alert-danger {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error);
  border-color: rgba(244, 67, 54, 0.2);
}

.mt-3 {
  margin-top: 24px;
}

/* Form Actions with Spacing */
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--gray-200);
  align-items: center;
}

/* Button Variants */
.btn-outline-secondary {
  background: transparent;
  color: var(--gray-600);
  border: 1px solid var(--gray-300);
}

.btn-outline-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  color: var(--gray-700);
}

.mr-2 {
  margin-right: 16px;
}

/* Spinner Animation */
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.125rem solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
  border-width: 0.125rem;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

/* File Upload Styling (for future use) */
.form-control-file {
  padding: 8px 12px;
  border: 2px dashed var(--gray-300);
  border-radius: var(--border-radius);
  background: var(--gray-50);
  transition: var(--transition);
  cursor: pointer;
}

.form-control-file:hover {
  border-color: var(--primary);
  background: rgba(63, 81, 181, 0.05);
}

.form-control-file:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

/* Enhanced Form Group Spacing */
.form-group + .form-group {
  margin-top: 24px;
}

/* Character Counter (for future enhancement) */
.character-counter {
  font-size: 0.8rem;
  color: var(--gray-500);
  text-align: right;
  margin-top: 4px;
}

.character-counter.warning {
  color: var(--warning);
}

.character-counter.error {
  color: var(--error);
}

/* Responsive Adjustments for Candidature Form */
@media (max-width: 768px) {
  .form-container {
    max-width: none;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  
  .mr-2 {
    margin-right: 0;
    margin-top: 12px;
  }
  
  textarea.form-control {
    min-height: 100px;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
  }
  
  .btn {
    padding: 14px 20px;
    font-size: 1rem;
  }
}

/* Enhanced Focus Management */
.form-group:focus-within label {
  color: var(--secondary);
}

/* Department Form Styles */
.form-card {
  border: none;
}

.card-body {
  padding: 32px;
}

.card-title {
  color: var(--primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
}

/* Bootstrap-like Grid System */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -12px;
  margin-right: -12px;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding-left: 12px;
  padding-right: 12px;
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Form Label Styling */
.form-label {
  font-weight: 500;
  color: var(--primary);
  font-size: 0.95rem;
  margin-bottom: 8px;
  display: block;
}

/* Input Styling with ngClass Support */
input.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background: white;
}

input.form-control:focus {
  border-color: var(--secondary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

input.form-control::placeholder {
  color: var(--gray-400);
}

/* Angular ngClass validation styling */
input.form-control.is-invalid {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

input.form-control.is-invalid:focus {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.15);
}

/* Button Spacing */
.ms-2 {
  margin-left: 16px;
}

/* Enhanced Form Actions for Department Form */
.form-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--gray-200);
  flex-wrap: wrap;
}

/* Loading State Button Content */
.btn .spinner-border + span {
  margin-left: 8px;
}

/* Form Group Consistent Spacing */
.mb-3 {
  margin-bottom: 24px;
}

.mt-3 {
  margin-top: 24px;
}

/* Enhanced Card Styling */
.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transition: box-shadow 0.3s ease;
}

/* Form Field Focus Enhancement */
.form-group:focus-within .form-label,
.col-md-6:focus-within .form-label {
  color: var(--secondary);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Input Group Styling for Better Visual Hierarchy */
.col-md-6 {
  position: relative;
}

.col-md-6:not(:last-child) {
  margin-bottom: 0;
}

/* Error Message Styling */
.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 4px;
  font-size: 0.85rem;
  color: var(--error);
  line-height: 1.4;
}

.invalid-feedback div {
  margin-bottom: 2px;
}

.invalid-feedback div:last-child {
  margin-bottom: 0;
}

/* Button States Enhancement */
.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Loading Button Enhancement */
.btn .spinner-border {
  margin-right: 8px;
}

/* Responsive Adjustments for Department Form */
@media (max-width: 768px) {
  .card-body {
    padding: 24px;
  }
  
  .row {
    margin-left: 0;
    margin-right: 0;
  }
  
  .col-md-6 {
    padding-left: 0;
    padding-right: 0;
    margin-bottom: 20px;
  }
  
  .col-md-6:last-child {
    margin-bottom: 0;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ms-2 {
    margin-left: 0;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .card-body {
    padding: 20px;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
  
  .btn {
    padding: 14px 20px;
    font-size: 1rem;
  }
}

/* Additional Enhancement: Subtle Animation */
.form-control {
  transition: all 0.2s ease;
}

.form-control:focus {
  transform: translateY(-1px);
}

/* Form Card Specific Enhancements */
.form-card .card-body {
  position: relative;
}

.form-card .card-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

/* Department List Card Styles */
.list-card {
  border: none;
  margin-top: 32px;
}

.card-header {
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: 20px 32px;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.card-header .card-title {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.mb-0 {
  margin-bottom: 0;
}

/* Loading States */
.text-center {
  text-align: center;
}

.p-4 {
  padding: 32px;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25rem solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
}

.text-primary {
  color: var(--primary) !important;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.mt-2 {
  margin-top: 16px;
}

/* Alert Info Styling */
.alert-info {
  background-color: rgba(33, 150, 243, 0.1);
  color: #1976d2;
  border: 1px solid rgba(33, 150, 243, 0.2);
  padding: 16px 20px;
  border-radius: var(--border-radius);
  margin: 0;
}

/* Enhanced Table Styling */
.table {
  width: 100%;
  margin-bottom: 0;
  color: var(--gray-700);
  border-collapse: collapse;
}

.table th {
  background: var(--gray-50);
  color: var(--primary);
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-bottom: 2px solid var(--gray-200);
  font-size: 0.95rem;
  white-space: nowrap;
}

.table td {
  padding: 16px;
  border-bottom: 1px solid var(--gray-200);
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: var(--gray-50);
  transition: background-color 0.2s ease;
}

.align-middle {
  vertical-align: middle !important;
}

/* Button Variants for Table Actions */
.btn-outline-primary {
  color: var(--primary);
  border: 1px solid var(--primary);
  background: transparent;
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(63, 81, 181, 0.2);
}

.btn-outline-danger {
  color: var(--error);
  border: 1px solid var(--error);
  background: transparent;
}

.btn-outline-danger:hover {
  background: var(--error);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.2);
}

/* Button Spacing */
.me-2 {
  margin-right: 16px;
}

/* Icon Styling (Bootstrap Icons placeholder) */
.bi {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
  margin-right: 4px;
  vertical-align: -0.125em;
}

/* If using actual icons, you can replace with SVG */
.btn .bi::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 6px;
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: middle;
}

.bi-pencil-square::before {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>');
}

.bi-trash::before {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>');
}

/* Table Actions Column */
.table td:last-child {
  white-space: nowrap;
}

/* Enhanced Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: var(--gray-500);
}

.loading-container p {
  margin: 16px 0 0 0;
  font-size: 1rem;
}

/* Empty State Enhancement */
.alert-info {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  font-size: 1rem;
  margin: 16px;
}

/* Responsive Table */
@media (max-width: 768px) {
  .card-header {
    padding: 16px 20px;
  }
  
  .card-body {
    padding: 0;
  }
  
  .table-responsive {
    border-radius: 0;
  }
  
  .table th,
  .table td {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
  
  .btn-sm {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
  
  .me-2 {
    margin-right: 8px;
  }
  
  /* Stack action buttons on very small screens */
  @media (max-width: 480px) {
    .table td:last-child {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-start;
    }
    
    .me-2 {
      margin-right: 0;
    }
  }
}

/* Table Scroll Indicator */
.table-responsive {
  position: relative;
}

.table-responsive::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to left, rgba(255,255,255,0.8), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.table-responsive:hover::after {
  opacity: 1;
}

/* Enhanced Card Body for List */
.list-card .card-body {
  padding: 0;
}

.list-card .alert,
.list-card .loading-container {
  margin: 24px;
}

/* Elections Grid Layout */
.elections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .elections-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Election Card Styling */
.election-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.election-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.election-card:active {
  transform: translateY(-2px);
}

/* Election Header */
.election-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.election-type {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.election-statut {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Status Badge Colors */
.election-statut.BROUILLON {
  background: rgba(158, 158, 158, 0.1);
  color: #757575;
}

.election-statut.OUVERTE {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}

.election-statut.EN_COURS {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.election-statut.FERMEE {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.election-statut.TERMINEE {
  background: rgba(156, 39, 176, 0.1);
  color: #7b1fa2;
}

/* Election Title */
.election-card h3 {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Election Description */
.election-description {
  color: var(--gray-600);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Election Details */
.election-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: var(--gray-600);
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-value {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Election Actions */
.election-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.election-actions .btn {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 480px) {
  .election-actions {
    flex-direction: column;
  }
  
  .election-actions .btn {
    width: 100%;
    min-width: auto;
  }
}

/* Button Variants for Election Cards */
.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(63, 81, 181, 0.2);
}

/* Enhanced Info Button */
.btn-info {
  background: var(--info, #17a2b8);
  color: white;
  border: 1px solid var(--info, #17a2b8);
}

.btn-info:hover {
  background: #138496;
  border-color: #138496;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(23, 162, 184, 0.2);
}

/* Card Hover Effect Enhancement */
.election-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.election-card:hover::before {
  transform: scaleX(1);
}

/* Focus States for Accessibility */
.election-card:focus {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.election-actions .btn:focus {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

/* Loading State for Election Cards */
.election-card.loading {
  opacity: 0.7;
  pointer-events: none;
}

.election-card.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  margin: -15px 0 0 -15px;
  border: 3px solid rgba(63, 81, 181, 0.3);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
}

/* Empty State for Elections Grid */
.elections-grid:empty::before {
  content: 'Aucune élection disponible pour le moment.';
  display: block;
  text-align: center;
  color: var(--gray-500);
  font-size: 1.1rem;
  padding: 48px 24px;
  grid-column: 1 / -1;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .elections-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .election-card {
    padding: 20px;
  }
  
  .election-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .election-details {
    padding: 12px;
  }
  
  .detail-item {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .election-card {
    padding: 16px;
  }
  
  .election-card h3 {
    font-size: 1.1rem;
  }
  
  .election-description {
    font-size: 0.9rem;
  }
}

/* Animation for Card Entrance */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.election-card {
  animation: slideInUp 0.3s ease-out;
}

.election-card:nth-child(n+2) {
  animation-delay: 0.1s;
}

.election-card:nth-child(n+3) {
  animation-delay: 0.2s;
}

.election-card:nth-child(n+4) {
  animation-delay: 0.3s;
}

/* Election Details Component Styles */
.election-details-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.election-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.election-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
}

/* Election Header */
.election-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 20px;
}

.election-header h2 {
  color: var(--primary);
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  line-height: 1.2;
}

/* Badge Styling */
.badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.badge.bg-success {
  background: rgba(76, 175, 80, 0.1);
  color: #388e3c;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.badge.bg-warning {
  background: rgba(255, 152, 0, 0.1);
  color: #f57c00;
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.badge.bg-secondary {
  background: rgba(158, 158, 158, 0.1);
  color: #757575;
  border: 1px solid rgba(158, 158, 158, 0.2);
}

/* Election Meta Information */
.election-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.9rem;
  color: var(--gray-500);
  font-weight: 500;
}

.meta-value {
  font-weight: 600;
  color: var(--primary);
  font-size: 1rem;
}

/* Election Description */
.election-description {
  margin-bottom: 32px;
}

.election-description h3 {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.election-description p {
  color: var(--gray-700);
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
}

/* Candidates Section */
.candidates-section {
  margin: 32px 0;
}

.candidates-section h3 {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Candidate Card Styling */
.candidate-card {
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
}

.candidate-card:hover {
  border-color: var(--primary);
  background: var(--gray-50);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.candidate-card.selected {
  border-color: var(--primary);
  background: rgba(63, 81, 181, 0.05);
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

.candidate-card.selected::before {
  content: '✓';
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.candidate-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.candidate-info h4 {
  color: var(--primary);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  margin-top: 0;
}

.candidate-info p {
  color: var(--gray-600);
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* Vote Actions Section */
.vote-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--gray-200);
}

/* Form Check Styling */
.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
}

.form-check-input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--primary);
  cursor: pointer;
}

.form-check-label {
  color: var(--gray-700);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

/* Enhanced Button Styling */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 12px 24px;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  color: white;
  background: var(--primary);
  border-color: var(--primary);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  background: var(--gray-400);
  border-color: var(--gray-400);
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-danger {
  color: white;
  background: var(--error);
  border-color: var(--error);
}

.btn-danger:hover {
  background: #d32f2f;
  border-color: #d32f2f;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.2);
}

.btn-link {
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 8px 0;
}

.btn-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* Alert Styling */
.alert {
  padding: 16px 20px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.5;
  border: 1px solid transparent;
}

.alert-success {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border-color: rgba(76, 175, 80, 0.2);
}

.alert-danger {
  background: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border-color: rgba(244, 67, 54, 0.2);
}

.alert-info {
  background: rgba(33, 150, 243, 0.1);
  color: #1565c0;
  border-color: rgba(33, 150, 243, 0.2);
}

.alert-warning {
  background: rgba(255, 152, 0, 0.1);
  color: #ef6c00;
  border-color: rgba(255, 152, 0, 0.2);
}

/* Admin Actions Section */
.admin-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid var(--gray-200);
  background: rgba(244, 67, 54, 0.02);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-left: -32px;
  margin-right: -32px;
  margin-bottom: -32px;
}

.admin-actions h4 {
  color: var(--error);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  margin-top: 0;
}

/* Utility Classes */
.mt-2 {
  margin-top: 16px;
}

.mt-3 {
  margin-top: 24px;
}

.mt-4 {
  margin-top: 32px;
}

.pt-3 {
  padding-top: 24px;
}

.border-top {
  border-top: 1px solid var(--gray-200);
}

/* Responsive Design */
@media (max-width: 768px) {
  .election-details-container {
    padding: 20px 16px;
  }
  
  .election-card {
    padding: 24px;
  }
  
  .election-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .election-header h2 {
    font-size: 1.5rem;
  }
  
  .election-meta {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .candidates-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .admin-actions {
    margin-left: -24px;
    margin-right: -24px;
    margin-bottom: -24px;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .election-card {
    padding: 20px;
  }
  
  .candidate-card {
    padding: 16px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .admin-actions {
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: -20px;
    padding: 16px;
  }
}

/* Loading State */
.election-details-container.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.election-details-container.loading::before {
  content: '';
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-300);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
}

/* Focus States */
.candidate-card:focus {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

.form-check-input:focus {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

/* Print Styles */
@media print {
  .btn, .actions, .modal-overlay {
    display: none !important;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid var(--gray-300);
  }
}`]
})
export class ElectionDetailsComponent implements OnInit {
  election: Election | null = null;
  selectedCandidate: any = null;
  isBlankVote = false;
  isSubmitting = false;
  hasVoted = false;
  errorMessage: string | null = null;
  isLoading = true;
  isAdmin = false; // Placeholder: Implement actual admin check
  actionMessage: string | null = null;
  actionMessageType: 'success' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private voteService: VoteService,
    private authService: AuthService,
    // private authService: AuthService // Inject if needed for isAdmin check
  ) { }

  ngOnInit() {
    // Placeholder for isAdmin check - replace with actual logic from AuthService
    this.isAdmin = this.authService.getUserRole() === 'ADMIN'; 
    this.loadElection();
  }

  loadElection() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.electionService.getElection(+id).subscribe({
        next: (data) => {
          this.election = data;
          if (this.election.statut === 'EN_COURS') {
            this.checkIfVoted(); // Only check if voted if election is in progress
          } else {
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error loading election:', err);
          this.errorMessage = "Impossible de charger les détails de l'élection.";
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = "ID de l'élection non trouvé.";
      this.isLoading = false;
    }
  }

  checkIfVoted() {
    if (!this.election) return;
    this.voteService.hasVoted(this.election.id).subscribe({
      next: (response: any) => {
        this.hasVoted = typeof response === 'boolean' ? response : response?.hasVoted === true;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error checking vote status:', error);
        this.hasVoted = false; 
        this.isLoading = false;
      }
    });
  }

  selectCandidate(candidate: any) {
    if (this.isBlankVote) {
      this.isBlankVote = false;
    }
    this.selectedCandidate = candidate;
  }

  onBlankVoteChange() {
    if (this.isBlankVote) {
      this.selectedCandidate = null;
    }
  }

  canVote(): boolean {
    return !this.isSubmitting && (this.isBlankVote || this.selectedCandidate !== null);
  }

  submitVote() {
    if (!this.election || !this.canVote()) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const voteData = {
      election_id: this.election.id,
      candidature_id: this.isBlankVote ? null : this.selectedCandidate?.id,
      vote_blanc: this.isBlankVote
    };

    this.voteService.submitVote(voteData).subscribe({
      next: (response) => {
        this.hasVoted = true;
        this.isSubmitting = false;
        this.actionMessage = 'Votre vote a été enregistré avec succès!';
        this.actionMessageType = 'success';
        // Optionally navigate or show persistent success message
      },
      error: (error) => {
        console.error('Error submitting vote:', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'envoi de votre vote';
        this.isSubmitting = false;
      }
    });
  }

  closeAndCalculateElection(): void {
    if (!this.election || !this.isAdmin) return;
    this.actionMessage = null;
    this.electionService.closeElection(this.election.id).subscribe({
      next: () => {
        this.actionMessage = 'L\'élection a été fermée avec succès. Le calcul des résultats est en cours.';
        this.actionMessageType = 'success';
        this.election!.statut = 'FERMEE'; // Update status locally
        // Optionally, navigate to results page or refresh data more thoroughly
        // this.loadElection(); // to refresh everything including disabling the button
         this.router.navigate(['../results'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error closing election:', err);
        this.actionMessage = err.error?.message || 'Erreur lors de la fermeture de l\'élection.';
        this.actionMessageType = 'error';
      }
    });
  }

  viewResults(election: Election) {
    this.router.navigate(['election', election.id, 'results'], { relativeTo: this.route });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route }); // Navigate to parent (elections list)
  }
}
