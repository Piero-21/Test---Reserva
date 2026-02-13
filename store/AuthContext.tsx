
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Tenant } from '../types';
import { mockUsers, mockTenants } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  currentTenant: Tenant | null;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    // Persistent auth simulation
    const saved = localStorage.getItem('reserva_pro_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      if (parsed.tenantId) {
        const tenant = mockTenants.find(t => t.id === parsed.tenantId);
        setCurrentTenant(tenant || null);
      }
    }
  }, []);

  const login = async (email: string) => {
    const found = mockUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('reserva_pro_user', JSON.stringify(found));
      if (found.tenantId) {
        const tenant = mockTenants.find(t => t.id === found.tenantId);
        setCurrentTenant(tenant || null);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentTenant(null);
    localStorage.removeItem('reserva_pro_user');
  };

  const switchRole = (role: UserRole) => {
    // Utility for demo purposes to switch between roles easily
    const found = mockUsers.find(u => u.role === role);
    if (found) setUser(found);
  };

  return (
    <AuthContext.Provider value={{ user, currentTenant, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
