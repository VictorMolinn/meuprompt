import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

/** Mantém a sessão em dia sempre que o app volta ao foco */
export function useSessionSync() {
  const signOut = useAuthStore((s) => s.signOut);
  const getProfile = useAuthStore((s) => s.getProfile);

  useEffect(() => {
    let refreshing = false;

    const refresh = async () => {
      // evita chamadas concorrentes
      if (refreshing) return;
      refreshing = true;

      try {
        // força validação no backend
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          signOut();
          return;
        }

        // Recarrega o perfil se a sessão foi renovada com sucesso
        if (data?.user) {
          await getProfile();
        }
      } finally {
        refreshing = false;
      }
    };

    const handleFocus = () => {
      // Safari PWA nem sempre dispara visibilitychange
      if (document.visibilityState === 'visible') refresh();
    };

    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus); // cobre desktop e iOS

    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [signOut, getProfile]);
}