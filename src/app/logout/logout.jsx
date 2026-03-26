import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../utils/utils';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call backend logout endpoint to invalidate session
        await api({
          url: '/auth/logout',
          method: 'POST'
        });
      } catch (error) {
        console.error('Server logout failed:', error);
        // Continue with local logout even if server logout fails
      } finally {
        // Delete both access token and user data cookies
        deleteCookie('access_token');
        deleteCookie('ACTIVE_USER');
        
        toast.success('Logged out successfully', {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        
        
        // Redirect to login page
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-[48px] font-bold mb-4">Logging out...</h1>
        <p className="text-[18px]">You will be redirected to login page shortly.</p>
      </div>
    </div>
  );
}
