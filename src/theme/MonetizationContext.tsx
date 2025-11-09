import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../Storage';
import { useAuth } from './AuthContext';

interface MonetizationContextType {
isPro: boolean;
upgradeToPro: () => void;
checkProStatus: () => void;
}

const MonetizationContext = createContext<MonetizationContextType>({} as MonetizationContextType);

export const useMonetization = () => useContext(MonetizationContext);

export const MonetizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const { user } = useAuth();
const [isPro, setIsPro] = useState(false);

// Check Pro status when user changes
const checkProStatus = async () => {
console.log('🔄 checkProStatus called for user:', user?.email, user?.uid);

if (!user) {
console.log('❌ No user, setting isPro to false');
setIsPro(false);
return;
}

try {
// Store Pro status per user using their UID
const storageKey = `isPro_${user.uid}`;
const proStatus = await storage.get(storageKey);
console.log(`🔐 Checking Pro status for ${user.email}:`, proStatus, 'Storage key:', storageKey);
setIsPro(!!proStatus);
} catch (error) {
console.error('Error checking Pro status:', error);
setIsPro(false);
}
};

useEffect(() => {
console.log('👤 User changed in MonetizationContext:', user?.email);
checkProStatus();
}, [user]); // Re-check when user changes

const upgradeToPro = async () => {
if (!user) {
console.log('❌ Cannot upgrade - no user');
return;
}

try {
const storageKey = `isPro_${user.uid}`;
console.log(`⬆️ Upgrading user ${user.email} to Pro, storage key:`, storageKey);

// Store Pro status with user-specific key
await storage.set(storageKey, true);
setIsPro(true);
console.log(`✅ ${user.email} upgraded to Pro!`);
} catch (error) {
console.error('Error upgrading to Pro:', error);
}
};

const value = {
isPro,
upgradeToPro,
checkProStatus
};

return (
<MonetizationContext.Provider value={value}>
{children}
</MonetizationContext.Provider>
);
};
