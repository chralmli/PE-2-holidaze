import React from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

const Register: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleRegister = () => {
        // Handle registration logic here
        console.log('Registering with email:', email, 'and password:', password);
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>Register</Typography>
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
            <Button onClick={handleRegister} variant="contained" color="primary">Register</Button>
        </Container>
    );
};

export default Register;