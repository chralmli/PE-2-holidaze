import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    name: string;
    email: string;
    bio?: string;
    avatar?: { url: string; alt: string };
    banner?: { url: string; alt: string };
    accessToken: string;
    venueManager?: boolean;
}

interface AuthContextProps {
    isLoggedIn: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    user: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    // Check localStorage to see if user is already logged in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn:!!user,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;