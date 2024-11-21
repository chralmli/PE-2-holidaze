/**
 * Register.tsx
 * 
 * A component for user registration, allowing new users to create an account by providing necessary information
 * including email, username, password, and optional profile data.
 * 
 * Users have an option to register as a venue manager as well.
 */

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel, Alert, Box } from '@mui/material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

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
        if (!email.endsWith('@stud.noroff.no')) {
            setError('Email must be a valid stud.noroff.no address.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (name.includes(' ')) {
            setError('Name cannot contain spaces or punctuation symbols apart from underscore(_).');
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
            const response = await api.post('/auth/register', userData);
            setSuccess(`Registration successful! You can now log in with your email: ${email}`);
            navigate('/login');
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred during registration.')
            console.error('Error registering:', error.response?.data?.message);
        }
    };

    return (
        <Container 
            maxWidth="sm"
            sx={{
                marginTop: '8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 'calc(100vh - 8rem - 64px)',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'Poppins', fontWeight: '600' }}>Register</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2',
                    marginTop: 2,
                }}
            >
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Bio (optional)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={bio}
                    multiline
                    rows={4}
                />
                <TextField
                    label="Avatar URL (optional)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <TextField
                    label="Avatar Alt Text (optional)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={avatarAlt}
                    onChange={(e) => setAvatarAlt(e.target.value)}
                />
                <TextField
                    label="Banner URL (optional)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                />
                <TextField
                    label="Banner Alt Text (optional)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={bannerAlt}
                    onChange={(e) => setBannerAlt(e.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox checked={isVenueManager} onChange={(e) => setIsVenueManager(e.target.checked)} />}
                    label="Register as a Venue Manager"
                />
                <Button onClick={handleRegister} variant="contained" color="primary" sx={{ mt: 2 }}>Register</Button>
            </Box>
        </Container>
    );
};

export default Register;