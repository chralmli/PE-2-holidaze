import { useEffect, useState } from 'react';
import { UserProfileResponse } from '../types/User';
import { getUserProfile } from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface UseUserProfileResult {
  profile: UserProfileResponse['data'] | null;
  loading: boolean;
  error: string | null;
}

const useUserProfile = (): UseUserProfileResult => {
  const { user, logout, checkAuthStatus } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse['data'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchUserProfile = async () => {
      if (!checkAuthStatus()) {
        if (mounted) {
          logout();
          setLoading(false);
        }
        return;
      }

      if (!user) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }
      
      try {
        const response = await getUserProfile(user.name);
        if (mounted) {
          setProfile(response.data);
          setError(null);
        }
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        if (error?.response?.status === 401) {
          logout();
        }
        if (mounted) {
          setError('Failed to fetch user profile');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      mounted = false;
    };
  }, [user, logout, checkAuthStatus]);

  return { profile, loading, error };
};

export default useUserProfile;