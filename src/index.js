import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ConfigContextProvider } from './context/config';
import { AuthContextProvider } from './context/auth';
import { SnackbarContextProvider } from './context/snackbar';

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <SnackbarContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SnackbarContextProvider>
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
