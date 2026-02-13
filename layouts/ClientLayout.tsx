
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/AuthContext';

export const ClientLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isPublic = !user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <nav className="h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">R</div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ReservaPro</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/directory" className={`text-sm font-bold uppercase tracking-widest ${location.pathname === '/directory' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Directorio</Link>
            
            {user ? (
              <>
                <Link to="/client/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">Mis Reservas</Link>
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full border border-slate-200" />
                  <button onClick={logout} className="text-xs font-black text-rose-500 uppercase">Salir</button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-bold text-indigo-600">Login</Link>
                <Link to="/register" className="px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 text-white text-xs font-black rounded-xl shadow-xl shadow-black/10">Registrarse</Link>
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
          <p className="text-sm text-slate-400 font-medium">© 2024 ReservaPro • Tu SaaS de Gestión de Citas Profesional</p>
        </div>
      </footer>
    </div>
  );
};
