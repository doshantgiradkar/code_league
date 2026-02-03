// Custom hook for Firebase authentication with role-based access control

import { useState, useEffect, createContext, useContext } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { getDocument, setDocument } from '../firebase/helperFunction';
import { COLLECTIONS, USER_ROLES } from '../lib/constants';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                // Fetch user profile from Firestore
                try {
                    const profile = await getDocument(COLLECTIONS.USERS, firebaseUser.uid);
                    setUserProfile(profile);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    setError('Failed to load user profile');
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Register new user
    const register = async (email, password, displayName, role = USER_ROLES.LEARNER) => {
        try {
            console.log('🔐 Starting registration:', { email, displayName, role });
            setError(null);

            // Create Firebase auth user
            console.log('📝 Creating user with email and password...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;
            console.log('✅ Firebase user created:', newUser.uid);

            // Update display name
            console.log('👤 Updating display name...');
            await updateProfile(newUser, { displayName });
            console.log('✅ Display name updated');

            // Create user profile in Firestore
            const profileData = {
                uid: newUser.uid,
                email: newUser.email,
                displayName,
                role,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                skills: [],
                education: [],
                experience: [],
                projects: [],
            };

            console.log('💾 Saving profile to Firestore...', profileData);
            await setDocument(COLLECTIONS.USERS, newUser.uid, profileData);
            console.log('✅ Profile saved to Firestore');

            setUserProfile(profileData);

            return newUser;
        } catch (err) {
            console.error('❌ Registration error:', err);
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
            setError(err.message);
            throw err;
        }
    };

    // Login existing user
    const login = async (email, password) => {
        try {
            console.log('🔐 Starting login:', { email });
            setError(null);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;
            console.log('✅ Firebase login successful:', loggedInUser.uid);

            // Fetch user profile
            console.log('📖 Fetching user profile from Firestore...');
            const profile = await getDocument(COLLECTIONS.USERS, loggedInUser.uid);
            console.log('✅ Profile loaded:', profile);
            setUserProfile(profile);

            return loggedInUser;
        } catch (err) {
            console.error('❌ Login error:', err);
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
            setError(err.message);
            throw err;
        }
    };

    // Logout
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
            setUser(null);
            setUserProfile(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Update user profile
    const updateUserProfile = async (updates) => {
        try {
            setError(null);

            if (!user) throw new Error('No authenticated user');

            const updatedData = {
                ...updates,
                updatedAt: new Date().toISOString(),
            };

            await setDocument(COLLECTIONS.USERS, user.uid, updatedData, { merge: true });
            setUserProfile({ ...userProfile, ...updatedData });
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Check if user has specific role
    const hasRole = (requiredRole) => {
        return userProfile?.role === requiredRole;
    };

    // Check if user is learner
    const isLearner = () => hasRole(USER_ROLES.LEARNER);

    // Check if user is recruiter
    const isRecruiter = () => hasRole(USER_ROLES.RECRUITER);

    const value = {
        user,
        userProfile,
        loading,
        error,
        register,
        login,
        logout,
        resetPassword,
        updateUserProfile,
        hasRole,
        isLearner,
        isRecruiter,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};

export default useAuth;
