import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Check } from 'lucide-react';

const PasswordResetSuccess: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <div className="mx-auto bg-green-100 dark:bg-green-900/30 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        
        <h2 className="text-2xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
          Senha alterada com sucesso!
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
        </p>
        
        <Link to="/login">
          <Button className="w-full">
            Ir para o login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;