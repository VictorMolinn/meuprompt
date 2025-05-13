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
    async function handleRecoverySession() {
      try {
        // Verifica fragmento de sessão no URL
        if (!window.location.hash.includes('access_token')) {
          toast.error('Token de recuperação não encontrado.');
          navigate('/login', { replace: true });
          return;
        }

        // Extrai e persiste a sessão
        const {
          data: { session },
          error,
        } = await supabase.auth.getSessionFromUrl({ storeSession: true });

        if (error) {
          console.error('Erro ao obter sessão de recuperação:', error.message);
          toast.error('Falha ao processar link de recuperação.');
          navigate('/login', { replace: true });
          return;
        }
        if (!session) {
          toast.error('Sessão inválida. Por favor, gere um novo link.');
          navigate('/login', { replace: true });
          return;
        }

        // Limpa hash da URL e mostra o formulário
        window.history.replaceState({}, document.title, '/auth/set-password');
        setIsVerifying(false);
      } catch (err: any) {
        console.error('Erro inesperado no callback de recuperação:', err.message);
        toast.error('Erro inesperado. Tente novamente mais tarde.');
        navigate('/login', { replace: true });
      }
    }

    handleRecoverySession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password.length < 8) {
        toast.error('A senha deve ter pelo menos 8 caracteres.');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.error('Erro ao atualizar senha:', error.message);
        toast.error('Falha ao redefinir senha: ' + error.message);
        return;
      }

      toast.success('Senha redefinida com sucesso! Redirecionando ao login...');
      navigate('/auth/password-reset-success', { replace: true });
    } catch (err: any) {
      console.error('Erro inesperado ao submeter nova senha:', err.message);
      toast.error('Erro ao redefinir senha. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900" />
      </div>
    );
  }

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
            Nova senha (mínimo 8 caracteres)
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
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            'Redefinir senha'
          )}
        </Button>
      </form>
    </div>
  );
}
