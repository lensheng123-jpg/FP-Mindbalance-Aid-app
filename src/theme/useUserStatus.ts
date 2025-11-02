import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import storage from '../Storage';

export const useUserStatus = () => {
  const { user } = useAuth();
  const [isNewUser, setIsNewUser] = useState(false);
  const [userStatus, setUserStatus] = useState<'new' | 'returning' | 'unknown'>('unknown');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setUserStatus('unknown');
        return;
      }

      try {
        const storageKey = `hasSeenWelcome_${user.uid}`;
        const hasSeenWelcome = await storage.get(storageKey);
        
        if (!hasSeenWelcome) {
          // First time seeing this user - show welcome message
          setIsNewUser(true);
          setUserStatus('new');
          // Mark that we've seen them now
          await storage.set(storageKey, true);
        } else {
          // Returning user
          setIsNewUser(false);
          setUserStatus('returning');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsNewUser(false);
        setUserStatus('returning');
      }
    };

    checkUserStatus();
  }, [user]);

  return { isNewUser, userStatus };
};