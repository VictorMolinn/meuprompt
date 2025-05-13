import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Sparkles, Settings } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mb-6">
            👋 Boas-vindas à EIAIFLIX!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Antes de liberar sua área de criação, vamos fazer um onboarding rapidinho.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Isso vai nos ajudar a personalizar sua experiência com prompts feitos sob medida pra você.
              </p>
            </div>
            
            <div className="flex items-center text-left p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200">
                Leva menos de 1 minutinho, prometo.
              </p>
            </div>
            
            <div className="flex items-center text-left p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Você terá acesso a prompts personalizados para o seu negócio.
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/onboarding/steps')}
            className="w-full"
            rightIcon={<ArrowRight size={16} />}
          >
            Vamos nessa!
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;