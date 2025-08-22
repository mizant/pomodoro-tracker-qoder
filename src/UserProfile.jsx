import React, { useState } from 'react';
import { signOutUser } from './firebase';

function UserProfile({ user }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOutUser();
      // In development mode, manually clear login state
      if (user && user.uid === 'dev-user-123') {
        localStorage.setItem('dev_logged_in', 'false');
        // Trigger a page reload to update auth state
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="user-profile">
      <img 
        src={user.photoURL || '/default-avatar.png'} 
        alt="Profile" 
        className="user-avatar"
      />
      <div className="user-info">
        <div className="user-name">{user.displayName}</div>
        <div className="user-email">{user.email}</div>
      </div>
      <button 
        className="btn-logout"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  );
}

export default UserProfile;