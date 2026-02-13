
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Breadcrumbs } from '../components/UI/Breadcrumbs';
import { SettingsDev } from '../components/SettingsDev';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
          <button 
            className="p-2 lg:hidden text-slate-500" 
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
            </svg>
          </button>
          
          <Header />
        </header>

        <main className="flex-1 p-4 lg:p-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Breadcrumbs />
            <Outlet />
          </div>
        </main>

        <footer className="py-6 px-10 border-t border-slate-200 dark:border-slate-900 text-center">
            <p className="text-xs text-slate-400 font-medium">© 2024 ReservaPro SaaS • Enterprise Multi-Tenant Solutions</p>
        </footer>
      </div>
      
      <SettingsDev />
    </div>
  );
};

export default DashboardLayout;
