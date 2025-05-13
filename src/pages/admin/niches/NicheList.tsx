import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { toast } from 'sonner';
import type { Niche } from '../../../types';

const NicheList: React.FC = () => {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNiches();
  }, []);

  const fetchNiches = async () => {
    try {
      const { data, error } = await supabase
        .from('niches')
        .select('*')
        .order('name');

      if (error) throw error;
      setNiches(data || []);
    } catch (error) {
      console.error('Error fetching niches:', error);
      toast.error('Erro ao carregar nichos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este nicho?')) return;

    try {
      const { error } = await supabase
        .from('niches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNiches(niches.filter(niche => niche.id !== id));
      toast.success('Nicho excluído com sucesso');
    } catch (error) {
      console.error('Error deleting niche:', error);
      toast.error('Erro ao excluir nicho');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-barlow">Nichos</h2>
        <Button leftIcon={<Plus size={16} />}>
          Novo Nicho
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {niches.map((niche) => (
            <div 
              key={niche.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <img 
                src={niche.image_url} 
                alt={niche.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold font-barlow text-gray-900 dark:text-white mb-2">
                  {niche.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {niche.description}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="p-2 text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    onClick={() => {/* TODO: Implement edit */}}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    onClick={() => handleDelete(niche.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NicheList;