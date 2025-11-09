import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface AuthContextType {
user: User | null;
login: (email: string, password: string) => Promise<void>;
register: (email: string, password: string) => Promise<boolean>;
logout: () => Promise<void>;
loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (user) => {
setUser(user);
setLoading(false);

if (user) {
try {
await setDoc(doc(db, 'users', user.uid), {
email: user.email,
lastLogin: new Date(),
createdAt: new Date()
}, { merge: true });
} catch (error) {
console.error('Error updating user document:', error);
}
}
});

return unsubscribe;
}, []);

const login = async (email: string, password: string) => {
await signInWithEmailAndPassword(auth, email, password);
};

const register = async (email: string, password: string): Promise<boolean> => {
try {
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

await new Promise(resolve => setTimeout(resolve, 1000));

await setDoc(doc(db, 'users', user.uid), {
email: user.email,
createdAt: new Date(),
lastLogin: new Date()
});

console.log('User document created successfully for:', user.uid);

await signOut(auth);

return true;
} catch (error) {
console.error('Registration error:', error);
throw error;
}
};

const logout = async () => {
// Clean and simple - just sign out
// Let ThemeContext handle theme management
await signOut(auth);
};

const value = {
user,
login,
register,
logout,
loading
};

return (
<AuthContext.Provider value={value}>
{!loading && children}
</AuthContext.Provider>
);
};
