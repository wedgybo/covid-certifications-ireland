import React, { createContext, useContext } from 'react';
import SendGrid from '@sendgrid/mail';
import { useConfig } from './config';

export const EmailContext = createContext();

export function EmailContextProvider({ children }) {
    const config = useConfig();

    const api = {
        client: SendGrid,
        send: async (msg) => {
            const apiKey = config.get('emailApiKey');
            SendGrid.setApiKey(apiKey);

            if (!apiKey) {
                throw new Error('No SendGrid API Key set');
            }

            const from = config.get('emailFrom');

            if (!from) {
                throw new Error('No from address set in the settings');
            }

            msg.from = from;

            try {
                const response = await SendGrid.send(msg);
                return response;
            } catch (error) {
                console.log('Email error', error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        }
    };

    return (
        <EmailContext.Provider value={api}>
            {children}
        </EmailContext.Provider>
    )
}

export function useEmail() {
    return useContext(EmailContext);
}