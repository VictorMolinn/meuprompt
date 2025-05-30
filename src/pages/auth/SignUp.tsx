import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';
import { UserPlus, Eye, EyeOff, HelpCircle } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasNumber = /\d/.test(pass);
    const hasLetter = /[a-zA-Z]/.test(pass);
    return { minLength, hasNumber, hasLetter };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isPasswordValid) {
      toast.error('A senha não atende aos requisitos mínimos');
      setIsLoading(false);
      return;
    }

    if (!doPasswordsMatch) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        if (error.message === 'User already registered') {
          toast.error('Este e-mail já está registrado. Por favor, faça login ou use outro e-mail.');
        } else {
          toast.error('Falha ao criar conta. Por favor, tente novamente.');
        }
        return;
      }
      
      toast.success('Conta criada com sucesso!');
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error?.error?.code === 'user_already_exists') {
        toast.error('Este e-mail já está registrado. Por favor, faça login ou use outro e-mail.');
      } else {
        toast.error('Falha ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast.error('Por favor, digite a senha novamente para confirmar');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Criar sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Entrar
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>
              
              <div className="mt-2 space-y-1">
                <p className={`text-xs ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  ✓ Mínimo 8 caracteres
                </p>
                <p className={`text-xs ${passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  ✓ Pelo menos 1 número
                </p>
                <p className={`text-xs ${passwordValidation.hasLetter ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  ✓ Pelo menos 1 letra
                </p>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onPaste={handleConfirmPaste}
                  required
                  placeholder="••••••••"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  As senhas não coincidem
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              'Criar conta'
            )}
          </Button>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center justify-center mx-auto"
            >
              <HelpCircle size={16} className="mr-1" />
              Precisa de ajuda?
            </button>
          </div>
        </form>
        
        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold font-barlow text-gray-800 dark:text-white mb-4">
                Precisa de ajuda?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Se você estiver tendo problemas para criar sua conta, entre em contato conosco:
              </p>
              <p className="text-gray-800 dark:text-white font-medium mb-6">
                suporte@eiaiflix.com.br
              </p>
              <Button
                variant="outline"
                onClick={() => setShowHelp(false)}
                className="w-full"
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