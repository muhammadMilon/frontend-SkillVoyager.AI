import React, { createContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from '../firebase/firebase.init';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-skill-voyager-ai.vercel.app';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
githubProvider.addScope('user:email');

// Save or update user in backend database (login still works if this fails).....
const saveUserToDb = async (user) => {
    if (!user || !user.uid) {
        console.warn('saveUserToDb: No user or uid provided');
        return;
    }

    try {
        const payload = {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || null,
            photoURL: user.photoURL || null,
        };

        const res = await fetch(`${API_BASE}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.warn(`Could not save user to database (Status ${res.status}):`, errorText);
        } else {
            console.log('User saved to database successfully');
        }
    } catch (err) {
        console.warn('Could not save user to database:', err.message);
    }
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register/Sign Up
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Login/Sign In
    const signInUser = async (email, password) => {
        setLoading(true);
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            // If it's the default admin and user doesn't exist, try to create it
            if (
                email === "admin@skillvoyager.ai" &&
                password === "CodeCatalysts" &&
                (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email')
            ) {
                console.log("Auto-provisioning default admin account...");
                try {
                    return await createUserWithEmailAndPassword(auth, email, password);
                } catch (createError) {
                    throw createError;
                }
            }
            throw error;
        }
    }

    // Google Login: popup (more reliable on localhost than redirect)
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    // GitHub Login
    const signInWithGithub = async () => {
        setLoading(true);
        try {
            return await signInWithPopup(auth, githubProvider);
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                const email = error.customData?.email;
                const pendingCredential = GithubAuthProvider.credentialFromError(error);

                if (email && pendingCredential) {
                    const methods = await fetchSignInMethodsForEmail(auth, email);

                    if (methods.includes('google.com')) {
                        throw new Error('This email is already registered with Google. Please login with Google first, then connect GitHub.');
                    }

                    if (methods.includes('password')) {
                        throw new Error('This email is already registered with Email/Password. Please login first, then connect GitHub from your account settings.');
                    }
                }
            }

            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Log Out
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    const sendPasswordReset = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Handle redirect result removed as we switched to signInWithPopup

    // Observer: sync user state and save to DB on login
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Fetch backend user data to get role
                try {
                    const payload = {
                        uid: currentUser.uid,
                        email: currentUser.email || null,
                        displayName: currentUser.displayName || null,
                        photoURL: currentUser.photoURL || null,
                    };
                    const res = await fetch(`${API_BASE}/api/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await res.json();
                    if (data.success) {
                        setDbUser(data.user);
                    }
                } catch (err) {
                    console.warn('Error syncing with backend:', err);
                }
            } else {
                setDbUser(null);
            }

            setLoading(false);
        });

        return () => unSubscribe();
    }, [])

    const authInfo = {
        user,
        dbUser, // Expose backend user data (contains role)
        loading,
        createUser,
        signInUser,
        signInWithGoogle,
        signInWithGithub,
        logOut,
        sendPasswordReset
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;