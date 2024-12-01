import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';


interface User {
    name: string;
    email: string;
    bio?: string;
    avatar?: { url: string; alt: string };
    banner?: { url: string; alt: string };
    accessToken: string;
    venueManager: boolean;
}

interface AuthContextProps {
    isLoggedIn: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    checkAuthStatus: () => boolean;
    isInitialized?: boolean;
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

    // Initial auth state
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                userData.venueManager = !!userData.venueManager;
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
        const updatedUserData = {
            ...userData,
            venueManager: !!userData.venueManager,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        localStorage.setItem('accessToken', updatedUserData.accessToken);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const checkAuthStatus = () => {
        const token = localStorage.getItem('accessToken');
        return !!user || !!token;
    }

    if (!isInitialized) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn:!!user,
                user,
                login,
                logout,
                checkAuthStatus,
                isInitialized,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;