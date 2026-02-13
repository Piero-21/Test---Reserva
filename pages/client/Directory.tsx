
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api';
import { ProfessionalProfile } from '../../domain/types';
import { ProfessionalCard } from '../../components/client/ProfessionalCard';

const Directory: React.FC = () => {
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('Todas');
  const [loading, setLoading] = useState(true);

  const specialties = ['Todas', 'Medicina General', 'Psicología', 'Odontología', 'Legal', 'Técnico'];

  useEffect(() => {
    loadProfessionals();
  }, [search, specialty]);

  const loadProfessionals = async () => {
    setLoading(true);
    const data = await apiClient.getProfessionals(search, specialty);
    setProfessionals(data);
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <header className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">Encuentra a tu especialista</h2>
        <p className="text-lg text-slate-500 font-medium">Los mejores profesionales de tu zona, listos para atenderte.</p>
      </header>

      <section className="ui-card p-4 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
           <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
           <input 
             type="text" 
             placeholder="Buscar por nombre o clínica..." 
             className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-[1.25rem] py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white font-medium"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="md:w-64">
           <select 
             className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-[1.25rem] py-4 px-6 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold dark:text-white appearance-none"
             value={specialty}
             onChange={(e) => setSpecialty(e.target.value)}
           >
             {specialties.map(s => <option key={s} value={s}>{s}</option>)}
           </select>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map(i => <div key={i} className="h-96 bg-slate-200 dark:bg-slate-900 rounded-[2rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionals.length === 0 ? (
             <div className="col-span-full py-20 text-center">
                <p className="text-5xl mb-6">🔍</p>
                <p className="text-xl font-bold text-slate-500">No encontramos resultados para esta búsqueda.</p>
             </div>
          ) : (
            professionals.map(p => <ProfessionalCard key={p.id} prof={p} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Directory;
