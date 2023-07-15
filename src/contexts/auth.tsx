import React, { createContext, useContext, useState } from 'react';

import * as api from '../services/api';

interface AuthContextData {
    signed: boolean;
    user: object | null;
    login(user: object): Promise<void>;
    logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<object | null>(null);

    async function login(userData: object) {
        const response = (await api.post(userData));
        setUser(response.data.user);
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: Boolean(user), user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

export default AuthContext;