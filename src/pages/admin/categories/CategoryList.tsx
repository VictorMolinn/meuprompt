import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { toast } from 'sonner';
import type { Area, PromptType } from '../../../types';

const CategoryList: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [types, setTypes] = useState<PromptType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAreas(), fetchTypes()]).finally(() => setIsLoading(false));
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .order('name');

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error('Erro ao carregar áreas');
    }
  };

  const fetchTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error('Error fetching types:', error);
      toast.error('Erro ao carregar tipos');
    }
  };

  const handleDeleteArea = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta área?')) return;

    try {
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAreas(areas.filter(area => area.id !== id));
      toast.success('Área excluída com sucesso');
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error('Erro ao excluir área');
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tipo?')) return;

    try {
      const { error } = await supabase
        .from('prompt_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTypes(types.filter(type => type.id !== id));
      toast.success('Tipo excluído com sucesso');
    } catch (error) {
      console.error('Error deleting type:', error);
      toast.error('Erro ao excluir tipo');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Areas Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-barlow">Áreas</h2>
          <Button leftIcon={<Plus size={16} />}>
            Nova Área
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.map((area) => (
            <div 
              key={area.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: area.color }}
                />
                <span className="font-medium text-gray-900 dark:text-white">
                  {area.name}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  onClick={() => {/* TODO: Implement edit */}}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  onClick={() => handleDeleteArea(area.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-barlow">Tipos de Prompt</h2>
          <Button leftIcon={<Plus size={16} />}>
            Novo Tipo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((type) => (
            <div 
              key={type.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {type.name}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 text-blue-900 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  onClick={() => {/* TODO: Implement edit */}}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  onClick={() => handleDeleteType(type.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryList;