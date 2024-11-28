import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { CssBaseline, GlobalStyles, Alert, Snackbar, Box, CircularProgress } from '@mui/material';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostAccommodationRoute from './pages/PostAccommodationRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import VenueDetails from './pages/VenueDetails';
import EditVenueForm from './pages/EditVenueForm';
import AdminDashboard from './pages/AdminDashboard';
import VenuesPage from './pages/VenuesPage';
import UserProfile from './pages/UserProfile';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './muiTheme'
import { useAuth } from './context/AuthContext';
import { getUserProfile } from './services/userService';
import { UserProfileResponse } from './types/User';

const App: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse['data'] | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const response = await getUserProfile(user.name);
        setProfile(response.data);
      } catch(error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    } else {
      setProfileLoading(false);
    }
  }, [isLoggedIn, user]);

  return (
    <HelmetProvider>
      <ThemeProvider theme={muiTheme}>
        <>
          <CssBaseline />
          <GlobalStyles
          styles={{
            '*': {
              margin: 0,
              padding: 0,
              boxSizing: 'border-box',
            },
            html: {
              height: '100%',
            },
            body: {
              height: '100%',
              fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
            },
            '#root': {
              height: '100%',
            },
          }}
        />

          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post-accommodation" element={<PostAccommodationRoute />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/venue/:id" element={<VenueDetails />} />
            <Route path="/admin/venue/:id" element={<VenueDetails isManagerView />} />
            <Route path="/venues/edit/:venueId" element={<EditVenueForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  {profileLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                  <UserProfile profile={profile} />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiresManager>
                  {profileLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                  <AdminDashboard profile={profile} />
                  )} 
                </ProtectedRoute>
              }
            />
          </Routes>

          {/* Message for non-venue managers */}
          <Snackbar
            open={showMessage}
            autoHideDuration={6000}
            onClose={() => setShowMessage(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
          <Alert
            severity="info"
            onClose={() => setShowMessage(false)}
            sx={{ width: '100%' }}
          >
            To post accommodations, you need to become a venue manager. You can enable this in your profile settings.
          </Alert>
        </Snackbar>
        </>
        <Footer />
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
