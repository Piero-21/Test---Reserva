
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole } from '../domain/types';

interface GuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const Guard: React.FC<GuardProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Autenticando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirigir a la Landing Page (/) por defecto
  // Esto asegura que al cerrar sesión desde una ruta protegida, el usuario termine en la Landing
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Si hay usuario pero su rol no está permitido, también a la Landing
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
