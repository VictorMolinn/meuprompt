import React, { useEffect, useState } from 'react';
import { usePromptStore } from '../../store/promptStore';
import { withAuthRetry } from '../../lib/supaWrap';
import { toast } from 'sonner';
import PromptCard from '../../components/PromptCard';
import PromptSkeleton from '../../components/ui/PromptSkeleton';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const Favorites: React.FC = () => {
  const { favorites, fetchFavorites } = usePromptStore();
  const [isLoading, setIsLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      setTimedOut(false);
      
      // Set timeout after 8s
      const timeoutId = setTimeout(() => {
        if (isLoading) setTimedOut(true);
      }, 8000);
      
      try {
        await withAuthRetry(() => fetchFavorites());
      } catch (error) {
        if (error instanceof TypeError) {
          toast.error('Sem conexão. Verifique a rede e tente novamente.');
        }
        console.error('Error loading favorites:', error);
      }
      
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
    
    loadFavorites();
  }, [fetchFavorites, retryCount]);

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
          Meus Favoritos
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Acesse rapidamente os prompts que você salvou como favoritos.
        </p>
      </div>

      {isLoading ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <PromptSkeleton key={i} />
            ))}
          </div>
          
          {timedOut && (
            <div className="text-center mt-8">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                O carregamento está demorando mais que o normal.
              </p>
              <Button onClick={handleRetry}>
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(prompt => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-2">
            Você ainda não tem favoritos
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Explore os prompts e clique no ícone de coração para adicionar aos favoritos.
          </p>
          <Link to="/prompts">
            <Button>
              Explorar Prompts
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;