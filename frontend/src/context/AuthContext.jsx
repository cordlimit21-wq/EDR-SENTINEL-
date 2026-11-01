import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = "http://localhost:8000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sentinel_auth_token') || sessionStorage.getItem('sentinel_auth_token') || null;
    }
    return null;
  });

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate token against backend /api/auth/me
  const verifySession = useCallback(async (tokenToVerify) => {
    if (!tokenToVerify) {
      setUser(null);
      setIsLoading(false);
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.warn("[Sentinel Auth] Session verification error:", err);
    }

    // Token invalid or expired
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sentinel_auth_token');
      sessionStorage.removeItem('sentinel_auth_token');
    }
    setToken(null);
    setUser(null);
    setIsLoading(false);
    return false;
  }, []);

  // Initial check on mount
  useEffect(() => {
    verifySession(token);
  }, [token, verifySession]);

  // Login action
  const login = async (email, password, rememberMe = false) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember_me: rememberMe })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Authentication failed. Please check your credentials.");
    }

    const authToken = data.token;
    if (rememberMe) {
      localStorage.setItem('sentinel_auth_token', authToken);
      sessionStorage.removeItem('sentinel_auth_token');
    } else {
      sessionStorage.setItem('sentinel_auth_token', authToken);
      localStorage.removeItem('sentinel_auth_token');
    }

    setToken(authToken);
    setUser(data.user);
    return data;
  };

  // Register action
  const register = async (fullName, email, password, department = "Cyber Defense Operations") => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        department
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Registration failed. Please check your information.");
    }

    const authToken = data.token;
    sessionStorage.setItem('sentinel_auth_token', authToken);
    localStorage.removeItem('sentinel_auth_token');

    setToken(authToken);
    setUser(data.user);
    return data;
  };

  // Logout action
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.warn("[Sentinel Auth] Logout backend call failed:", e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sentinel_auth_token');
        sessionStorage.removeItem('sentinel_auth_token');
      }
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    token,
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshUser: () => verifySession(token)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
