import { supabase } from './supabase';
import { useAuthStore } from '../store/authStore';

export async function withAuthRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Tenta renovar a sessão apenas em caso de erro 401
    if (error.status === 401 || error.code === '401') {
      const { error: refreshError } = await supabase.auth.refreshSession();
      
      // Se conseguiu renovar, tenta a operação original novamente
      if (!refreshError) {
        return await fn();
      }
      
      // Se não conseguiu renovar, desloga o usuário
      useAuthStore.getState().signOut();
    }
    
    // Re-throw outros tipos de erro
    throw error;
  }
}