import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useBackButtonLogout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Push a dummy state so there's always a state to pop when they click "Back"
    window.history.pushState(null, '', window.location.pathname);

    const handlePopState = () => {
      if (window.confirm("Are you sure you want to log out?")) {
        logout();
        navigate('/', { replace: true });
      } else {
        // If they cancel, restore the state to maintain the trap
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, logout, navigate]);
}
