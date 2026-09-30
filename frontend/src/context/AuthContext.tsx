import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  switchRole: (newRole: UserRole) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const defaultUser: User = {
  id: 2,
  email: 'researcher@landgov.gov.in',
  full_name: 'Dr. Ananya Roy (Lead Researcher)',
  role: 'RESEARCHER',
  organization: 'National Institute of Urban Affairs (NIUA)',
  is_active: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);
  const [role, setRole] = useState<UserRole>('RESEARCHER');
  const [token, setToken] = useState<string | null>(localStorage.getItem('landgov_token') || 'demo_token');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Attempt to fetch current user profile from backend
    const checkAuth = async () => {
      try {
        const me = await api.auth.getMe();
        if (me) {
          setUser(me);
          setRole(me.role);
        }
      } catch (e) {
        // In demo mode default to researcher
        setUser(defaultUser);
        setRole('RESEARCHER');
      }
    };
    checkAuth();
  }, []);

  const switchRole = async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.auth.demoSwitch(newRole);
      if (res && res.user) {
        setUser(res.user);
        setRole(res.user.role);
        setToken(res.access_token);
        localStorage.setItem('landgov_token', res.access_token);
      }
    } catch (e) {
      console.warn('Switch role fallback to local simulation');
      const mockUsers: Record<UserRole, User> = {
        ADMIN: {
          id: 1,
          email: 'admin@landgov.gov.in',
          full_name: 'Dr. Rajeshwar Rao (Platform Director)',
          role: 'ADMIN',
          organization: 'Ministry of Rural Development',
          is_active: true,
        },
        RESEARCHER: {
          id: 2,
          email: 'researcher@landgov.gov.in',
          full_name: 'Dr. Ananya Roy (Lead Researcher)',
          role: 'RESEARCHER',
          organization: 'National Institute of Urban Affairs (NIUA)',
          is_active: true,
        },
        POLICYMAKER: {
          id: 3,
          email: 'policymaker@landgov.gov.in',
          full_name: 'Shri Vikramaditya Sen (Joint Secretary)',
          role: 'POLICYMAKER',
          organization: 'NITI Aayog — Land Policy Cell',
          is_active: true,
        },
        PUBLIC: {
          id: 4,
          email: 'citizen@landgov.gov.in',
          full_name: 'Arjun Varma (Public Researcher)',
          role: 'PUBLIC',
          organization: 'Independent Civil Society Researcher',
          is_active: true,
        },
      };
      setUser(mockUsers[newRole]);
      setRole(newRole);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, pass);
      setUser(res.user);
      setRole(res.user.role);
      setToken(res.access_token);
      localStorage.setItem('landgov_token', res.access_token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('landgov_token');
    setToken(null);
    setUser(null);
    setRole('PUBLIC');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!user,
        switchRole,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
