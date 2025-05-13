/*
  # Seed Initial Data

  This migration adds initial seed data for:
  1. Niches - Common business categories
  2. Areas - Business functional areas
  3. Prompt Types - Different types of AI prompts
  4. Sample Prompts - Initial set of prompts
*/

-- Seed niches
INSERT INTO niches (name, description, image_url)
VALUES 
  ('E-commerce', 'Lojas online e marketplaces', 'https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg'),
  ('Saúde e Bem-estar', 'Clínicas, academias, nutrição e bem-estar', 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg'),
  ('Gastronomia', 'Restaurantes, cafés, bares e delivery', 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg'),
  ('Educação', 'Escolas, cursos, treinamentos e ensino', 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg'),
  ('Tecnologia', 'Empresas de software, startups, agências digitais', 'https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg')
ON CONFLICT DO NOTHING;

-- Seed areas
INSERT INTO areas (name, color)
VALUES 
  ('Marketing', '#FF5722'),
  ('Vendas', '#4CAF50'),
  ('Atendimento', '#2196F3'),
  ('Recrutamento', '#9C27B0'),
  ('Comunicação', '#FFC107')
ON CONFLICT DO NOTHING;

-- Seed prompt types
INSERT INTO prompt_types (name, icon)
VALUES 
  ('Texto', 'MessageSquare'),
  ('Imagem', 'Image'),
  ('Vídeo', 'Video'),
  ('Análise', 'BarChart'),
  ('Ferramenta', 'Tool')
ON CONFLICT DO NOTHING;

-- Seed sample prompts
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