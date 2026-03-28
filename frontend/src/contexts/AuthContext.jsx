import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);


  async function signup(email, password, name, role, address, location) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    
    // Create profile in our MongoDB
    const response = await axios.post(`${API_URL}/users/profile`, {
      firebaseId: userCredential.user.uid,
      name,
      email,
      role,
      address,
      latitude: location.lat,
      longitude: location.lng
    });
    setUserData(response.data);
    return userCredential.user;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const response = await axios.get(`${API_URL}/users/${user.uid}`);
          setUserData(response.data);
        } catch (err) {
          console.error("Error fetching user data", err);
          // If 404, maybe the profile wasn't created in MongoDB yet
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  async function refreshUserData() {
    if (currentUser) {
      try {
        const response = await axios.get(`${API_URL}/users/${currentUser.uid}`);
        setUserData(response.data);
      } catch (err) {
        console.error("Error refreshing user data", err);
      }
    }
  }

  const value = {
    currentUser,
    userData,
    loading,
    authChecked,
    signup,
    login,
    logout,
    resetPassword,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
