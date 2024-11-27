import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { isLoggedIn, user, logout } = useAuth();

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Create menu items conditionally for logged-in and non-logged-in users
    const loggedOutMenuItems = [
        <MenuItem key="register" onClick={handleMenuClose} component={Link} to="/register">Register</MenuItem>,
        <MenuItem key="login" onClick={handleMenuClose} component={Link} to="/login">Login</MenuItem>,
    ];

    const loggedInMenuItems = [
        <MenuItem key="profile" onClick={handleMenuClose} component={Link} to="/profile">Profile</MenuItem>,
        user?.venueManager && (
            <MenuItem key="admin" onClick={handleMenuClose} component={Link} to="/admin">Admin Dashboard</MenuItem>
        ),
        <MenuItem key="logout" onClick={() => { handleMenuClose(); logout(); }}>Logout</MenuItem>,
    ];

  return (
    <AppBar 
        position="sticky"
        elevation={0}
        sx={{ 
            backgroundColor: 'white',
            borderBottom: '1px solid',
            borderColor: 'grey.100'
        }}>
        <Toolbar sx={{ width: '100%', margin: '0 auto' }}>
            <Typography 
                variant="h3" 
                component={Link} 
                to="/"
                sx={{ 
                    flexGrow: 1, 
                    fontSize: { xs: '20px', sm: '24px' },
                    fontFamily: 'poppins',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 30%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'opacity 0.3s ease',
                    '&:hover': {
                        opacity: 0.8,
                    }
                }}
            >
                holidaze
            </Typography>
            {isMobile ? (
                <>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen} sx={{ color: 'grey.800', '&:hover': { color: 'primary.main' }}}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            elevation: 3,
                            sx: { mt: 2, minWidth: 200 }
                        }}
                    >
                        <MenuItem onClick={handleMenuClose} component={Link} to="/">Home</MenuItem>
                        <MenuItem onClick={handleMenuClose} component={Link} to="/venues">Venues</MenuItem>
                        {!isLoggedIn ? loggedOutMenuItems : loggedInMenuItems}
                        <Box sx={{ width: '100%', height: '1px', backgroundColor: 'grey.200', my: 1 }} />
                        <MenuItem 
                            onClick={() => {
                                handleMenuClose();
                                if (!isLoggedIn) navigate('/login');
                                else if (user?.venueManager) navigate('/admin');
                                else navigate('profile');
                            }} 
                        >
                            Post your own accommodation
                        </MenuItem>  
                    </Menu>
                </>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button color="inherit" component={Link} to="/" sx={{ color: 'grey.800', fontWeight: 500, '&:hover': { backgroundColor: 'grey.50', color: 'primary.main' } }}>Home</Button>
                    <Button color="inherit" component={Link} to="/venues" sx={{ color: 'grey.800', fontWeight: 500, '&:hover': { backgroundColor: 'grey.50', color: 'primary.main' } }}>Venues</Button>
                    
                    <Box sx={{ mx: 1, width: '1px', height: '24px', bgcolor: 'grey.200' }} />

                    <Button
                        onClick={handleMenuOpen}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            borderRadius: '12px', 
                            padding: ' 6px 12px',
                            marginLeft: 2,
                            backgroundColor: 'grey.50',
                            color: 'grey.800',
                            '&:hover': {
                                backgroundColor: 'grey.100',
                            }
                        }}
                    >
                        <Avatar 
                            sx={{ 
                                background: 'linear-gradient(45deg, #34e89e, #0f3443)', 
                                width: 32, 
                                height: 32 ,
                                marginRight: 1
                            }} 
                        />
                        <Typography
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 500
                            }}
                        >
                            Account
                        </Typography>
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                                mt: 2,
                                minWidth: 200,
                                borderRadius: '12px',
                            }
                        }}
                    >
                        {!isLoggedIn ? loggedOutMenuItems : loggedInMenuItems}
                        <Box sx={{ width: '100%', height: '1px', backgroundColor: 'grey.200', my: 1 }} />
                        <MenuItem 
                            component={Link} 
                            to="/post-accommodation"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                            }}
                            >
                                Post your own accommodation
                            </MenuItem>
                    </Menu>
                </Box>
            )}
        </Toolbar>
    </AppBar>
  );
};

export default Header;