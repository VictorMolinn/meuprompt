import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.38.5';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') || 'https://meuprompt.eiaiflix.com.br';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');
    const redirectTo = url.searchParams.get('redirect_to');

    // Aceita tanto magiclink quanto recovery
    if (!token || (type !== 'magiclink' && type !== 'recovery')) {
      throw new Error('Invalid token or type');
    }

    // Verifica se o token existe na tabela
    const { data: callback } = await supabase
      .from('auth_callbacks')
      .select('*')
      .eq('token', token)
      .single();

    if (!callback) {
      throw new Error('Invalid or expired token');
    }

    // Marca o token como usado
    await supabase
      .from('auth_callbacks')
      .update({ used: true })
      .eq('id', callback.id);

    // Define o destino conforme o tipo
    let destination: string;
    if (type === 'magiclink') {
      destination = redirectTo || `${SITE_URL}/callback`;
    } else {
      // recovery
      destination = redirectTo || `${SITE_URL}/auth/set-password`;
    }

    // Redireciona o usuário
    return new Response(null, {
      headers: { ...corsHeaders, Location: destination },
      status: 302,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
