/**
 * Register.tsx
 * 
 * A component for user registration, allowing new users to create an account by providing necessary information
 * including email, username, password, and optional profile data.
 * 
 * Users have an option to register as a venue manager as well.
 */

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel, Alert, Box, Paper, Grid, Divider } from '@mui/material';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

/**
 * Register Component
 * 
 * A React functional component that renders a registration form. Users can register using their email, username, and password, and provide optional details for avatar, banner, and bio. 
 * The form also allows the user to register as a venue manager.
 * 
 * @component
 * @returns {React.FC} - A user registration form.
 */
const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarAlt, setAvatarAlt] = useState('');
    const [bannerUrl, setBannerUrl] = useState('');
    const [bannerAlt, setBannerAlt] = useState('');
    const [isVenueManager, setIsVenueManager] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const navigate = useNavigate();

    /**
     * Handles the user registration process.
     * 
     * This function collects the form data, performs basic validation, and sends a POST request to the server to register the user.
     * 
     * @async
     * @function
     * @returns {Promise<void>} - The result of the registration process, or an error if something went wrong.
     */
    const handleRegister = async () => {
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!name) {
            setError('Username is required');
            return;
        }
        if (name.length > 20) {
            setError('Username cannot be longer than 20 characters');
            return;
        }
        if (!email) {
            setError('Email must be a valid stud.noroff.no address');
            return;
        }
        if (!email.endsWith('@stud.noroff.no')) {
            setError('Email must be a valid stud.noroff.no address');
            return;
        }
        if (!name || name.includes(' ') || /[^\w]/.test(name)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }
        if (!password || password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        const userData =  {
            name, 
            email,
            password,
            bio: bio || undefined,
            avatar: avatarUrl? { url: avatarUrl, alt: avatarAlt || '' } : undefined,
            banner: bannerUrl? { url: bannerUrl, alt: bannerAlt || '' } : undefined,
            venueManager: isVenueManager,
        };

        try {
            await api.post('/auth/register', userData);
            setSuccess(`Registration successful! You can now log in with your email: ${email}`);

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error: any) {
            const errorMessage = error.response?.data?.errors?.[0]?.message || 'An error occurred during registration.';
            setError(errorMessage);
            console.error('Error registering:', error);
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
                <Grid item xs={12} lg={4}
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
                            Welcome to Holidaze
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Create your account and start exploring
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Join our community to discover amazing venues and create unforgettable experiences.
                        </Typography>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                                Already have an account?
                            </Typography>
                            <Button
                                component={Link}
                                to="/login"
                                variant='outlined'
                                color='primary'
                                fullWidth
                                sx={{ maxWidth: '200px' }}
                            >
                                Sign in
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Right side */}
                <Grid item xs={12} md={7} lg={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 4 },
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'grey.100',
                        }}
                    >
                        <Typography variant="h4" gutterBottom>Register</Typography>
                        {error && 
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 3, 
                                    borderRadius: '12px',
                                    '& .MuiAlert-message': {
                                        width: '100%',
                                    } 
                                }}
                                data-testid="register-error"
                            >
                                {error}
                            </Alert>
                        }
                        {success && 
                            <Alert 
                                severity="success" 
                                sx={{ mb: 3, borderRadius: '12px' }}
                                data-testid="register-success"
                            >
                                {success}
                            </Alert>
                        }

                        <Grid container spacing={3}>
                            {/* Required fields */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                    Required Information
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Username"
                                    fullWidth
                                    value={name}
                                    name="username"
                                    onChange={(e) => setName(e.target.value)}
                                    data-testid="register-username"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    data-testid="register-email"
                                    helperText="Must be a valid stud.noroff.no address"
                                    name="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    data-testid="register-password"
                                    helperText="Must be at least 8 characters long"
                                    name="password"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                    Profile Information (Optional)
                                </Typography>
                            </Grid>

                            {/* Optional fields */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Bio"
                                    fullWidth
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    multiline
                                    rows={4}
                                    data-testid="register-bio"
                                />
                            </Grid>

                            {/* Avatar Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Avatar URL (optional)"
                                    fullWidth
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    data-testid="register-avatar-url"
                                    helperText="Must be a valid URL"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Avatar Alt Text (optional)"
                                    fullWidth
                                    value={avatarAlt}
                                    onChange={(e) => setAvatarAlt(e.target.value)}
                                    data-testid="register-avatar-alt"
                                />
                            </Grid>

                            {/* Banner Fields */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Banner URL (optional)"
                                    fullWidth
                                    value={bannerUrl}
                                    onChange={(e) => setBannerUrl(e.target.value)}
                                    data-testid="register-banner-url"
                                    helperText="Must be a valid URL"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Banner Alt Text (optional)"
                                    fullWidth
                                    value={bannerAlt}
                                    onChange={(e) => setBannerAlt(e.target.value)}
                                    data-testid="register-banner-alt"
                                />
                            </Grid>

                            {/* Venue Manager Option */}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isVenueManager}
                                            disabled={isVenueManager}
                                            onChange={(e) => setIsVenueManager(e.target.checked)}
                                            data-testid="register-venue-manager"
                                        />
                                    }
                                    label="Register as a Venue Manager"
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    onClick={handleRegister}
                                    type="submit"
                                    variant="contained"
                                    color="gradient"
                                    size="large"
                                    fullWidth
                                    data-testid="register-submit"
                                    sx={{ mt: 2}}
                                >
                                    Create Account
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Register;