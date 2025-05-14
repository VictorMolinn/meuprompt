import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

/** Mantém a sessão em dia sempre que o app volta ao foco */
export function useSessionSync() {
  const signOut = useAuthStore((s) => s.signOut);
  const getProfile = useAuthStore((s) => s.getProfile);
  const getProfile = useAuthStore((s) => s.getProfile);

  useEffect(() => {
    let refreshing = false;
    let lastActive = Date.now();
    
    // Start auto-refresh for auth token
    supabase.auth.startAutoRefresh();

    const refresh = async () => {
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
        // força validação no backend
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          signOut();
          return;
        }

        // Recarrega o perfil se a sessão foi renovada com sucesso
        if (data?.session) {
          await getProfile();
          
          // Reconecta o Realtime se necessário
          if (!supabase.realtime.isConnected()) {
            supabase.realtime.connect();
          }
        }
      } catch (error) {
        console.error('Error refreshing session:', error);
        toast.error('Erro ao sincronizar sessão');
      } 
    };

    const handleFocus = () => {
      if (document.visibilityState === 'visible') refresh();
    };

    const handleActivity = () => {
      lastActive = Date.now();
    };

    // Check for inactivity every minute
    const inactivityInterval = setInterval(() => {
      if (Date.now() - lastActive > 30 * 60 * 1000) { // 30 minutes
        window.location.reload();
      }
    }, 60 * 1000);

    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('touchstart', handleActivity);

    return () => {
      supabase.auth.stopAutoRefresh();
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      clearInterval(inactivityInterval);
    };
  }, [signOut, getProfile]);
}