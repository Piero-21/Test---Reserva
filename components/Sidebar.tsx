
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { UserRole, SubscriptionStatus } from '../domain/types';
import { Icons } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, professional } = useAuth();
  const location = useLocation();

  const menuItems = {
    [UserRole.SUPER_ADMIN]: [
      { path: '/admin/dashboard', name: 'Resumen Global', icon: Icons.Dashboard },
      { path: '/admin/tenants', name: 'Control Tenants', icon: Icons.Users },
    ],
    [UserRole.PROFESSIONAL]: [
      { path: '/pro/dashboard', name: 'Panel Principal', icon: Icons.Dashboard },
      { path: '/pro/agenda', name: 'Agenda Maestra', icon: Icons.Calendar },
      { path: '/pro/services', name: 'Mis Servicios', icon: Icons.Settings },
      { path: '/pro/clients', name: 'Mis Clientes', icon: Icons.Users },
    ],
    [UserRole.CLIENT]: [
      { path: '/client/dashboard', name: 'Mis Reservas', icon: Icons.Calendar },
      { path: '/directory', name: 'Explorar', icon: Icons.Dashboard },
    ],
  };

  const currentMenu = user ? menuItems[user.role] : [];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
    lg:relative lg:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/20">R</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">ReservaPro</h1>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SaaS Enterprise</span>
              </div>
            </div>
            <button className="lg:hidden text-slate-400" onClick={onClose}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18"/></svg>
            </button>
          </div>

          <div className="px-6 py-4">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Entorno</p>
              <p className="text-sm font-semibold truncate text-slate-200">
                {professional?.businessName || (user?.role === UserRole.SUPER_ADMIN ? 'SaaS Administrator' : 'Portal Cliente')}
              </p>
              {professional && (
                 <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase border ${
                      professional.subscriptionStatus === SubscriptionStatus.ACTIVE 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {professional.subscriptionStatus}
                    </span>
                 </div>
              )}
            </div>
          </div>

          <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto">
            {currentMenu.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                  className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <item.icon />
                  </span>
                  <span className="font-semibold text-sm tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6">
            <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-2xl p-5 text-center">
              <p className="text-xs font-bold text-indigo-300 mb-2">Soporte SaaS</p>
              <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
                Contactar
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
