import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read persisted auth from localStorage when component mounts
  useEffect(() => {
    const savedToken = localStorage.getItem('em_token');
    const savedUser = localStorage.getItem('em_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user:', err);
        localStorage.removeItem('em_token');
        localStorage.removeItem('em_user');
      }
    }
    // Mark initialization as complete regardless of whether we found saved data
    setIsInitialized(true);
  }, []);

  const login = (userData, authToken) => {
    const normalizedUser = {
      ...userData,
      id: userData?.id ?? userData?.userId ?? null,
      userId: userData?.userId ?? userData?.id ?? null,
    };

    setUser(normalizedUser);
    setToken(authToken);
    localStorage.setItem('em_token', authToken);
    localStorage.setItem('em_user', JSON.stringify(normalizedUser));
  };

  const updateUser = (partialUserData) => {
    setUser(prev => {
      const next = { ...(prev || {}), ...partialUserData };
      localStorage.setItem('em_user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCartCount(0);
    localStorage.removeItem('em_token');
    localStorage.removeItem('em_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, cartCount, setCartCount, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
