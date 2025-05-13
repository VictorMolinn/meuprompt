import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

export default function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          navigate('/login');
          return;
        }

        // Check if user needs to complete onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', data.session.user.id)
          .single();

        toast.success('Successfully signed in!');
        navigate(profile?.completed_onboarding ? '/prompts' : '/onboarding');
      } catch (error) {
        console.error('Error during authentication:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    }

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
    </div>
  );
}
