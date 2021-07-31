import React, { createContext, useContext, useState } from 'react';

export const ConfigContext = createContext();

export function ConfigContextProvider({ children }) {


    const savedConfig = JSON.parse(window.localStorage.getItem('config')) || {
        refreshInterval: 3600000,
        emailApiKey: null,
        emailFrom: null,
        emailSubject: null,
        emailText: null,
        endpoint: null,
        clientId: null,
        clientSecret: null,
        testManufacturers: [],
        testCentres: [],
        testTypes: []
    };
    const storedConfig = window.localStorage.getItem('config');
    console.log('Stored config', storedConfig, JSON.parse(storedConfig) || {}, savedConfig);

    const [config, setConfig] = useState(savedConfig);

    const api = {
        config,
        set: (key, value) => {
            const newConfig = { ...config };
            newConfig[key] = value;
            console.log('Setting config', newConfig);
            setConfig(newConfig);
        },
        replace: (config) => {
            window.localStorage.setItem('config', JSON.stringify(config));
            setConfig(config);
        },
        get: (key) => {
            return config[key];
        }
    };

    return (
        <ConfigContext.Provider value={api}>
            {children}
        </ConfigContext.Provider>
    )
}

export function useConfig() {
    return useContext(ConfigContext);
}