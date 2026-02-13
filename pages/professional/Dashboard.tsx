
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useProfessionalAppointments, useProfessionalClients } from '../../hooks/useProfessionalData';
import { SubscriptionStatus, AppointmentStatus } from '../../domain/types';
import { Link } from 'react-router-dom';
import { getBusinessInsights } from '../../services/geminiService';

const ProfessionalDashboard: React.FC = () => {
  const { professional } = useAuth();
  const { appointments, loading: appointmentsLoading } = useProfessionalAppointments(professional?.id);
  const { clients, loading: clientsLoading } = useProfessionalClients(professional?.id);
  const [insights, setInsights] = useState<string | null>(null);

  const isInactive = professional?.subscriptionStatus !== SubscriptionStatus.ACTIVE && professional?.subscriptionStatus !== SubscriptionStatus.TRIAL;

  // Real Stats Calculation
  const today = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter(a => a.date === today);
  const pendingApps = appointments.filter(a => a.status === AppointmentStatus.PENDING);
  const completedApps = appointments.filter(a => a.status === AppointmentStatus.COMPLETED);
  const totalRevenue = completedApps.reduce((acc, curr) => acc + 50, 0); // Mock logic for demo revenue

  useEffect(() => {
    if (professional && appointments.length > 0) {
      const metrics = {
        totalAppointments: appointments.length,
        pending: pendingApps.length,
        revenue: totalRevenue,
        clients: clients.length
      };
      getBusinessInsights(professional.businessName, metrics).then(setInsights);
    }
  }, [professional, appointments.length]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Panel de Gestión</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Sincronizado y listo para trabajar hoy.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/pro/agenda" className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm">
            Ver Agenda
          </Link>
          <Link to="/pro/agenda" className="px-5 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">
            + Nueva Cita
          </Link>
        </div>
      </div>

      {isInactive && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20">⚠️</div>
              <div>
                 <p className="font-black text-amber-900 dark:text-amber-400 uppercase text-xs tracking-widest">Suscripción Suspendida</p>
                 <p className="text-amber-700 dark:text-amber-500/80 font-medium max-w-lg">Tu perfil no es visible en el directorio. Los pacientes no pueden reservar citas online hasta que actives un plan.</p>
              </div>
           </div>
           <Link to="/pro/subscription" className="w-full md:w-auto px-10 py-4 bg-amber-600 text-white font-black rounded-2xl text-xs uppercase shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all text-center">Activar Mi Plan</Link>
        </div>
      )}

      {/* Grid de Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Reservas Hoy" value={todayApps.length} icon="📅" sub={`${pendingApps.length} por confirmar`} trend="+12%" />
        <StatCard title="Clientes Totales" value={clients.length} icon="👥" sub="Base de datos CRM" trend="+5%" />
        <StatCard title="Ingresos (Mock)" value={`$${totalRevenue}`} icon="💰" sub="Servicios completados" trend="+24%" color="emerald" />
        <StatCard title="Calidad IA" value="8.5/10" icon="✨" sub="Score de puntualidad" trend="Estable" color="indigo" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ui-card p-8">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  Citas para Hoy
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('es-ES', { dateStyle: 'long'})}</span>
             </div>
             
             <div className="space-y-4">
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-2xl"></div>)}
                  </div>
                ) : todayApps.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">☕</div>
                    <p className="text-slate-400 font-bold italic">No tienes citas programadas para hoy.</p>
                  </div>
                ) : (
                  todayApps.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/20 transition-all">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                             <p className="text-xs font-black text-indigo-600">{app.startTime}</p>
                          </div>
                          <div>
                             <p className="font-black text-slate-900 dark:text-white leading-none mb-1">{app.clientName}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.serviceName}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          {app.predictionScore !== undefined && (
                            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${app.predictionScore > 0.7 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                               IA: {Math.round(app.predictionScore * 100)}% asiste
                            </div>
                          )}
                          <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase border ${
                            app.status === AppointmentStatus.CONFIRMED ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                            app.status === AppointmentStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {app.status}
                          </span>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-1 space-y-6">
           <div className="ui-card p-8 bg-indigo-600 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-xl font-black mb-6">AI Insights</h3>
                 {insights ? (
                    <p className="text-indigo-100 font-medium text-sm leading-relaxed animate-fade-in">{insights}</p>
                 ) : (
                    <div className="space-y-3 animate-pulse">
                       <div className="h-4 bg-white/20 rounded w-full"></div>
                       <div className="h-4 bg-white/20 rounded w-5/6"></div>
                       <div className="h-4 bg-white/20 rounded w-4/6"></div>
                    </div>
                 )}
                 <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Recomendación Prioritaria</p>
                    <div className="p-4 bg-white/10 rounded-2xl flex items-start gap-3">
                       <span className="text-lg">💡</span>
                       <p className="text-xs font-bold">Envía recordatorios automáticos 2h antes a clientes con score IA inferior al 60%.</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
           </div>

           <div className="ui-card p-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Acciones Rápidas</h3>
              <div className="grid gap-3">
                 <QuickActionLink to="/pro/agenda" icon="📅" label="Gestionar Agenda" />
                 <QuickActionLink to="/pro/services" icon="🏷️" label="Configurar Servicios" />
                 <QuickActionLink to="/pro/clients" icon="👥" label="Base de Clientes" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, sub, trend, color = 'indigo' }: any) => {
  const colorClasses: any = {
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
    rose: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',
  };

  return (
    <div className="ui-card p-6 group hover:border-indigo-500/30">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-tighter">{sub}</p>
        </div>
        <div className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
          {trend}
        </div>
      </div>
    </div>
  );
};

const QuickActionLink = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
  <Link to={to} className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all flex items-center gap-4 group">
    <span className="text-lg group-hover:scale-125 transition-transform">{icon}</span>
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </Link>
);

export default ProfessionalDashboard;
