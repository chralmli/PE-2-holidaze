/**
 * Login.tsx
 * 
 * A component that handles user authentication and profile data fetching.
 * It provides a form interface for users to log in using their Noroff student credentials.
 */

import React from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, Alert, Divider, Link as MuiLink } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LoginOutlined } from '@mui/icons-material';

/**
 * Interface representing the expected response structure from the login API endpoint.
 * @interface LoginResponse
 * @property {Object} data - The response data object
 * @property {string} data.name - User's username
 * @property {string} data.email - User's email address
 * @property {string} data.accessToken - Authentication token for subsequent API requests
 * @property {boolean} data.venueManager - User's venue manager status
 * @property {Object} [data.avatar] - User's avatar information (optional)
 * @property {string} data.avatar.url - URL of the avatar image
 * @property {string} data.avatar.alt - Alternative text for the avatar
 * @property {Object} [data.banner] - User's banner information (optional)
 * @property {string} data.banner.url - URL of the banner image
 * @property {string} data.banner.alt - Alternative text for the banner
 * @property {string} [data.bio] - User's biography (optional)
 */
interface LoginResponse {
    data: {
        name: string;
        email: string;
        accessToken: string;
        venueManager: boolean;
        avatar?: { url: string; alt: string };
        banner?: { url: string; alt: string };
        bio?: string;
    };
}

/**
 * Login Component
 * 
 * A React functional component that provides user authentication functionality.
 * It handles the login process in two steps:
 * 1. Initial authentication with email/password
 * 2. Fetching complete profile data including venue manager status
 * 
 * Features:
 * - Email and password validation
 * - Error handling and user feedback
 * - Secure token management
 * - Profile data synchronization
 * - Responsive design for mobile and desktop
 * - Keyboard support (Enter key submission)
 * 
 * @component
 * @example
 * ```tsx
 * <Login />
 * ```
 * 
 * @returns {React.FC} A login form component with authentication handling
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
     * This function performs a two-step authentication process:
     * 1. Authenticates user credentials and obtains an access token
     * 2. Fetches the complete user profile to sync venue manager status and other details
     * 
     * The function first logs in with basic credentials, then enhances the user data
     * with profile information including venue manager status, avatar, and banner.
     * 
     * @async
     * @function
     * @throws {Error} When authentication fails or profile fetch fails
     * @returns {Promise<void>}
     */
    const handleLogin = async () => {
        try {

            const loginResponse = await api.post<LoginResponse>('/auth/login', {
                email,
                password,
            });

            if (loginResponse.data.data) {
                const loginData = loginResponse.data.data;

                // Set user data first with basic info
                const initialUserData = {
                    ...loginData,
                    venueManager: false,
                    avatar: loginData.avatar || { url: '', alt: '' },
                    banner: loginData.banner || { url: '', alt: '' },
                    bio: loginData.bio || '',
                };

                login(initialUserData);

                // get profile with the new token
                try {
                    const profileResponse = await api.get(`/holidaze/profiles/${loginData.name}`);
                    
                    const updatedUserData = {
                        ...initialUserData,
                        venueManager: profileResponse.data.data.venueManager === true,
                        avatar: profileResponse.data.data.avatar || { url: '', alt: '' },
                        banner: profileResponse.data.data.banner || { url: '', alt: '' },
                        bio: profileResponse.data.data.bio || '',
                    };

                    login(updatedUserData);
                } catch (profileError: any) {
                    console.error('Error fetching profile', profileError);
                }

                    navigate('/venues');
            }
        } catch (error: any) {
            console.error('Login error:', error?.response?.data || error);
            setErrorMessage(error?.response?.data?.errors?.[0]?.message || 'Failed to login');
        }
    };

    /**
     * Handles keyboard events for form submission.
     * Triggers the login process when the Enter key is pressed.
     * 
     * @param {React.KeyboardEvent} event - The keyboard event
     */
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
                                Please enter your credentials to continue
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