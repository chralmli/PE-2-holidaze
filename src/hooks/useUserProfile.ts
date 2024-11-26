import { useEffect, useState } from 'react';
import { UserProfileResponse } from '../types/User';
import { getUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UseUserProfileResult {
  profile: UserProfileResponse['data'] | null;
  loading: boolean;
  error: string | null;
}

const useUserProfile = () => {
  const { user, logout, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!checkAuthStatus()) {
        logout();
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getUserProfile(user.name);
        setProfile(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error?.response?.status === 401) {
          logout();
          return;
        }
        setError('Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, logout, checkAuthStatus]);

  return { profile, loading, error };
};

export default useUserProfile;