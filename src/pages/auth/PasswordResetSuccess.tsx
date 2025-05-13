import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordResetSuccess: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4"
        >
          <Check className="h-10 w-10 text-green-600 dark:text-green-300" />
        </motion.div>
        
        <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white">
          Senha alterada!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300">
          Sua senha foi atualizada com sucesso. Você já pode fazer login com sua nova senha.
        </p>
        
        <Link to="/login">
          <Button className="w-full" rightIcon={<ArrowRight size={16} />}>
            Fazer Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;