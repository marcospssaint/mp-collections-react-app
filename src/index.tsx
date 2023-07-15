import './css/styles-global.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/auth';

import Routes from './routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <AuthProvider>
        <Routes />
      </AuthProvider>
  </React.StrictMode>
);