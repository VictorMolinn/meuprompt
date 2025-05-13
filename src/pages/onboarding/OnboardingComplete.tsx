import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import TutorialCard from '../../components/TutorialCard';
import { Check, Copy, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4"
          >
            <Check className="h-10 w-10 text-green-600 dark:text-green-300" />
          </motion.div>
          
          <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white">
            Parabéns!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Seu perfil foi configurado com sucesso. Agora você está pronto para usar os prompts personalizados.
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold font-barlow text-gray-800 dark:text-white">
            Como usar os prompts
          </h2>
          
          <TutorialCard
            title="Use prompts personalizados"
            description="Todos os prompts da plataforma são personalizados com os dados do seu perfil. Isso significa que eles são adaptados para a sua empresa."
          />
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-barlow font-medium text-gray-800 dark:text-white mb-2">
              Exemplo de Prompt
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md font-mono text-sm mb-4">
              <p className="mb-2">Prompt original:</p>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                "Crie 10 nomes para o meu [PRODUTO] feito pela [EMPRESA] que combina com o meu [TOM DE VOZ]"
              </div>
              
              <p className="mt-4 mb-2">Após personalização:</p>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                "Crie 10 nomes para o meu sorvete feito pela Sorveteria da Alegria que combina com o meu tom mineiro divertido"
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm">
                <Copy size={16} className="mr-1 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400">
                  1. Copie o prompt
                </span>
              </div>
              
              <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
              
              <div className="flex items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  2. Cole no ChatGPT
                </span>
              </div>
              
              <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
              
              <div className="flex items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  3. Obtenha resultados
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => navigate('/prompts')}
          className="w-full"
          rightIcon={<ChevronRight size={16} />}
        >
          Começar a Explorar os Prompts
        </Button>
      </div>
    </div>
  );
};

export default OnboardingComplete;