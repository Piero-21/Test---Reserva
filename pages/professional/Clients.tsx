
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api';
import { ClientProfile } from '../../domain/types';
import { EmptyState } from '../../components/UI/EmptyState';
import { Toast } from '../../components/UI/Toast';

const ProfessionalClients: React.FC = () => {
  const { professional } = useAuth();
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (professional) {
      loadClients();
    }
  }, [professional]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getClients(professional!.id);
      setClients(data);
    } catch (err: any) {
      setToast({ message: 'Error cargando clientes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createClient({ ...newClient, professionalId: professional!.id });
      setShowModal(false);
      setNewClient({ name: '', phone: '', email: '' });
      setToast({ message: 'Cliente agregado exitosamente', type: 'success' });
      loadClients();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">CRM Clientes</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Historial y gestión de tus pacientes registrados.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          + Agregar Cliente
        </button>
      </div>

      <div className="ui-card p-4 glass border-indigo-500/10">
         <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre, teléfono o email..." 
              className="ui-input w-full pl-14"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div className="ui-card overflow-hidden shadow-xl border-slate-100 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Nombre / Identidad</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Contacto Directo</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Procedencia</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center font-bold text-slate-400 animate-pulse">Consultando CRM...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                   <td colSpan={4}>
                      <EmptyState 
                        title="Sin resultados" 
                        description={search ? "No hay clientes que coincidan con tu búsqueda." : "Tu base de datos de clientes está vacía."} 
                        icon="👤"
                        action={search ? undefined : { label: "Agregar Primer Cliente", onClick: () => setShowModal(true) }}
                      />
                   </td>
                </tr>
              ) : (
                filteredClients.map(c => (
                  <tr key={c.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-500/5 transition-all group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-5">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${c.name}&background=6366f1&color=fff&size=80&bold=true`} 
                            className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white dark:border-slate-800" 
                          />
                          <p className="font-black text-slate-900 dark:text-white tracking-tight text-lg">{c.name}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black dark:text-slate-200">{c.phone}</p>
                       <p className="text-xs text-slate-400 font-medium">{c.email || 'No proporcionó email'}</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase border transition-all ${c.userId ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-100' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100'}`}>
                          {c.userId ? 'Registrado App' : 'Carga Manual'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase hover:scale-105 transition-all shadow-sm">Ver Ficha</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] w-full max-w-lg shadow-2xl border border-white dark:border-slate-800 animate-slide-up">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-3xl font-black dark:text-white tracking-tighter">Nuevo Cliente</h3>
                 <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-950">✕</button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nombre Completo</label>
                    <input 
                      required 
                      className="ui-input font-bold" 
                      placeholder="Ej: Juan Pérez"
                      value={newClient.name}
                      onChange={e => setNewClient({...newClient, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Teléfono Móvil</label>
                       <input 
                         required 
                         className="ui-input font-bold" 
                         placeholder="+54 9 11..."
                         value={newClient.phone}
                         onChange={e => setNewClient({...newClient, phone: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email (Opcional)</label>
                       <input 
                         type="email"
                         className="ui-input font-medium" 
                         placeholder="email@ejemplo.com"
                         value={newClient.email}
                         onChange={e => setNewClient({...newClient, email: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-8">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancelar</button>
                    <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">Guardar Ficha</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalClients;
