
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Landing: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation - Solo Branding y Acceso */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">R</div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ReservaPro</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Link 
              to={user.role === 'CLIENT' ? '/client/dashboard' : '/pro/dashboard'} 
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all"
            >
              Ir a mi Panel
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2.5 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">
                Empezar Gratis
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            Plataforma B2B Multi-Tenant
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-none mb-8">
            Digitaliza tu agenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">en minutos.</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl font-medium">
            La solución definitiva para profesionales independientes y clínicas. Gestiona citas, predice no-shows y escala tu negocio sin límites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-black rounded-2xl hover:scale-105 transition-all text-center shadow-2xl text-lg uppercase tracking-tight">
              Crear mi Espacio Ahora
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-[120px] rounded-full"></div>
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-2 shadow-2xl border border-white dark:border-slate-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
            <div className="rounded-[36px] overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-500 to-cyan-500 p-8 lg:p-12 min-h-[280px] lg:min-h-[360px] flex items-end">
              <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lg border border-white/50 dark:border-slate-700/60 max-w-xs">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Dashboard Preview</p>
                <p className="text-slate-900 dark:text-white text-sm font-bold mt-1">Citas, clientes y disponibilidad en un solo lugar.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-32 transition-colors">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            title="Aislamiento de Datos"
            desc="Cada profesional cuenta con su propio entorno seguro y aislado (Tenancy)."
            icon="🔒"
          />
           <FeatureCard 
            title="Gestión de Citas"
            desc="Agenda inteligente con recordatorios y confirmación instantánea."
            icon="📅"
          />
           <FeatureCard 
            title="Portal de Paciente"
            desc="Tus clientes pueden reservar de forma autónoma desde cualquier dispositivo."
            icon="📱"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all">
    <div className="text-4xl mb-6">{icon}</div>
    <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{title}</h4>
    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
