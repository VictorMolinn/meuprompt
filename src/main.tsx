import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize auth before rendering
import { initializeAuth } from './store/authStore';

// Wait for auth to initialize before rendering
initializeAuth().then(() => {
  const root = document.getElementById('root');
  if (!root) throw new Error('Root element not found');
  
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});