
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api';
import { SubscriptionStatus, ProfessionalProfile } from '../../domain/types';

const SuperAdminDashboard: React.FC = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    const data = await apiClient.getTenants();
    setTenants(data);
    setLoading(false);
  };

  const toggleVisibility = async (prof: ProfessionalProfile) => {
    await apiClient.updateProfessionalProfile(prof.id, { isVisibleInDirectory: !prof.isVisibleInDirectory });
    loadTenants();
  };

  const changeSubscription = async (profId: string, status: SubscriptionStatus) => {
    await apiClient.updateSubscription(profId, status);
    loadTenants();
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">SaaS Command Center</h2>
          <p className="text-slate-500 font-medium">Gestión global de la infraestructura de ReservaPro.</p>
        </div>
        <div className="px-6 py-2 bg-indigo-600/10 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
           Sistema Saludable • Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Tenants" value={tenants.length} icon="🏢" color="indigo" />
        <MetricCard title="Ingresos Mensuales" value={`$${tenants.length * 29}.00`} icon="📈" color="emerald" />
        <MetricCard title="Suscripciones Críticas" value={tenants.filter(t => t.subscriptionStatus !== SubscriptionStatus.ACTIVE).length} icon="⚠️" color="rose" />
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-black dark:text-white">Gestión de Profesionales</h3>
            <button onClick={loadTenants} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                     <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Negocio / Dueño</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibilidad</th>
                     <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Suscripción</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={4} className="p-20 text-center animate-pulse">Cargando base de datos global...</td></tr>
                  ) : tenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                       <td className="px-8 py-6">
                          <p className="font-black text-slate-900 dark:text-white">{t.businessName}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase">{t.user?.email}</p>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black rounded-lg uppercase">{t.subscriptionPlan}</span>
                       </td>
                       <td className="px-8 py-6">
                          <button 
                            onClick={() => toggleVisibility(t)}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${t.isVisibleInDirectory ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}
                          >
                            {t.isVisibleInDirectory ? 'Visible' : 'Oculto'}
                          </button>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end gap-2">
                             <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${t.subscriptionStatus === SubscriptionStatus.ACTIVE ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {t.subscriptionStatus}
                             </span>
                             <div className="flex gap-2">
                                <button onClick={() => changeSubscription(t.id, SubscriptionStatus.ACTIVE)} className="text-[10px] font-bold text-emerald-600 hover:underline">Activar</button>
                                <button onClick={() => changeSubscription(t.id, SubscriptionStatus.SUSPENDED)} className="text-[10px] font-bold text-rose-600 hover:underline">Suspender</button>
                             </div>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }: any) => {
   const colorMap: any = {
      indigo: 'from-indigo-500/10 text-indigo-600 border-indigo-100',
      emerald: 'from-emerald-500/10 text-emerald-600 border-emerald-100',
      rose: 'from-rose-500/10 text-rose-600 border-rose-100',
   };
   return (
      <div className={`p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all`}>
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
         </div>
         <div className="text-4xl group-hover:scale-125 transition-transform">{icon}</div>
      </div>
   );
}

export default SuperAdminDashboard;
