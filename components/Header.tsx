
import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    // Redirigir a Landing Page para un flujo natural de salida
    navigate('/');
  };

  return (
    <div className="flex items-center justify-end w-full space-x-4 lg:space-x-8">
      <button 
        onClick={toggleDarkMode}
        className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all group"
        title="Cambiar Tema"
      >
        <svg className="w-5 h-5 dark:hidden group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        <svg className="w-5 h-5 hidden dark:block group-hover:rotate-45 transition-transform text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.657 7.657l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>
      </button>

      <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

      <div className="flex items-center space-x-4 group cursor-pointer" data-cy="user-menu-button">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 tracking-tight">{user?.name}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role}</p>
        </div>
        <div className="relative">
          <img 
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=4f46e5&color=fff&bold=true`} 
            className="w-11 h-11 rounded-[1.25rem] object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all shadow-md" 
            alt="Profile"
          />
          <button 
            onClick={handleLogout}
            data-cy="logout-button"
            className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 transition-colors shadow-lg group-hover:scale-110"
            title="Cerrar Sesión"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
