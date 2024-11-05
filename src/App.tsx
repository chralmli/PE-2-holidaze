import React from 'react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import VenueDetails from './pages/VenueDetails';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from './muiTheme'
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  return (
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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/venue/:id" element={<VenueDetails />} />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <UserProfile />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Only allow venue managers to access the admin dashboard */}
          <Route
            path="/admin"
            element={
              isLoggedIn && user?.venueManager ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </>
    </ThemeProvider>
  );
};

export default App;
