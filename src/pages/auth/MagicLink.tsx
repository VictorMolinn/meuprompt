import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';
import { Mail, ArrowLeft, HelpCircle } from 'lucide-react';

export default function MagicLink() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // use só o domínio base, ou o path que seu Router atende (/callback):
          emailRedirectTo: `${window.location.origin}`,
          // ou: emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;
      
      setIsSent(true);
      toast.success('Link mágico enviado com sucesso!');
    } catch (error) {
      toast.error('Falha ao enviar o link mágico. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <Mail className="mx-auto h-12 w-12 text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Link mágico enviado!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Verifique sua caixa de entrada (ou o spam) e clique no botão pra entrar direto na plataforma.
          </p>
          <div className="pt-4">
            <Link to="/login">
              <Button variant="outline" className="w-full" leftIcon={<ArrowLeft size={16} />}>
                Voltar para login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Entrar com link mágico
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Digite seu e-mail e receba um link seguro para acessar sua conta sem precisar de senha.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="exemplo@seuemail.com"
              leftIcon={<Mail size={18} />}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              'Enviar link mágico'
            )}
          </Button>

          <div className="text-center space-y-4">
            <Link 
              to="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Voltar para login
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dica: o link mágico é a forma mais rápida e segura de acessar sua conta sem precisar decorar senhas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center justify-center mx-auto"
            >
              <HelpCircle size={16} className="mr-1" />
              Não recebeu o e-mail?
            </button>
          </div>
        </form>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
                Não recebeu o e-mail?
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>Algumas dicas:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verifique sua pasta de spam/lixo eletrônico</li>
                  <li>Confirme se o e-mail foi digitado corretamente</li>
                  <li>Aguarde alguns minutos e tente novamente</li>
                </ul>
                <p>
                  Se ainda estiver com problemas, entre em contato:
                  <br />
                  <span className="font-medium text-gray-800 dark:text-white">
                    suporte@eiaiflix.com.br
                  </span>
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowHelp(false)}
                className="w-full mt-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
