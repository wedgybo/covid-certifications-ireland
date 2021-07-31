import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider as HttpProvider } from 'use-http'
import { useAuth } from './context/auth';
import { useSnackbar } from './context/snackbar';
import { useConfig } from './context/config';
import { EmailContextProvider } from './context/email';

import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

function App() {

  const config = useConfig();
  const snackbar = useSnackbar();
  const auth = useAuth();

  const options = {
    interceptors: {
      request: async ({ options, headers }) => {
        console.log('asdsdas');
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
          {/* <Router>
            <Switch>
              <Route path="/" component={DashboardPage} />
            </Switch>
          </Router> */}
          <DashboardPage />
        </HttpProvider>
      </EmailContextProvider>
    </div>
  );
}

export default App;
