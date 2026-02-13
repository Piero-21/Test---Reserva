
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ProfessionalProfile, UserRole } from '../domain/types';
import { apiClient } from '../api';

interface AuthContextType {
  user: User | null;
  professional: ProfessionalProfile | null;
  login: (email: string, pass: string) => Promise<UserRole>;
  register: (data: any) => Promise<UserRole>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'reservapro_auth_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        try {
          const { user, professional } = JSON.parse(saved);
          setUser(user);
          setProfessional(professional);
        } catch (e) {
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<UserRole> => {
    const res = await apiClient.login(email, pass);
    setUser(res.user);
    setProfessional(res.professional || null);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify({ 
      user: res.user, 
      professional: res.professional,
      token: res.token 
    }));
    
    return res.user.role;
  };

  const register = async (data: any): Promise<UserRole> => {
    const res = await apiClient.register(data);
    setUser(res.user);
    setProfessional(res.professional || null);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify({ 
      user: res.user, 
      professional: res.professional,
      token: res.token 
    }));
    
    return res.user.role;
  };

  const logout = () => {
    setUser(null);
    setProfessional(null);
    localStorage.removeItem(SESSION_KEY);
    apiClient.logout();
  };

  return (
    <AuthContext.Provider value={{ user, professional, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
