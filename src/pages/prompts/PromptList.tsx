import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { usePromptStore } from '../../store/promptStore';
import { withAuthRetry } from '../../lib/supaWrap';
import { toast } from 'sonner';
import PromptCard from '../../components/PromptCard';
import PromptSkeleton from '../../components/ui/PromptSkeleton';
import { Search, Filter, X, Crown, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Prompt } from '../../types';

const PromptList: React.FC = () => {
  const { 
    prompts, 
    fetchPrompts, 
    areas, 
    promptTypes, 
    niches,
    fetchAreas, 
    fetchPromptTypes,
    selectedArea,
    selectedType,
    setSelectedArea,
    setSelectedType,
    getFilteredPrompts
  } = usePromptStore();
  const { profile, isLoading: authLoading } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [timedOut, setTimedOut] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const isPremium = profile?.subscription_status === 'premium';
  const userNiche = niches.find(n => n.id === profile?.niche_id);
  const nicheColor = userNiche?.color || '#002244';

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setTimedOut(false);
      
      // Set timeout after 8s
      const timeoutId = setTimeout(() => {
        if (isLoading) setTimedOut(true);
      }, 8000);
      
      try {
        await withAuthRetry(() => Promise.all([
          fetchPrompts(),
          fetchAreas(),
          fetchPromptTypes()
        ]));
      } catch (error) {
        if (error instanceof TypeError) {
          toast.error('Sem conexão. Verifique a rede e tente novamente.');
        }
        console.error('Error loading prompts:', error);
      }
      
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchPrompts, fetchAreas, fetchPromptTypes, retryCount]);

  const handleRetry = () => {
    setRetryCount(count => count + 1);
  };

  const filteredPrompts = getFilteredPrompts().filter((prompt: Prompt) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      prompt.title.toLowerCase().includes(lowerSearchTerm) ||
      prompt.description.toLowerCase().includes(lowerSearchTerm)
    );
    
    const matchesPremiumFilter = 
      premiumFilter === 'all' ||
      (premiumFilter === 'premium' && prompt.is_premium) ||
      (premiumFilter === 'free' && !prompt.is_premium);
    
    return matchesSearch && matchesPremiumFilter;
  });

  const resetFilters = () => {
    setSelectedArea(null);
    setSelectedType(null);
    setSearchTerm('');
    setPremiumFilter('all');
  };

  const hasActiveFilters = selectedArea || selectedType || searchTerm || premiumFilter !== 'all';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold font-barlow mb-4"
          style={{ color: nicheColor }}
        >
          Explore os Prompts
        </h1>
        <div 
          className="p-6 rounded-lg max-w-3xl"
          style={{ 
            backgroundColor: `${nicheColor}10`,
            borderLeft: `4px solid ${nicheColor}`
          }}
        >
          <p className="text-gray-700 dark:text-gray-200">
          Encontre prompts personalizados para o seu negócio. Todos os prompts são adaptados com as informações do seu perfil.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar prompts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center px-4 py-2 border rounded-lg transition-colors md:w-auto w-full justify-center"
            style={{ 
              backgroundColor: `${nicheColor}10`,
              borderColor: `${nicheColor}30`,
              color: nicheColor
            }}
          >
            {viewMode === 'grid' ? (
              <>
                <List size={20} className="mr-2" />
                Lista
              </>
            ) : (
              <>
                <LayoutGrid size={20} className="mr-2" />
                Grade
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border rounded-lg transition-colors md:w-auto w-full justify-center"
            style={{ 
              backgroundColor: `${nicheColor}10`,
              borderColor: `${nicheColor}30`,
              color: nicheColor
            }}
          >
            <Filter size={20} className="mr-2" />
            Filtros
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors md:w-auto w-full justify-center"
            >
              <X size={18} className="mr-2" />
              Limpar Filtros
            </button>
          )}
        </div>
        
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Área
                </label>
                <select
                  value={selectedArea || ''}
                  onChange={(e) => setSelectedArea(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todas as áreas</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo
                </label>
                <select
                  value={selectedType || ''}
                  onChange={(e) => setSelectedType(e.target.value || null)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos os tipos</option>
                  {promptTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Acesso
                </label>
                <select
                  value={premiumFilter}
                  onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'free' | 'premium')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos os prompts</option>
                  <option value="free">Somente gratuitos</option>
                  <option value="premium">Somente premium</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <PromptSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
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
      ) : filteredPrompts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrompts.map(prompt => (
              <div 
                key={prompt.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={prompt.image_url}
                      alt={prompt.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {prompt.is_premium && (
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded-full flex items-center text-xs font-medium">
                          <Crown size={12} className="mr-1" />
                          Premium
                        </div>
                      )}
                      {prompt.areas && (
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${prompt.areas.color}15`,
                            color: prompt.areas.color 
                          }}
                        >
                          {prompt.areas.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold font-barlow text-gray-800 dark:text-white mb-1 truncate">
                      {prompt.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
                      {prompt.description}
                    </p>
                    <div className="px-2">
                      <button
                        onClick={() => {/* TODO: Add copy functionality */}}
                        className={`w-full text-sm px-4 py-2 rounded-lg transition-colors ${
                          prompt.is_premium && profile?.subscription_status !== 'premium'
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                            : 'bg-blue-900 text-white hover:bg-blue-800'
                        }`}
                      >
                        {prompt.is_premium && profile?.subscription_status !== 'premium' 
                          ? 'Comprar Acesso'
                          : 'Copiar Prompt'
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-2">
            Nenhum prompt encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Tente ajustar seus filtros ou termos de busca.
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PromptList;