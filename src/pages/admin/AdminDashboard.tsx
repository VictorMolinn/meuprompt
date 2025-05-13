import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, Layers, Tag, FileType, Award } from 'lucide-react';

interface StatData {
  users: number;
  prompts: number;
  niches: number;
  areas: number;
  types: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatData>({
    users: 0,
    prompts: 0,
    niches: 0,
    areas: 0,
    types: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      
      try {
        // Load users count
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (usersError) throw usersError;
        
        // Load prompts count
        const { count: promptsCount, error: promptsError } = await supabase
          .from('prompts')
          .select('*', { count: 'exact', head: true });
        
        if (promptsError) throw promptsError;
        
        // Load niches count
        const { count: nichesCount, error: nichesError } = await supabase
          .from('niches')
          .select('*', { count: 'exact', head: true });
        
        if (nichesError) throw nichesError;
        
        // Load areas count
        const { count: areasCount, error: areasError } = await supabase
          .from('areas')
          .select('*', { count: 'exact', head: true });
        
        if (areasError) throw areasError;
        
        // Load types count
        const { count: typesCount, error: typesError } = await supabase
          .from('prompt_types')
          .select('*', { count: 'exact', head: true });
        
        if (typesError) throw typesError;
        
        setStats({
          users: usersCount || 0,
          prompts: promptsCount || 0,
          niches: nichesCount || 0,
          areas: areasCount || 0,
          types: typesCount || 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Usuários',
      value: stats.users,
      icon: <Users className="h-8 w-8 text-blue-900 dark:text-blue-400" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      path: '#'
    },
    {
      title: 'Prompts',
      value: stats.prompts,
      icon: <Layers className="h-8 w-8 text-orange-500 dark:text-orange-400" />,
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      path: '/admin/prompts'
    },
    {
      title: 'Nichos',
      value: stats.niches,
      icon: <Tag className="h-8 w-8 text-green-600 dark:text-green-400" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      path: '/admin/niches'
    },
    {
      title: 'Áreas',
      value: stats.areas,
      icon: <FileType className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      path: '/admin/categories'
    },
    {
      title: 'Tipos de Prompt',
      value: stats.types,
      icon: <Award className="h-8 w-8 text-red-500 dark:text-red-400" />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      path: '/admin/categories'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mb-8">
        Dashboard
      </h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {statCards.map((card, index) => (
              <Link
                key={index}
                to={card.path}
                className={`${card.bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {card.title}
                    </p>
                    <h3 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mt-2">
                      {card.value}
                    </h3>
                  </div>
                  {card.icon}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
                Ações Rápidas
              </h2>
              <div className="space-y-4">
                <Link 
                  to="/admin/prompts/new" 
                  className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Layers className="h-5 w-5 mr-3 text-blue-900 dark:text-blue-400" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    Criar Novo Prompt
                  </span>
                </Link>
                <Link 
                  to="/admin/niches/new" 
                  className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Tag className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    Adicionar Novo Nicho
                  </span>
                </Link>
                <Link 
                  to="/admin/categories" 
                  className="flex items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <FileType className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-gray-800 dark:text-white">
                    Gerenciar Áreas e Tipos
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
                Informações do Sistema
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Versão</span>
                  <span className="font-medium text-gray-800 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Status</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                    Online
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Última atualização</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-300">Admin</span>
                  <span className="font-medium text-gray-800 dark:text-white">eiaiflix@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;