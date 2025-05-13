import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';

export default function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    async function handleRecoveryCallback() {
      // Só continua se o hash tiver access_token e type=recovery
      if (!window.location.hash.includes('type=recovery')) {
        navigate('/login', { replace: true });
        return;
      }

      // Extrai a sessão de recovery e persiste
      const {
        data: { session },
        error,
      } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error || !session) {
        console.error('Erro no recovery callback:', error);
        toast.error('Link de recuperação inválido ou expirado.');
        navigate('/login', { replace: true });
        return;
      }

      // Limpamos o hash da URL para não expor tokens
      window.history.replaceState({}, document.title, '/auth/set-password');
      setIsVerifying(false);
    }

    handleRecoveryCallback();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Atualiza a senha do usuário já autenticado em recovery
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success('Senha redefinida com sucesso!');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Falha ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enquanto verifica, mostramos spinner
  if (isVerifying) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Form de redefinição
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Redefinir senha
        </h2>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nova senha
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
            placeholder="Digite sua nova senha"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            'Redefinir senha'
          )}
        </Button>
      </form>
    </div>
  );
}
