import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const PasswordResetSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Senha alterada com sucesso!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/login">
            <Button>
              Ir para o login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;