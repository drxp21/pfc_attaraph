/*
  # Configuration de l'authentification à double facteur

  1. Nouvelle Table
    - `user_2fa`
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, clé étrangère vers auth.users)
      - `secret` (text, secret pour la génération des codes)
      - `enabled` (boolean, statut d'activation)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Active RLS sur la table user_2fa
    - Ajoute des politiques pour la lecture et la mise à jour
*/

CREATE TABLE IF NOT EXISTS user_2fa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  secret text NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture des données 2FA
CREATE POLICY "Users can read their own 2FA data"
  ON user_2fa
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique pour la mise à jour des données 2FA
CREATE POLICY "Users can update their own 2FA settings"
  ON user_2fa
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_2fa_updated_at
  BEFORE UPDATE ON user_2fa
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();