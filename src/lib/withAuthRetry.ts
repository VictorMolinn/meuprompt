import { AuthError } from '@supabase/supabase-js';
import { useAuthStore } from '../store/authStore';

/**
 * Wrapper for Supabase calls that automatically handles auth errors by:
 * 1. Catching 401 errors
 * 2. Attempting to refresh the session
 * 3. Retrying the original call
 * 4. Logging out if refresh fails
 */
export async function withAuthRetry<T>(
  fn: () => Promise<T>,
  retryCount = 1
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // If not an auth error or no more retries, throw
    if (!(error instanceof AuthError) || error.status !== 401 || retryCount <= 0) {
      throw error;
    }

    // Try to refresh session
    try {
      await useAuthStore.getState().refreshSession();
      // Retry after successful refresh
      return await withAuthRetry(fn, retryCount - 1);
    } catch (refreshError) {
      // If refresh fails, log out and throw original error
      await useAuthStore.getState().signOut();
      throw error;
    }
  }
}