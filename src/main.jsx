import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#27272A',
            color: '#FAFAFA',
            border: '1px solid #3F3F46',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#FAFAFA' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FAFAFA' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
