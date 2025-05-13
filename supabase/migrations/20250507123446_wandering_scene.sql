/*
  # Add Prompt References Table
  
  1. New Tables
    - `prompt_references` - Stores reusable content templates for prompts
      - `id` (uuid, primary key)
      - `name` (text, unique) - Reference key used in prompts
      - `title` (text) - Display title
      - `content` (text) - Content to be inserted
      - `description` (text) - Usage description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Restrict management to admin users
*/

-- Create prompt references table
CREATE TABLE IF NOT EXISTS prompt_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE prompt_references ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "References are viewable by everyone"
  ON prompt_references FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage references"
  ON prompt_references FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

-- Add example data
INSERT INTO prompt_references (name, title, content, description) VALUES
(
  'TABELA_NUTRICIONAL',
  'Exemplo de Tabela Nutricional',
  'Informação Nutricional
Porção de 100g (1 fatia)
Valor Energético: 280 kcal
Carboidratos: 42g
Proteínas: 4.8g
Gorduras Totais: 10g
Gorduras Saturadas: 4.2g
Fibra Alimentar: 2.4g
Sódio: 390mg',
  'Use esta referência para incluir informações nutricionais padronizadas em ofertas de produtos alimentícios.'
);