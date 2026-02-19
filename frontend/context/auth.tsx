import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface User {
    _id: string;
    userName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (userName: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(sessionStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.get('/users/current-user')
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    sessionStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const login = async (userName: string, password: string) => {
        const res = await api.post('/users/login', { userName, password });
        const accessToken = res.data?.accessToken;
        if (accessToken) {
            sessionStorage.setItem('token', accessToken);
            setToken(accessToken);
            setUser(res.data);
        }
    };

    const logout = async () => {
        try {
            await api.post('/users/logout', {});
        } catch { /* ignore */ }
        sessionStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
