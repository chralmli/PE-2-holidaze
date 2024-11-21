/**
 * Login.tsx
 * 
 * A component for user login. This allows users to enter their email and password credentials and gain access to their account.
 */

import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Login Component
 * 
 * A React functional component that renders a login form. Users provide their email and password credentials to authenticate
 * and access their account. After a successful login, the user is redirected to the Venues page.
 * 
 * @component
 * @returns {React.FC} - A login form to authenticate users.
 */
const Login: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const { login } = useAuth();

    const navigate = useNavigate();

    /**
     * Handles the user login process.
     * 
     * Sends a request to the server with user credentials (email and password). If the login is successful,
     * saves user data using the AuthContext and redirects the user to the venues page.
     * 
     * @async
     * @function
     * @returns {Promise<void>} - The result of the login process or sets an error if something goes wrong.
     */
    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            if (response.status === 200) {
                const { data } = response.data;
                console.log('User logged in', data);
                login(data);
                navigate('/venues')
            }
        } catch (error) {
            setErrorMessage('Invalid email or password. Please try again.');
        }
    };

    return (
        <Container
            maxWidth="xs"
            sx={{
                marginTop: '8rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 8rem - 64px)',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>Login</Typography>
            {errorMessage && (
                <Typography variant="body2" color="error">
                    {errorMessage}
                </Typography>
            )}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 2,
                    marginTop: 2,
                }}
            >
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    type="email"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    value={password}
                    type="password"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin} variant="contained" color="primary" sx={{ mt: 2 }}>Login</Button>
            </Box>
        </Container>
    );
};

export default Login;