/*
  # Initial Database Setup and Seed Data

  1. Tables Created
    - `niches` - Business niches with descriptions and images
    - `areas` - Business areas with color coding
    - `prompt_types` - Types of prompts with icons
    - `prompts` - AI prompts with content and metadata
    - `profiles` - User profiles with business info
    - `favorites` - User favorites
    - `ratings` - User ratings for prompts

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Initial Data
    - Sample niches
    - Business areas
    - Prompt types
    - Example prompts
*/

-- Create tables
CREATE TABLE IF NOT EXISTS niches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prompt_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  niche_id uuid REFERENCES niches(id) ON DELETE SET NULL,
  area_id uuid REFERENCES areas(id) ON DELETE SET NULL,
  type_id uuid REFERENCES prompt_types(id) ON DELETE SET NULL,
  has_custom_fields boolean DEFAULT false,
  custom_fields jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  company_name text DEFAULT '',
  company_description text DEFAULT '',
  brand_voice text DEFAULT '',
  niche_id uuid REFERENCES niches(id) ON DELETE SET NULL,
  avatar_url text,
  completed_onboarding boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Niches are viewable by everyone"
  ON niches FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage niches"
  ON niches FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

CREATE POLICY "Areas are viewable by everyone"
  ON areas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage areas"
  ON areas FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

CREATE POLICY "Prompt types are viewable by everyone"
  ON prompt_types FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage prompt types"
  ON prompt_types FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

CREATE POLICY "Prompts are viewable by everyone"
  ON prompts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage prompts"
  ON prompts FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can manage their own ratings"
  ON ratings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed initial data
INSERT INTO niches (name, description, image_url)
VALUES 
  ('E-commerce', 'Lojas online e marketplaces', 'https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg'),
  ('Saúde e Bem-estar', 'Clínicas, academias, nutrição e bem-estar', 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg'),
  ('Gastronomia', 'Restaurantes, cafés, bares e delivery', 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg'),
  ('Educação', 'Escolas, cursos, treinamentos e ensino', 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg'),
  ('Tecnologia', 'Empresas de software, startups, agências digitais', 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg')
ON CONFLICT DO NOTHING;

INSERT INTO areas (name, color)
VALUES 
  ('Marketing', '#FF5722'),
  ('Vendas', '#4CAF50'),
  ('Atendimento', '#2196F3'),
  ('Recrutamento', '#9C27B0'),
  ('Comunicação', '#FFC107')
ON CONFLICT DO NOTHING;

INSERT INTO prompt_types (name, icon)
VALUES 
  ('Texto', 'MessageSquare'),
  ('Imagem', 'Image'),
  ('Vídeo', 'Video'),
  ('Análise', 'BarChart'),
  ('Ferramenta', 'Tool')
ON CONFLICT DO NOTHING;

INSERT INTO prompts (title, description, content, image_url, has_custom_fields, custom_fields)
VALUES 
  (
    'Gerador de Nomes de Produto', 
    'Crie nomes criativos para seu novo produto ou serviço baseado no seu negócio.', 
    'Crie 10 nomes para o meu [PRODUTO] feito pela [EMPRESA] que combina com o meu [TOM DE VOZ]',
    'https://images.pexels.com/photos/4467738/pexels-photo-4467738.jpeg',
    true,
    '[{"name":"PRODUTO","label":"Nome do Produto","placeholder":"Ex: sorvete, curso, aplicativo","required":true}]'
  ),
  (
    'Email de Vendas Persuasivo', 
    'Crie um email persuasivo para enviar a potenciais clientes sobre seu produto/serviço.', 
    'Crie um email de vendas persuasivo para a minha [EMPRESA]. Este email será enviado para minha lista de leads para oferecer o meu [PRODUTO]. Utilize o seguinte tom de voz: [TOM DE VOZ]. Minha empresa é: [DESCRIÇÃO].',
    'https://images.pexels.com/photos/4132326/pexels-photo-4132326.jpeg',
    true,
    '[{"name":"PRODUTO","label":"Produto/Serviço","placeholder":"Ex: consultoria financeira","required":true}]'
  ),
  (
    'Bio para Instagram', 
    'Crie uma bio profissional e atrativa para o Instagram da sua empresa.', 
    'Crie uma bio para o Instagram da minha empresa [EMPRESA] com no máximo 150 caracteres. A bio deve refletir o seguinte tom de voz: [TOM DE VOZ]. Breve descrição da empresa: [DESCRIÇÃO].',
    'https://images.pexels.com/photos/6393013/pexels-photo-6393013.jpeg',
    false,
    null
  ),
  (
    'Texto para Anúncio no Facebook', 
    'Crie textos persuasivos para anúncios do Facebook que convertem.', 
    'Crie 3 textos para anúncios do Facebook para a minha empresa [EMPRESA]. Os anúncios devem promover [PRODUTO] e ter no máximo 125 caracteres. Use um tom de voz [TOM DE VOZ]. Minha empresa é: [DESCRIÇÃO].',
    'https://images.pexels.com/photos/7433822/pexels-photo-7433822.jpeg',
    true,
    '[{"name":"PRODUTO","label":"Produto/Serviço","placeholder":"Ex: nosso novo curso online","required":true}]'
  )
ON CONFLICT DO NOTHING;