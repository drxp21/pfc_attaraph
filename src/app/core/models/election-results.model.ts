export interface CandidatInfo {
  id: number;
  nom: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  prenom: string;
  telephone: string;
  type_personnel: string;
  departement_id: number;
}

export interface CandidatureResultDetails {
  id: number;
  election_id: number;
  candidat_id: number;
  programme: string;
  statut: string;
  commentaire_admin: string | null;
  date_soumission: string;
  date_validation: string;
  validee_par: number;
  created_at: string;
  updated_at: string;
  candidat: CandidatInfo;
}

export interface ElectionResultItem {
  id: number;
  election_id: number;
  candidature_id: number;
  nb_voix: number;
  pourcentage: string;
  rang: number;
  created_at: string;
  updated_at: string;
  candidature: CandidatureResultDetails;
}

export interface ElectionStatistics {
  nb_electeurs_inscrits: number;
  nb_votes_exprimes: number;
  nb_votes_blancs: number;
  taux_participation: number;
}

export interface ElectionResultsData {
  resultats: ElectionResultItem[];
  statistiques: ElectionStatistics;
  election_details?: { // Optional: To store election title, dates etc.
    titre: string;
    date_debut_vote: string;
    date_fin_vote: string;
  };
} 