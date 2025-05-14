import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  getProfile: () => Promise<UserProfile | null>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  isAuthenticated: false,
  
  setSession: (session) => {
    const user = session?.user || null;
    set({ 
      user,
      isAuthenticated: !!user,
      isAdmin: user?.email === 'eiaiflix@gmail.com'
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      get().setSession(session);
      
      if (session?.user) {
        await get().getProfile();
      } else {
        set({ profile: null });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      set({ user: null, profile: null, isAuthenticated: false, isAdmin: false });
    }
  },

  getProfile: async () => {
    const { user } = get();
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        return null;
      }
      
      set({ profile: data });
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      get().setSession(data.session);
      await get().getProfile();
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  },

  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: undefined }
      });

      if (error) throw error;

      if (data?.user) {
        const { data: transactionCheck } = await supabase
          .rpc('check_user_transaction', {
            user_email: email
          });

        const hasPurchase = transactionCheck?.[0]?.has_transaction || false;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              full_name: '',
              completed_onboarding: false,
              subscription_status: hasPurchase ? 'premium' : 'free'
            },
          ])
          .select()
          .single();

        if (profileError) {
          await supabase.auth.signOut();
          throw profileError;
        }

        get().setSession(data.session);
        await get().getProfile();
      }

      return { error: null, data };
    } catch (error) {
      return { error, data: null };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ 
      user: null, 
      profile: null, 
      isAuthenticated: false,
      isAdmin: false 
    });
  },
}));

export const initializeAuth = async () => {
  const authStore = useAuthStore.getState();
  
  try {
    await authStore.refreshSession();
    useAuthStore.setState({ isLoading: false });

    // Setup auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
      
      useAuthStore.setState({ 
        user, 
        isAuthenticated: !!user,
        isAdmin: user?.email === 'eiaiflix@gmail.com' 
      });
      
      if (user) {
        await authStore.getProfile();
      } else {
        useAuthStore.setState({ profile: null });
      }
    });

  } catch (error) {
    console.error('Auth initialization error:', error);
    useAuthStore.setState({ isLoading: false });
  }
};