import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteCookie } from '../utils/utils';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Delete both access token and user data cookies
    deleteCookie('access_token');
    deleteCookie('ACTIVE_USER');
    
    console.log('Logged out successfully - cleared all user cookies');
    
    // Redirect to login page
    navigate('/login');
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
