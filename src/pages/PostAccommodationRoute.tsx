import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const PostAccommodationRoute: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !user?.venueManager) {
      setShowMessage(true);
    }
  }, [isLoggedIn, user?.venueManager]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (user?.venueManager) {
    return <Navigate to="/admin" />;
  }

  return (
    <>
      <Navigate to="/profile" />
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
  );
};

export default PostAccommodationRoute;