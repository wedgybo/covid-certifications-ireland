import React, { createContext, useContext, useEffect, useState } from 'react';
import useFetch from 'use-http';
import { useSnackbar } from './snackbar';
import { useConfig } from './config';

function useAuthApi() {
  const [endpoint, setEndpoint] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const config = useConfig();

  const { request, response } = useFetch(config.get('endpoint'));
  const snackbar = useSnackbar();

  const tokenEndpoint = useFetch(`${config.get('endpoint')}/token/`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-mock-response-code': '200'
    }
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      await getToken();
    }, parseInt(config.get('refreshInterval')) || 3600000);
    return () => clearInterval(interval);
  }, [getToken]);

  async function getCurrentToken() {

    let currentToken;

    try {
      currentToken = window.localStorage.getItem('token')

      setToken(currentToken);
    } catch (error) {
      console.log('No current user');
    }

    console.log('Token', currentToken);
    setReady(true);
  }

  async function healthCheck() {
    const health = await request.get('/health-check/');

    if (response.ok) {
      console.log('Health check', health);
      snackbar.success('Service is healthy');
    } else {
      console.log('Error', health)
      snackbar.warning('Health check failed')
    }

    return health;
  }

  async function authCheck() {
    const auth = await request.get('/auth');

    if (response.ok) {
      console.log('Auth check', auth);
      snackbar.success('Credentials authenticated');
    } else {
      console.log('Error', auth)
      snackbar.error('Credentials invalid')
    }

    return auth;
  }

  async function getAccessToken() {
    if (!token?.access_token) {
      try {
        console.log('Get new token');
        const newToken = await getToken();
        return newToken.access_token;
      } catch (error) {
        console.log('Could not get an access token');
      }
    }
    console.log('Returning access token', token.access_token);
    return token.access_token;
  }

  async function getToken() {

    const formData = new FormData();
    formData.append('client_id', config.get('clientId'));
    formData.append('client_secret', config.get('clientSecret'));

    const credentials = {
      client_id: config.get('clientId'),
      client_secret: config.get('clientSecret'),
    };

    var formBody = [];
    for (var property in credentials) {
      var encodedKey = property;
      var encodedValue = credentials[property];
      formBody.push(encodedKey + "=" + encodedValue);
    }

    const body = formBody.join("&");
    console.log('Body', body, formData);

    let token;

    try {

      const tokenResponse = await fetch(`${config.get('endpoint')}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      token = await tokenResponse.json();

      setToken(token);
      snackbar.success('Token request accepted');
    } catch (error) {
      console.log('Error', token);
      snackbar.error('Token request failed');
    }

    return token;
  }

  async function getTokenJson() {

    const credentials = {
      client_id: config.get('clientId'),
      client_secret: config.get('clientSecret'),
    };

    const token = await request.post('/token/', credentials);


    if (response.ok) {
      console.log('Token', token);
      setToken(token);
      snackbar.success('Token is healthy');
    } else {
      console.log('Error', token);
      snackbar.error('Token request failed');
    }

    return token;
  }

  useEffect(() => {


    getCurrentToken();
  }, []);

  return {
    token,
    ready,
    endpoint,
    setEndpoint,
    healthCheck,
    authCheck,
    getToken,
    getTokenJson,
    getAccessToken,
  };
};

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const auth = useAuthApi();
  return (auth.ready && <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>);
}

export function useAuth() {
  return useContext(AuthContext);
}
