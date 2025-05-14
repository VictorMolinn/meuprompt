import { AuthError } from '@supabase/supabase-js';
import { useAuthStore } from '../store/authStore';

/**
 * Wrapper para chamadas do Supabase que tenta refreshSession() 
 * automaticamente quando captura erro 401 e repete a chamada.
 * Se o refresh falhar, o usuário é deslogado.
 */
export async function withAuthRetry<T>(
  fn: () => Promise<T>,
  retryCount = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // Se não for erro de auth ou já tentou refresh, propaga o erro
    if (
      !(error instanceof AuthError) ||
      error.status !== 401 ||
      retryCount <= 0
    ) {
      throw error;
    }

    // Tenta refresh da sessão
    try {
      await useAuthStore.getState().refreshSession();
      // Retry após refresh bem sucedido
      return await withAuthRetry(fn, retryCount - 1);
    } catch (refreshError) {
      // Se refresh falhar, desloga usuário e propaga erro
      await useAuthStore.getState().signOut();
      throw error;
    }
  }
}