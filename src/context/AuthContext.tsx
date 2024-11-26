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
    checkAuthStatus: () => boolean;
}

interface AuthContextProps {
    isLoggedIn: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    checkAuthStatus: () => boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    user: null,
    login: () => {},
    logout: () => {},
    checkAuthStatus: () => false,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    // Check localStorage to see if user is already logged in
    const checkAuthStatus = () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (!storedUser || !storedToken) {
            return false;
        }

        try {
            const userData = JSON.parse(storedUser);
            // Add token validation if needed
            return true;
        } catch {
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            return false;
        }
    };

    // Initial auth state
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData); 
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            }
        }
        setIsInitialized(true);
    }, []);

    // Login function
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', userData.accessToken);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn:!!user,
                user,
                login,
                logout,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;