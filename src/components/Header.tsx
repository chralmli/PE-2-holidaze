import React from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#204051' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '20px', fontFamily: 'poppins', color: '#e0f7fa' }}>
          holidaze
        </Typography>
        {isMobile ? (
            <>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={handleMenuClose} component={Link} to="/">Home</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/venues">Venues</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                        <IconButton color="inherit">
                            <LoginIcon />
                            <Typography variant="button" ml={1}>Login</Typography>
                        </IconButton>
                    </MenuItem>

                </Menu>
            </>
        ) : (
            <>
                <Button color="inherit" component={Link} to="/" sx={{ color: '#e0f7fa' }}>Home</Button>
                <Button color="inherit" component={Link} to="/venues" sx={{ color: '#e0f7fa', marginRight: '16px' }}>Venues</Button>
                <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ backgroundColor: '#26c6da', color: '#ffffff' }}
                >
                    Login
                </Button>
            </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;