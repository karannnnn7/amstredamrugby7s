import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface ConfigContextType {
    config: Record<string, string>;
    isLoading: boolean;
    getBtnText: (key: string, defaultText: string) => string;
    getBtnLink: (key: string, defaultLink: string) => string;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/config')
            .then((res) => {
                if (res.data) {
                    setConfig(res.data);
                }
            })
            .catch(() => {
                console.error("Failed to load generic site config");
            })
            .finally(() => setIsLoading(false));
    }, []);

    const getBtnText = (key: string, defaultText: string) => {
        return config[key] || defaultText;
    };

    const getBtnLink = (key: string, defaultLink: string) => {
        return config[key] || defaultLink;
    };

    return (
        <ConfigContext.Provider value={{ config, isLoading, getBtnText, getBtnLink }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};

export default ConfigContext;
