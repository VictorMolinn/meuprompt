import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, initializeAuth } from './store/authStore';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import MagicLink from './pages/auth/MagicLink';
import Welcome from './pages/onboarding/Welcome';
import Callback from './pages/auth/Callback';
import SetPassword from './pages/auth/SetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import Onboarding from './pages/onboarding/Onboarding';
import OnboardingComplete from './pages/onboarding/OnboardingComplete';
import PromptList from './pages/prompts/PromptList';
import Favorites from './pages/prompts/Favorites';
import Profile from './pages/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPromptList from './pages/admin/prompts/PromptList';
import NicheList from './pages/admin/niches/NicheList';
import CategoryList from './pages/admin/categories/CategoryList';
import TermsOfUse from './pages/legal/TermsOfUse';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';

// Protected Route
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding Check
const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  
  if (profile && !profile.completed_onboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <div className="flex flex-col min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white">
        <Header />
        <div className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/magic-link" element={<MagicLink />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/auth/set-password" element={<SetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/steps" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/complete" element={
              <ProtectedRoute>
                <OnboardingComplete />
              </ProtectedRoute>
            } />
            <Route path="/prompts" element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <PromptList />
                </OnboardingCheck>
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <OnboardingCheck>
                  <Favorites />
                </OnboardingCheck>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="prompts" element={<AdminPromptList />} />
              <Route path="niches" element={<NicheList />} />
              <Route path="categories" element={<CategoryList />} />
            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;