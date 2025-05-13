import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { usePromptStore } from '../../store/promptStore';
import { supabase } from '../../lib/supabase';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import TutorialCard from '../../components/TutorialCard';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { OnboardingFormData, Niche } from '../../types';

const TOTAL_STEPS = 5;

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    full_name: '',
    company_name: '',
    company_description: '',
    brand_voice: '',
    niche_id: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, getProfile } = useAuthStore();
  const { niches, fetchNiches } = usePromptStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNiches();
  }, [fetchNiches]);

  const validateCurrentStep = () => {
    let stepErrors: Record<string, string> = {};
    let isValid = true;

    switch (step) {
      case 1:
        if (!formData.full_name || formData.full_name.length < 2) {
          stepErrors.full_name = 'Nome completo deve ter no mínimo 2 caracteres';
          isValid = false;
        }
        break;
      case 2:
        if (!formData.company_name || formData.company_name.length < 2) {
          stepErrors.company_name = 'Nome da empresa deve ter no mínimo 2 caracteres';
          isValid = false;
        }
        break;
      case 3:
        if (!formData.company_description || formData.company_description.length < 10) {
          stepErrors.company_description = 'Descrição da empresa deve ter no mínimo 10 caracteres';
          isValid = false;
        }
        break;
      case 4:
        if (!formData.brand_voice || formData.brand_voice.length < 10) {
          stepErrors.brand_voice = 'Tom de voz da marca deve ter no mínimo 10 caracteres';
          isValid = false;
        }
        break;
      case 5:
        if (!formData.niche_id) {
          stepErrors.niche_id = 'Selecione um nicho de atuação';
          isValid = false;
        }
        break;
    }

    setErrors(stepErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          completed_onboarding: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await getProfile();
      toast.success('Perfil atualizado com sucesso!');
      navigate('/onboarding/complete');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ocorreu um erro ao salvar seu perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold font-barlow mb-6">
              Qual é o seu nome completo?
            </h2>            
            
            <Input
              label="Nome Completo"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              error={errors.full_name}
              autoFocus
            />
            
            <TutorialCard
              title="Por que precisamos do seu nome?"
              description="Seu nome será usado para personalizar sua experiência na plataforma."
              example="Ex: João Silva"
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold font-barlow mb-6">
              Qual é o nome da sua empresa?
            </h2>
            
            <Input
              label="Nome da Empresa"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Digite o nome da sua empresa"
              error={errors.company_name}
              autoFocus
            />
            
            <TutorialCard
              title="Por que precisamos do nome da empresa?"
              description="O nome da sua empresa será inserido automaticamente nos prompts para personalização."
              example="Ex: Sorveteria da Alegria"
            />
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold font-barlow mb-6">
              Descreva sua empresa
            </h2>
            
            <div className="w-full">
              <label className="block mb-1 font-barlow font-medium text-gray-700 dark:text-gray-300">
                Descrição da Empresa
              </label>
              <textarea
                name="company_description"
                value={formData.company_description}
                onChange={handleChange}
                placeholder="Descreva sua empresa, o que faz, para quem, etc."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-32"
                autoFocus
              />
              {errors.company_description && (
                <p className="mt-1 text-sm text-red-500">{errors.company_description}</p>
              )}
            </div>
            
            <TutorialCard
              title="Como descrever sua empresa?"
              description="Uma boa descrição ajuda a IA a entender melhor o seu negócio e gerar conteúdo mais relevante."
              example="Ex: A Sorveteria da Alegria é uma empresa familiar que produz sorvetes artesanais desde 1995, utilizando apenas ingredientes naturais e receitas tradicionais."
            />
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold font-barlow mb-6">
              Qual é o tom de voz da sua marca?
            </h2>
            
            <div className="w-full">
              <label className="block mb-1 font-barlow font-medium text-gray-700 dark:text-gray-300">
                Tom de Voz da Marca
              </label>
              <textarea
                name="brand_voice"
                value={formData.brand_voice}
                onChange={handleChange}
                placeholder="Descreva como sua marca se comunica (formal, informal, divertida, técnica, etc.)"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white min-h-32"
                autoFocus
              />
              {errors.brand_voice && (
                <p className="mt-1 text-sm text-red-500">{errors.brand_voice}</p>
              )}
            </div>
            
            <TutorialCard
              title="O que é tom de voz da marca?"
              description="O tom de voz representa a personalidade da sua marca na comunicação com o público."
              example="Ex: Divertido e informal, usando linguagem simples e descontraída, com pitadas de humor regional mineiro."
            />
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold font-barlow mb-6">
              Qual é o nicho de atuação da sua empresa?
            </h2>
            
            <div className="w-full">
              <label className="block mb-1 font-barlow font-medium text-gray-700 dark:text-gray-300">
                Nicho de Atuação
              </label>
              <select
                name="niche_id"
                value={formData.niche_id || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-900 focus:ring-blue-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Selecione um nicho</option>
                {niches.map((niche: Niche) => (
                  <option key={niche.id} value={niche.id}>
                    {niche.name}
                  </option>
                ))}
              </select>
              {errors.niche_id && (
                <p className="mt-1 text-sm text-red-500">{errors.niche_id}</p>
              )}
            </div>
            
            {niches.length === 0 && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Carregando opções de nichos...
              </p>
            )}
            
            <TutorialCard
              title="Por que selecionar um nicho?"
              description="Seu nicho de atuação ajuda a plataforma a sugerir prompts mais relevantes para o seu negócio."
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white">
              {step === TOTAL_STEPS ? 'Último Passo' : 'Configure seu Perfil'}
            </h1>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Passo {step} de {TOTAL_STEPS}
            </span>
          </div>
          
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>
        
        <div className="space-y-6 mb-8">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1 || isLoading}
            leftIcon={<ArrowLeft size={16} />}
          >
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            isLoading={isLoading}
            rightIcon={step < TOTAL_STEPS ? <ArrowRight size={16} /> : <Check size={16} />}
          >
            {step < TOTAL_STEPS ? 'Próximo' : 'Concluir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;