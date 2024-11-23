/**
 * Login.tsx
 * 
 * A component for user login. This allows users to enter their email and password credentials and gain access to their account.
 */

import React from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, Alert, Divider, Link as MuiLink } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LoginOutlined } from '@mui/icons-material';

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

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                pt: { xs: 8, md: 12 },
                pb: 8,
                minHeight: 'calc(100vh - 64px)',
            }}
        >
            <Grid container spacing={4} justifyContent="center">
                {/* Left side */}
                <Grid item xs={12} md={4} lg={4}
                    sx={{
                        display: { xs: 'none', md: 'block' }
                    }}
                >
                    <Box
                        sx={{
                            position: 'sticky',
                            top: '100px',
                            p: 4,
                        }}
                    >
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 3
                            }}
                        >
                            Welcome back!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Sign in to your account
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Access your bookings, manage your venues, and continue exploring amazing destinations.
                        </Typography>
                        <Divider sx={{ my: 4 }} />
                        <Box>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                                New to Holidaze?
                            </Typography>
                            <Button
                                component={Link}
                                to="/register"
                                variant="outlined"
                                color="primary"
                                fullWidth
                            >
                                Create an account
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Right side - Login form */}
                <Grid item xs={12} sm={8} md={7} lg={6}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'grey.100',
                        }}
                    >
                        <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography variant="h4" gutterBottom>
                                Login
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Please enter your credentials to coninue
                            </Typography>
                        </Box>

                        {errorMessage && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3, borderRadius: '12px' }}
                                onClose={() => setErrorMessage(null)}
                            >
                                {errorMessage}
                            </Alert>
                        )}

                        <Box
                            component="form"
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}
                        >
                            <TextField
                                label="Email"
                                value={email}
                                type="email"
                                fullWidth
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoComplete="email"
                                data-testid="login-email"
                                helperText="Use your @stud.noroff.no email"
                            />
                            <TextField
                                label="Password"
                                value={password}
                                type="password"
                                fullWidth
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoComplete="current-password"
                                data-testid="login-password"
                            />

                            <Button
                                onClick={handleLogin}
                                variant="contained"
                                color="gradient"
                                size="large"
                                fullWidth
                                startIcon={<LoginOutlined />}
                                data-testid="login-submit"
                                sx={{ mt: 2 }}
                            >
                                Sign in
                            </Button>

                            {/* Mobile version - Register link */}
                            <Box sx={{
                                display: { xs: 'flex', md: 'none' },
                                justifyContent: 'center',
                                mt: 2
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    New to Holidaze?{' '}
                                    <MuiLink
                                     component={Link}
                                     to="register"
                                     sx={{
                                        fontWeight: 500,
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                     }}
                                    >
                                        Create an account
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Login;