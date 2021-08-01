import React from 'react';
import { Provider as HttpProvider } from 'use-http'
import { useAuth } from './context/auth';
import { useSnackbar } from './context/snackbar';
import { useConfig } from './context/config';
import { EmailContextProvider } from './context/email';

import DashboardPage from './pages/DashboardPage';

import './App.css';

function App() {

  const config = useConfig();
  const snackbar = useSnackbar();
  const auth = useAuth();

  // const refreshInterval = config.get('refreshInterval') || 3600000;
  // useEffect(() => {
  //   console.log('Setting token refresh interval');

  //   const authenticated = auth.getCurrentToken();

  //   console.log('Not authenticated fetching new token', authenticated);
  //   if (!authenticated) {
  //     auth.getToken();
  //   }

  //   const interval = setInterval(async () => {
  //     console.log('Refresh token');
  //     await auth.getToken();
  //   }, parseInt(refreshInterval));

  //   return () => clearInterval(interval);
  // }, [refreshInterval]);

  const options = {
    interceptors: {
      request: async ({ options, headers }) => {
        options.headers['authorization'] = `Bearer ${await auth.getAccessToken()}`;
        options.headers['x-mock-response-code'] = '200';
        return options;
      },
      response: async ({ response }) => {
        if (!response.ok) {
          console.error('Response Error:', response);
          snackbar.error(`${response.details}`);
        }
        return response;
      }
    }
  };

  return (
    <div className="App">
      <EmailContextProvider>
        <HttpProvider url={config.get('endpoint')} options={options}>
          <DashboardPage />
        </HttpProvider>
      </EmailContextProvider>
    </div>
  );
}

export default App;
