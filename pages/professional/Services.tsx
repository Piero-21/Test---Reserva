
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api';
import { Service } from '../../domain/types';
import { EmptyState } from '../../components/UI/EmptyState';
import { Toast } from '../../components/UI/Toast';

const ProfessionalServices: React.FC = () => {
  const { professional } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, durationMinutes: 30 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (professional) {
      loadServices();
    }
  }, [professional]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getProfessionalServices(professional!.id);
      setServices(data);
    } catch (err: any) {
      setToast({ message: 'Error cargando servicios', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: 0, durationMinutes: 30 });
    setShowModal(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setFormData({ name: service.name, description: service.description, price: service.price, durationMinutes: service.durationMinutes });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;
    try {
      if (editingService) {
        await apiClient.updateService(editingService.id, formData);
        setToast({ message: 'Servicio actualizado', type: 'success' });
      } else {
        await apiClient.createService({
          professionalId: professional.id,
          ...formData
        });
        setToast({ message: 'Servicio creado', type: 'success' });
      }
      setShowModal(false);
      loadServices();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas desactivar este servicio? No aparecerá más en el directorio.')) return;
    try {
      await apiClient.deleteService(id);
      setToast({ message: 'Servicio desactivado', type: 'success' });
      loadServices();
    } catch (err: any) {
      setToast({ message: 'Error al desactivar', type: 'error' });
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Catálogo</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestiona tu oferta de servicios profesionales.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          data-cy="create-service-btn"
          className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          + Nuevo Servicio
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-[2.5rem]"></div>)}
        </div>
      ) : services.length === 0 ? (
        <div className="ui-card">
           <EmptyState 
            title="Sin Servicios" 
            description="Tu catálogo está vacío. Crea tu primer servicio para empezar a recibir reservas online."
            icon="🏷️"
            action={{ label: "Crear Servicio", onClick: handleOpenCreate }}
           />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(s => (
            <div key={s.id} data-cy={`service-card-${s.id}`} className="ui-card p-10 flex flex-col justify-between group hover:border-indigo-500/30">
               <div>
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-indigo-100 dark:border-indigo-500/10">✨</div>
                     <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg">{s.durationMinutes} MIN</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{s.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 font-medium line-clamp-3">{s.description}</p>
               </div>
               <div className="pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${s.price}</p>
                  <div className="flex gap-2">
                     <button onClick={() => handleOpenEdit(s)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                     </button>
                     <button onClick={() => handleDelete(s.id)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
           <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] w-full max-w-xl shadow-2xl border border-white dark:border-slate-800 animate-slide-up">
              <h3 className="text-4xl font-black mb-10 dark:text-white tracking-tighter">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Nombre Comercial</label>
                    <input 
                      required 
                      data-cy="service-name-input"
                      className="ui-input font-bold text-lg" 
                      placeholder="Ej: Consulta Médica General"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Descripción del Servicio</label>
                    <textarea 
                      data-cy="service-desc-input"
                      className="ui-input font-medium h-32 resize-none" 
                      placeholder="Explica en qué consiste el servicio..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Precio ($)</label>
                       <input 
                         type="number"
                         required 
                         data-cy="service-price-input"
                         className="ui-input font-black text-2xl text-indigo-600" 
                         value={formData.price}
                         onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Duración (min)</label>
                       <input 
                         type="number"
                         required 
                         data-cy="service-duration-input"
                         className="ui-input font-black text-2xl" 
                         value={formData.durationMinutes}
                         onChange={e => setFormData({...formData, durationMinutes: Number(e.target.value)})}
                       />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-10">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cancelar</button>
                    <button 
                      type="submit" 
                      data-cy="save-service-btn"
                      className="flex-2 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
                    >
                      {editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalServices;
