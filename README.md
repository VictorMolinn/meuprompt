# MeuPrompt WebApp

Este é o repositório do front-end da aplicação MeuPrompt, construído com Vite + Bolt.New e hospedado no Netlify.

## Scripts

- `npm install` — instala dependências  
- `npm run dev` — roda em modo dev (localhost:5173)  
- `npm run build` — gera a pasta `dist/`

## Deploy no Netlify

- Usamos um `netlify.toml` para redirects de domínio e fallback SPA.  
- Variáveis de ambiente necessárias:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
