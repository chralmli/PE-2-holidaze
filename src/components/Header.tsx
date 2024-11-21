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
    <AppBar position="sticky" sx={{ backgroundColor: '#204051' }}>
        <Toolbar>
            <Typography 
                variant="h6" 
                component={Link} 
                to="/"
                sx={{ 
                    flexGrow: 1, 
                    fontSize: '20px', 
                    fontFamily: 'poppins', 
                    color: '#e0f7fa',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                        color: '#34e89e',
                    }
                }}
            >
                holidaze
            </Typography>
            {isMobile ? (
                <>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleMenuClose} component={Link} to="/">Home</MenuItem>
                        <MenuItem onClick={handleMenuClose} component={Link} to="/venues">Venues</MenuItem>
                        {!isLoggedIn ? (
                            loggedOutMenuItems
                        ) : (
                            loggedInMenuItems
                        )}
                        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#e0e0e0', my: 1 }} />
                        <MenuItem 
                            onClick={() => {
                                handleMenuClose();
                                if (!isLoggedIn) {
                                    navigate('/login');
                                } else if (user?.venueManager) {
                                    navigate('/admin');
                                } else {
                                    navigate('/profile');
                                }
                            }} 
                        >
                            Post your own accommodation
                        </MenuItem>  
                    </Menu>
                </>
            ) : (
                <>
                    <Button color="inherit" component={Link} to="/" sx={{ color: '#e0f7fa', marginLeft: '16px' }}>Home</Button>
                    <Button color="inherit" component={Link} to="/venues" sx={{ color: '#e0f7fa', marginLeft: '16px' }}>Venues</Button>
                    
                    {isLoggedIn && (
                        <>
                            {user?.venueManager && (
                                <Button color="inherit" component={Link} to="/admin" sx={{ color: '#e0f7fa', marginLeft: '16px' }}>
                                    Admin Dashboard
                                </Button>
                            )}
                        </>
                    )}
                    <Button
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            border: '1px solid #e0e0e0',
                            borderRadius: '50px', 
                            padding: ' 6px 12px',
                            color: '#e0f7fa',
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                backgroundColor: '#455a64'
                            }
                        }}
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon sx={{ marginRight: '8px' }} />
                        <Avatar sx={{ bgcolor: '#26c6da', width: 32, height: 32 }} />
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        {!isLoggedIn ? (
                            loggedOutMenuItems      
                        ) : (
                            loggedInMenuItems
                        )}
                        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#e0e0e0', my: 1 }} />
                        <MenuItem onClick={handleMenuClose} component={Link} to="/post-accommodation">Post your own accommodation</MenuItem>
                    </Menu>
                </>
            )}
        </Toolbar>
    </AppBar>
  );
};

export default Header;