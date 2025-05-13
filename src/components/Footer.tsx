import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link 
              to="/" 
              className="text-2xl font-bold font-barlow text-blue-900 dark:text-white"
            >
              EIAIFLIX
            </Link>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              Explore, filtre e copie prompts de IA personalizados para o seu negócio.
              Melhore sua produtividade com prompts de qualidade.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://instagram.com/eiaiflix" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com/eiaiflix" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://youtube.com/@eiaiflix" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 font-barlow text-gray-800 dark:text-white">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setShowContact(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                >
                  Contato
                </button>
              </li>
              <li>
                <Link 
                  to="/prompts" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                >
                  Prompts
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 font-barlow text-gray-800 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>© {currentYear} EIAIFLIX. Todos os direitos reservados.</p>
        </div>
      </div>
      
      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
              Precisa de ajuda?
            </h3>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="text-blue-600 dark:text-blue-400" size={20} />
              <p className="text-gray-800 dark:text-white font-medium">
                suporte@eiaiflix.com.br
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Nossa equipe vai responder rapidinho!
            </p>
            <button
              onClick={() => setShowContact(false)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;