import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePromptStore } from '../store/promptStore';
import { supabase } from '../lib/supabase';
import StarRating from './ui/StarRating';
import Button from './ui/Button';
import { Heart, Copy, Lock, Tag, FileType, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { Prompt, CustomField } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  isPublic?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, isPublic = false }) => {
  const { isAuthenticated, user, profile } = useAuthStore();
  const { toggleFavorite, ratePrompt } = usePromptStore();
  const [isFavorite, setIsFavorite] = useState(prompt.favorite || false);
  const [rating, setRating] = useState(prompt.rating || 0);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [references, setReferences] = useState<Record<string, string>>({});

  useEffect(() => {
    // Find all reference placeholders in the content
    const refMatches = prompt.content.match(/\[(.*?)\]/g);
    if (refMatches) {
      const refNames = refMatches
        .map(match => match.slice(1, -1))
        .filter(name => !['EMPRESA', 'TOM DE VOZ', 'DESCRIÇÃO'].includes(name));

      if (refNames.length > 0) {
        // Fetch references from the database
        const fetchReferences = async () => {
          const { data, error } = await supabase
            .from('prompt_references')
            .select('name, content')
            .in('name', refNames);

          if (!error && data) {
            const refMap = data.reduce((acc, ref) => ({
              ...acc,
              [ref.name]: ref.content
            }), {});
            setReferences(refMap);
          }
        };

        fetchReferences();
      }
    }
  }, [prompt.content]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para favoritar prompts');
      return;
    }
    
    setIsFavorite(!isFavorite);
    await toggleFavorite(prompt.id, user.id);
    toast.success(isFavorite ? 'Prompt removido dos favoritos' : 'Prompt adicionado aos favoritos');
  };

  const handleRate = async (newRating: number) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para avaliar prompts');
      return;
    }
    
    setRating(newRating);
    await ratePrompt(prompt.id, user.id, newRating);
    toast.success('Avaliação enviada com sucesso!');
  };

  const handleCopyPrompt = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Você precisa estar logado para copiar prompts');
      return;
    }
    
    if (prompt.is_premium && profile?.subscription_status !== 'premium') {
      toast.error('Este prompt é exclusivo para assinantes premium');
      return;
    }
    
    if (prompt.has_custom_fields && prompt.custom_fields?.length) {
      // Open custom fields modal
      setShowCustomFields(true);
      return;
    }
    
    // If no custom fields, just copy the prompt
    copyToClipboard();
  };

  const handleCustomFieldChange = (name: string, value: string) => {
    setCustomValues(prev => ({ ...prev, [name]: value }));
  };

  const copyWithCustomFields = () => {
    // Validate all required fields are filled
    const requiredFields = prompt.custom_fields?.filter(field => field.required) || [];
    const missingFields = requiredFields.filter(field => !customValues[field.name]);
    
    if (missingFields.length > 0) {
      toast.error(`Por favor, preencha todos os campos obrigatórios: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    copyToClipboard();
    setShowCustomFields(false);
  };

  const copyToClipboard = () => {
    let processedContent = prompt.content;
    
    // Replace references first
    Object.entries(references).forEach(([name, content]) => {
      processedContent = processedContent.replace(`[${name}]`, content);
    });
    
    // Replace custom fields
    if (prompt.custom_fields?.length) {
      prompt.custom_fields.forEach(field => {
        const value = customValues[field.name] || '';
        processedContent = processedContent.replace(`[${field.name}]`, value);
      });
    }
    
    // Replace user profile data
    if (profile) {
      processedContent = processedContent
        .replace(/\[EMPRESA\]/g, profile.company_name || '')
        .replace(/\[TOM DE VOZ\]/g, profile.brand_voice || '')
        .replace(/\[DESCRIÇÃO\]/g, profile.company_description || '');
    }
    
    navigator.clipboard.writeText(processedContent);
    toast.success('Prompt copiado para a área de transferência!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Card Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={prompt.image_url || 'https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg'}
          alt={prompt.title}
          className={`w-full h-full object-cover transition-transform hover:scale-105 duration-300 ${
            prompt.is_premium && profile?.subscription_status !== 'premium' ? 'grayscale' : ''
          }`}
        />
        
        {prompt.is_premium && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full flex items-center text-sm font-medium shadow-lg">
            <Crown size={16} className="mr-1" />
            Premium
          </div>
        )}
        
        {/* Auth Overlay for public pages */}
        {isPublic && !isAuthenticated && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center p-4 text-center">
            <Lock className="text-white mb-2" size={24} />
            <p className="text-white font-barlow font-medium">
              Faça login para desbloquear este prompt
            </p>
          </div>
        )}
        
        {/* Favorite Button */}
        {isAuthenticated && !isPublic && (
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 ${
              isFavorite ? 'scale-110' : 'scale-100'
            }`}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart 
              size={20} 
              className={`transition-colors duration-300 ${
                isFavorite 
                  ? "fill-red-500 text-red-500 transform scale-100" 
                  : "text-gray-600 dark:text-gray-400 group-hover:text-red-500"
              }`}
            />
          </button>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-2">
          {prompt.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {prompt.areas && (
            <span 
              className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: `${prompt.areas.color}15`,
                color: prompt.areas.color 
              }}
            >
              <Tag size={14} className="mr-1.5" />
              {prompt.areas.name}
            </span>
          )}
          
          {prompt.prompt_types && (
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-800 dark:text-gray-200 transition-all duration-200 hover:shadow-md">
              <FileType size={14} className="mr-1.5 text-gray-500 dark:text-gray-400" />
              {prompt.prompt_types.name}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {prompt.description}
        </p>
        
        {/* Ratings */}
        {!isPublic && (
          <div className="flex items-center mb-4">
            <StarRating 
              initialRating={rating} 
              onChange={handleRate} 
              readOnly={!isAuthenticated}
            />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {prompt.averageRating ? `${prompt.averageRating.toFixed(1)}/5` : 'Sem avaliações'}
            </span>
          </div>
        )}
        
        {/* Copy Button */}
        {(!isPublic || isAuthenticated) && (
          <Button
            onClick={handleCopyPrompt}
            variant={prompt.is_premium && profile?.subscription_status !== 'premium' ? 'premium' : 'primary'}
            className={`w-full ${prompt.is_premium && profile?.subscription_status !== 'premium' ? 'hover:scale-105 transition-transform' : ''}`}
            leftIcon={prompt.is_premium && profile?.subscription_status !== 'premium' ? <Crown size={16} /> : <Copy size={16} />}
          >
            {prompt.is_premium && profile?.subscription_status !== 'premium' 
              ? 'Comprar Acesso'
              : 'Copiar Prompt'
            }
          </Button>
        )}
      </div>
      
      {/* Custom Fields Modal */}
      {showCustomFields && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
              Personalizar Prompt
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Preencha os campos abaixo para personalizar seu prompt:
            </p>
            
            <div className="space-y-4 mb-4">
              {prompt.custom_fields?.map((field: CustomField) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={customValues[field.name] || ''}
                    onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-900 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCustomFields(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={copyWithCustomFields}
                className="flex-1"
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PromptCard;