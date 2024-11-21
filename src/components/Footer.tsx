import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  styled
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

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: '#0f3443',
  color: 'white',
  padding: theme.spacing(6, 0, 4),
  marginTop: 'auto',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    color: '#34e89e',
  },
})) as typeof Link;

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: 'white',
  '&:hover': {
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    marginBottom: 0,
  },
}));

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <FooterSection>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#34e89e' }}>
                Holidaze
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your trusted platform for finding and booking unique accommodations.
                Experience the best stays with Holidaze.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <SocialIcon size="small">
                  <Facebook />
                </SocialIcon>
                <SocialIcon size="small">
                  <Instagram />
                </SocialIcon>
                <SocialIcon size="small">
                  <Twitter />
                </SocialIcon>
                <SocialIcon size="small">
                  <LinkedIn />
                </SocialIcon>
              </Box>
            </FooterSection>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <FooterSection>
              <Typography variant="h5" sx={{ mb: 2, color: '#34e89e' }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FooterLink component={RouterLink} to ="/">
                  Home
                </FooterLink>
                <FooterLink component={RouterLink} to="/venues">
                  Venues
                </FooterLink>
                <FooterLink component={RouterLink} to="/register">
                  Register
                </FooterLink>
                <FooterLink component={RouterLink} to="/login">
                  Login
                </FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          {/* For Venue Managers */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <Typography variant="h5" sx={{ mb: 2, color: '#34e89e' }}>
                For Venue Managers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FooterLink component={RouterLink} to="/post-accommodation">
                  List Your Property
                </FooterLink>
                <FooterLink component={RouterLink} to="/admin">
                  Admin Dashboard
                </FooterLink>
              </Box>
            </FooterSection>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <FooterSection>
              <Typography variant="h5" sx={{ mb: 2, color: '#34e89e' }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ color: '#34e89e' }} />
                  <Typography variant="body2">+47 123 45 678</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ color: '#34e89e' }} />
                  <Typography variant="body2">support@holidaze.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: '#34e89e' }} />
                  <Typography variant="body2">
                    Trondheim, Norway
                  </Typography>
                </Box>
              </Box>
            </FooterSection>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.1 '}} />

        {/* Bottom Section */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Copyright fontSize="small" />
            {currentYear} Holidaze. All rights reserved.
          </Typography>
          <FooterLink href="#privacy">Privacy Policy</FooterLink>
          <FooterLink href="#terms">Terms of Service</FooterLink>
          <FooterLink href="#cookies">Cookie Policy</FooterLink>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;