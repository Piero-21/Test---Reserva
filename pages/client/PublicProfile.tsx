
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { apiClient } from '../../api';
import { ProfessionalProfile, Service } from '../../domain/types';

const PublicProfile: React.FC = () => {
  const { professionalId } = useParams();
  const [prof, setProf] = useState<ProfessionalProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (professionalId) {
      loadData(professionalId);
    }
  }, [professionalId]);

  const loadData = async (id: string) => {
    setLoading(true);
    const [p, s] = await Promise.all([
      apiClient.getProfessionalById(id),
      apiClient.getProfessionalServices(id)
    ]);
    setProf(p);
    setServices(s);
    setLoading(false);
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Cargando perfil...</div>;
  if (!prof) return <div className="p-20 text-center font-bold text-rose-500">Profesional no encontrado.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Sidebar Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="ui-card p-10 text-center">
           <img 
             src={`https://ui-avatars.com/api/?name=${prof.businessName}&size=256&background=6366f1&color=fff`} 
             className="w-32 h-32 rounded-[2.5rem] shadow-2xl mx-auto mb-6 ring-4 ring-indigo-50 dark:ring-indigo-500/10" 
             alt={prof.businessName}
           />
           <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{prof.businessName}</h2>
           <p className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mt-2">{prof.specialty}</p>
           
           <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-left space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg">📍</div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</p>
                    <p className="text-sm font-bold dark:text-white">{prof.location}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-lg">⭐</div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calificación</p>
                    <p className="text-sm font-bold dark:text-white">4.9 (120 Reseñas)</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="ui-card p-8">
           <h4 className="text-sm font-black uppercase tracking-widest mb-4 dark:text-white">Acerca de</h4>
           <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{prof.bio}</p>
        </div>
      </div>

      {/* Services List */}
      <div className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-center">
           <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Nuestros Servicios</h3>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{services.length} opciones disponibles</span>
        </div>

        <div className="grid gap-4">
          {services.map(s => (
            <div key={s.id} className="ui-card p-8 group hover:border-indigo-500/30 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex-1">
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">{s.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-lg">{s.description}</p>
                  <div className="mt-4 flex items-center gap-4">
                     <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {s.durationMinutes} Minutos
                     </span>
                  </div>
               </div>
               <div className="text-right w-full md:w-auto">
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-4">${s.price}</p>
                  <Link 
                    to={`/p/${prof.id}/book?service=${s.id}`} 
                    className="block w-full px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all text-sm uppercase tracking-widest"
                  >
                    Reservar
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
