import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';

export default function Callback() {
  const navigate = useNavigate();
  const { getProfile } = useAuthStore();

  useEffect(() => {
    async function handleCallback() {
      // Só processa se vier um access_token no hash
      if (!window.location.hash.includes('access_token')) {
        navigate('/login', { replace: true });
        return;
      }

      // Extrai a sessão do hash e persiste no storage
      const {
        data: { session },
        error,
      } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error || !session) {
        console.error('Erro no Magic Link callback:', error);
        toast.error('Falha ao concluir o login. Tente de novo.');
        navigate('/login', { replace: true });
        return;
      }

      // Limpa o fragmento da URL para não expor tokens
      window.history.replaceState({}, document.title, '/callback');

      // Carrega o perfil no seu store, se for o caso
      try {
        await getProfile();
      } catch (e) {
        console.warn('Não foi possível carregar o perfil', e);
      }

      toast.success('Login concluído!');
      navigate('/prompts', { replace: true });
    }

    handleCallback();
  }, [navigate, getProfile]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );
}
