import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  Copyright
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialButtons = [
    { icon: <Facebook />, label: 'Facebook' },
    { icon: <Instagram />, label: 'Instagram' },
    { icon: <Twitter />, label: 'Twitter' },
    { icon: <LinkedIn />, label: 'LinkedIn' },
  ];

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'common.white',
        position: 'relative',
        overflow: 'hidden',
        pb: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
          opacity: 0.1,
          zIndex: 0,
        }
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 6, md: 8 }
        }}
      >
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: { xs: 3, md: 0 } }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: 2, 
                  background: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                }}
              >
                Holidaze
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'grey.200' }}>
                Your trusted platform for finding and booking unique accommodations.
                Experience the best stays with Holidaze.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {socialButtons.map((social) => (
                  <IconButton 
                    key={social.label}
                    size="small"
                    aria-label={social.label}
                    sx={{
                      color: 'grey.200',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'secondary.main',
                        transform: 'translateY(-4px)',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { to: '/', text: 'Home' },
                { to: '/venues', text: 'Venues' },
                { to: '/register', text: 'Register' },
                { to: '/login', text: 'Login' },
              ].map((link) => (
                <Link
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  sx={{
                    color: 'grey.200',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'secondary.main',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* For Venue Managers */}
          <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ mb: 3, color: 'secondary.main' }}>
                For Venue Managers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { to: '/post-accommodation', text: 'List Your Property' },
                  { to: '/admin', text: 'Admin Dashboard' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    sx={{
                      color: 'grey.200',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'secondary.main',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { icon: <Phone fontSize="small" />, text: '+47 123 45 678' },
                { icon: <Email fontSize="small" />, text: 'support@holidaze.com' },
                { icon: <LocationOn fontSize="small" />, text: 'Trondheim, Norway' },
              ].map((contact, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'grey.200',
                  }}
                >
                  <Box sx={{ color: "secondary.main" }}>
                    {contact.icon}
                  </Box>
                  <Typography variant="body2">
                    {contact.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            my: 4, 
            backgroundColor: 'rgba(255,255,255,0.1 ',
            backdropFilter: 'blur(4px)',
          }} 
        />

        {/* Bottom Section */}
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            color: 'grey.200',
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}
          >
            <Copyright fontSize="small" />
            {currentYear} Holidaze. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
              <Link
                key={text}
                sx={{
                  color: 'grey.200',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                {text}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;