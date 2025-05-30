import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePromptStore } from '../../store/promptStore';
import { useAuthStore } from '../../store/authStore';
import PromptCard from '../../components/PromptCard';
import Button from '../../components/ui/Button';
import { Heart } from 'lucide-react';

const Favorites: React.FC = () => {
  const { favorites, fetchFavorites } = usePromptStore();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await fetchFavorites();
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Falha ao carregar favoritos. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    // Setup visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        loadFavorites();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchFavorites, isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-2">
            Faça login para ver seus favoritos
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Você precisa estar logado para acessar seus prompts favoritos.
          </p>
          <Link to="/login">
            <Button>
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

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
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Carregando seus favoritos...
          </p>
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