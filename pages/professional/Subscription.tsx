
import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { SubscriptionPlan, SubscriptionStatus } from '../../domain/types';
import { apiClient } from '../../api';

const SubscriptionPage: React.FC = () => {
  const { professional } = useAuth();

  const handleActivate = async (status: SubscriptionStatus) => {
    if (!professional) return;
    try {
      await apiClient.updateSubscription(professional.id, status);
      window.location.reload(); // Refresh session
    } catch (err: any) {
      alert(err.message);
    }
  };

  const plans = [
    { name: SubscriptionPlan.FREE, price: 0, features: ['Hasta 3 servicios', 'Agenda básica', 'Directorio público limitado'] },
    { name: SubscriptionPlan.PRO, price: 29, features: ['Servicios ilimitados', 'Gestión de Clientes CRM', 'Directorio destacado', 'AI No-Show Predictions'], active: professional?.subscriptionPlan === SubscriptionPlan.PRO },
    { name: SubscriptionPlan.ENTERPRISE, price: 99, features: ['Todo lo de PRO', 'Multi-usuario', 'API Access', 'Soporte prioritario 24/7'] },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="text-center">
         <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">Gestiona tu Plan</h2>
         <p className="text-slate-500 font-medium max-w-xl mx-auto">Potencia tu negocio con las herramientas avanzadas de ReservaPro SaaS.</p>
      </header>

      <div className="ui-card p-10 bg-indigo-600 text-white flex flex-col md:flex-row items-center justify-between gap-8">
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-1">Estado Actual</p>
            <h3 className="text-3xl font-black">{professional?.subscriptionStatus}</h3>
            <p className="text-indigo-100 mt-1 font-medium italic">Vence en 15 días (Trial)</p>
         </div>
         <div className="flex gap-4">
            {professional?.subscriptionStatus !== SubscriptionStatus.ACTIVE ? (
               <button 
                 onClick={() => handleActivate(SubscriptionStatus.ACTIVE)}
                 className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-all"
               >
                 Activar Plan Pro Ahora
               </button>
            ) : (
               <button className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl border border-white/20">Gestionar Facturación</button>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {plans.map(plan => (
           <div key={plan.name} className={`ui-card p-10 flex flex-col ${plan.active ? 'ring-2 ring-indigo-600 relative' : ''}`}>
              {plan.active && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Plan Actual</span>}
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{plan.name}</h4>
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-8">${plan.price}<span className="text-sm text-slate-400 font-bold tracking-normal">/mes</span></p>
              
              <ul className="space-y-4 mb-10 flex-1">
                 {plan.features.map(f => (
                   <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-500">
                      <span className="text-indigo-600">✓</span> {f}
                   </li>
                 ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-black uppercase text-xs transition-all ${plan.active ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800'}`}>
                 {plan.active ? 'Plan Activo' : 'Cambiar Plan'}
              </button>
           </div>
         ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
