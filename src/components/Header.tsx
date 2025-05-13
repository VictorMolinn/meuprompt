import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePromptStore } from '../store/promptStore';
import Button from './ui/Button';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, isAdmin, profile, signOut } = useAuthStore();
  const { niches, fetchNiches } = usePromptStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNiches();
  }, [fetchNiches]);

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center text-2xl font-bold font-barlow"
          onClick={closeMenu}
        >
          <span className="text-blue-900 dark:text-white">EIAIFLIX</span>
          {profile?.niche_id && niches.length > 0 && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="font-medium" style={{ color: niches.find(n => n.id === profile.niche_id)?.color || '#4A5568' }}>
                {niches.find(n => n.id === profile.niche_id)?.display_name}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isAuthenticated && (
            <>
              <Link 
                to="/prompts" 
                className={`font-barlow font-medium transition-colors hover:text-blue-900 dark:hover:text-blue-400 ${
                  location.pathname === '/prompts' 
                    ? 'text-blue-900 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Prompts
              </Link>
              <Link 
                to="/favorites" 
                className={`font-barlow font-medium transition-colors hover:text-blue-900 dark:hover:text-blue-400 ${
                  location.pathname === '/favorites' 
                    ? 'text-blue-900 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Favoritos
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`font-barlow font-medium transition-colors hover:text-blue-900 dark:hover:text-blue-400 ${
                    location.pathname.startsWith('/admin') 
                      ? 'text-blue-900 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
          
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDarkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all">
                <div className="py-2">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Perfil
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">Entrar</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isDarkMode ? "Alternar para modo claro" : "Alternar para modo escuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.full_name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <span className="font-barlow font-medium text-gray-800 dark:text-white">
                      {profile?.full_name || 'Usuário'}
                    </span>
                  </div>
                  
                  <Link 
                    to="/prompts" 
                    className="font-barlow font-medium py-2 transition-colors hover:text-blue-900 dark:hover:text-blue-400"
                    onClick={closeMenu}
                  >
                    Prompts
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="font-barlow font-medium py-2 transition-colors hover:text-blue-900 dark:hover:text-blue-400"
                    onClick={closeMenu}
                  >
                    Favoritos
                  </Link>
                  <Link 
                    to="/profile" 
                    className="font-barlow font-medium py-2 transition-colors hover:text-blue-900 dark:hover:text-blue-400"
                    onClick={closeMenu}
                  >
                    Perfil
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="font-barlow font-medium py-2 transition-colors hover:text-blue-900 dark:hover:text-blue-400"
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center font-barlow font-medium py-2 text-red-600 dark:text-red-400"
                  >
                    <LogOut size={18} className="mr-2" />
                    Sair
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    onClick={closeMenu}
                  >
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={closeMenu}
                  >
                    <Button className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;