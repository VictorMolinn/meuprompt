import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePromptStore } from '../store/promptStore';
import { useAuthStore } from '../store/authStore';
import PromptCard from '../components/PromptCard';
import Button from '../components/ui/Button';
import { ArrowRight, MessageSquare, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { popularPrompts, fetchPopularPrompts } = usePromptStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchPopularPrompts();
  }, [fetchPopularPrompts]);

  const features = [
    {
      icon: <MessageSquare className="w-10 h-10 text-blue-900 mb-4" />,
      title: 'Prompts de Qualidade',
      description: 'Acesse uma biblioteca de prompts de IA curados e testados para seu negócio.'
    },
    {
      icon: <Sparkles className="w-10 h-10 text-blue-900 mb-4" />,
      title: 'Personalização Total',
      description: 'Todos os prompts são personalizados com as informações da sua empresa.'
    },
    {
      icon: <Zap className="w-10 h-10 text-blue-900 mb-4" />,
      title: 'Aumente sua Produtividade',
      description: 'Economize tempo e obtenha melhores resultados com prompts otimizados.'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-barlow text-gray-800 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Prompts de IA Personalizados para o Seu Negócio
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Explore, filtre e copie prompts de IA personalizados para sua empresa. Aumente sua produtividade e obtenha resultados melhores.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to={isAuthenticated ? "/prompts" : "/signup"}>
                <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                  {isAuthenticated ? "Explorar Prompts" : "Começar Agora"}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-barlow text-center text-gray-800 dark:text-white mb-12">
            Por que usar EIAIFLIX?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Prompts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white">
              Prompts Populares
            </h2>
            
            <Link to={isAuthenticated ? "/prompts" : "/signup"}>
              <Button variant="outline" rightIcon={<ArrowRight size={16} />}>
                Ver Todos
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPrompts.length > 0 ? (
              popularPrompts.map(prompt => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt} 
                  isPublic={true} 
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">
                Carregando prompts populares...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-barlow mb-6">
            Pronto para Aumentar sua Produtividade?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão usando EIAIFLIX para melhorar seus resultados com IA.
          </p>
          
          <Link to={isAuthenticated ? "/prompts" : "/signup"}>
            <Button 
              variant="secondary" 
              size="lg"
              rightIcon={<ArrowRight size={16} />}
            >
              {isAuthenticated ? "Explorar Prompts" : "Cadastre-se Gratuitamente"}
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;