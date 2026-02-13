
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../domain/types';

export const ClientLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirección explícita a la Landing Page al cerrar sesión
    navigate('/');
  };

  const getLogoTarget = () => {
    if (user?.role === UserRole.CLIENT) return "/client/dashboard";
    if (user?.role === UserRole.PROFESSIONAL) return "/pro/dashboard";
    return "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <nav className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link to={getLogoTarget()} className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">R</div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ReservaPro</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/directory" className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/directory' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Directorio</Link>
            
            {user ? (
              <>
                <Link to="/client/dashboard" className={`text-sm font-bold ${location.pathname === '/client/dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Mis Reservas</Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                  <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{user.role}</p>
                     <p className="text-xs font-bold dark:text-white leading-none">{user.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-rose-500 text-[10px] font-black uppercase rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-500">Login</Link>
                <Link to="/register" className="px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-xs font-black rounded-xl shadow-xl shadow-black/10 hover:scale-105 transition-all">Empezar</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 py-10 px-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-400 font-medium">© 2024 ReservaPro SaaS • Gestión Profesional de Citas</p>
        </div>
      </footer>
    </div>
  );
};
