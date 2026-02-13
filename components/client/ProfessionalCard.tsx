
import React from 'react';
import { Link } from 'react-router';
import { ProfessionalProfile } from '../../domain/types';

export const ProfessionalCard: React.FC<{ prof: ProfessionalProfile }> = ({ prof }) => {
  return (
    <div data-cy={`professional-card-${prof.id}`} className="ui-card group hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full">
      <div className="h-32 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 dark:from-indigo-500/5 dark:to-transparent relative">
         <div className="absolute -bottom-6 left-6 w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl p-1 shadow-lg ring-4 ring-slate-50 dark:ring-slate-950">
            <img 
              src={`https://ui-avatars.com/api/?name=${prof.businessName}&background=random&color=fff&size=128`} 
              className="w-full h-full rounded-2xl object-cover"
              alt={prof.businessName}
            />
         </div>
      </div>
      <div className="p-6 pt-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
           <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-indigo-600 transition-colors">{prof.businessName}</h3>
              <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">{prof.specialty}</p>
           </div>
           <div className="flex items-center text-amber-500 font-black text-xs">
              ⭐ 4.9
           </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 mb-6 flex-1">
          {prof.bio}
        </p>
        <div className="flex items-center gap-3 mb-8 text-[11px] font-bold text-slate-400">
           <span className="flex items-center gap-1">📍 {prof.location}</span>
           <span>•</span>
           <span className="flex items-center gap-1">🕒 09:00 - 18:00</span>
        </div>
        <Link 
          to={`/p/${prof.id}`} 
          data-cy="view-profile-btn"
          className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl text-center shadow-lg shadow-black/10 hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all"
        >
          Ver Perfil Completo
        </Link>
      </div>
    </div>
  );
};
