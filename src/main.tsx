import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TuitionProvider } from './context/TuitionContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <TuitionProvider>
          <App />
        </TuitionProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
