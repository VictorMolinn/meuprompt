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
      try {
        // Get session from URL
        const { data: { session }, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true
        });
        
        if (error) {
          if (import.meta.env.DEV) {
            console.error('Auth callback error:', error);
          }
          if (import.meta.env.DEV) {
            console.error('Auth callback error:', error);
          }
          throw error;
        }
        
        if (!session) {
          if (import.meta.env.DEV) {
            console.log('No session found in callback');
          }
          navigate('/login');
          return;
        }

        // Check if user needs to complete onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', session.user.id)
          .single();

        // Clean up URL parameters
        window.history.replaceState({}, document.title, '/callback');

        toast.success('Successfully signed in!');
        await getProfile();
        navigate(profile?.completed_onboarding ? '/prompts' : '/onboarding');
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error during authentication:', error);
        }
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );
}