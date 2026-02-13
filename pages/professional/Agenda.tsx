
import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useProfessionalAppointments, useProfessionalClients, useProfessionalServices } from '../../hooks/useProfessionalData';
import { AppointmentStatus } from '../../domain/types';
import { apiClient } from '../../api';
import { EmptyState } from '../../components/UI/EmptyState';
import { Toast } from '../../components/UI/Toast';

const ProfessionalAgenda: React.FC = () => {
  const { professional } = useAuth();
  const { appointments, refetch, loading } = useProfessionalAppointments(professional?.id);
  const { clients } = useProfessionalClients(professional?.id);
  const { services } = useProfessionalServices(professional?.id);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ clientId: '', serviceId: '', startTime: '09:00' });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const dailyApps = appointments.filter(a => a.date === selectedDate).sort((a,b) => a.startTime.localeCompare(b.startTime));

  const handleManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;
    try {
      await apiClient.createAppointment({
        professionalId: professional.id,
        date: selectedDate,
        ...bookingForm
      });
      setShowModal(false);
      setToast({ message: 'Cita registrada exitosamente', type: 'success' });
      refetch();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await apiClient.updateAppointmentStatus(id, newStatus);
      setToast({ message: `Estado actualizado a ${newStatus}`, type: 'success' });
      refetch();
    } catch (err: any) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Date Picker Sidebar */}
      <div className="lg:col-span-1 space-y-8">
        <div className="ui-card p-8">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Filtrar Agenda</h3>
           <input 
             type="date" 
             className="ui-input font-bold" 
             value={selectedDate}
             onChange={(e) => setSelectedDate(e.target.value)}
           />
           <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setShowModal(true)}
                data-cy="open-manual-booking-btn"
                className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
              >
                + Nueva Cita Manual
              </button>
           </div>
        </div>

        <div className="ui-card p-8 space-y-6">
           <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Resumen del Día</h4>
           <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Citas</span>
              <span className="text-xl font-black dark:text-white">{dailyApps.length}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Confirmadas</span>
              <span className="text-xl font-black text-emerald-500">{dailyApps.filter(a => a.status === AppointmentStatus.CONFIRMED).length}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Canceladas</span>
              <span className="text-xl font-black text-rose-500">{dailyApps.filter(a => a.status === AppointmentStatus.CANCELLED).length}</span>
           </div>
        </div>
      </div>

      {/* Main Agenda List */}
      <div className="lg:col-span-3 space-y-8">
        <div className="flex items-center justify-between mb-2">
           <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mi Agenda</h2>
              <p className="text-slate-500 font-medium text-sm">{new Date(selectedDate).toLocaleDateString('es-ES', { dateStyle: 'full' })}</p>
           </div>
           <span className="px-5 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full text-[11px] font-black uppercase tracking-widest text-indigo-600">
              {loading ? 'Sincronizando...' : 'Actualizado'}
           </span>
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : dailyApps.length === 0 ? (
          <div className="ui-card">
            <EmptyState 
              title="Día Despejado" 
              description="No tienes citas registradas para hoy. ¿Deseas agregar una manualmente?"
              icon="☕"
              action={{ label: "Agregar Cita", onClick: () => setShowModal(true) }}
            />
          </div>
        ) : (
          <div className="grid gap-4" data-cy="appointment-table">
            {dailyApps.map(app => (
              <div key={app.id} data-cy={`appointment-card-${app.id}`} className="ui-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-indigo-500/40">
                 <div className="flex items-center gap-8 w-full sm:w-auto">
                    <div className="text-center min-w-[80px]">
                       <p className="text-3xl font-black text-slate-900 dark:text-white">{app.startTime}</p>
                       {app.predictionScore !== undefined && (
                         <div className="mt-1 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                            <span className="text-[9px] font-black uppercase text-indigo-600">IA: {Math.round(app.predictionScore * 100)}%</span>
                         </div>
                       )}
                    </div>
                    <div className="h-12 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block"></div>
                    <div>
                       <p className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1.5 tracking-tight">{app.clientName}</p>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                         {app.serviceName}
                       </p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50 dark:border-slate-800">
                    <div className="flex gap-2">
                      {app.status === AppointmentStatus.PENDING && (
                        <>
                          <button onClick={() => updateStatus(app.id, AppointmentStatus.CONFIRMED)} className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase hover:bg-indigo-500 transition-all">Confirmar</button>
                          <button onClick={() => updateStatus(app.id, AppointmentStatus.CANCELLED)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black rounded-xl uppercase hover:bg-rose-50 hover:text-rose-600 transition-all">Cancelar</button>
                        </>
                      )}
                      {app.status === AppointmentStatus.CONFIRMED && (
                        <>
                          <button data-cy="btn-complete" onClick={() => updateStatus(app.id, AppointmentStatus.COMPLETED)} className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-xl uppercase hover:bg-emerald-600 transition-all">Completar</button>
                          <button onClick={() => updateStatus(app.id, AppointmentStatus.NOSHOW)} className="px-4 py-2 bg-rose-500 text-white text-[10px] font-black rounded-xl uppercase hover:bg-rose-600 transition-all">No-Show</button>
                        </>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase border min-w-[80px] text-center ${
                      app.status === AppointmentStatus.CONFIRMED ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                      app.status === AppointmentStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      app.status === AppointmentStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      app.status === AppointmentStatus.NOSHOW ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {app.status}
                    </span>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-fade-in">
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white dark:border-slate-800 animate-slide-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black dark:text-white tracking-tighter">Cita Manual</h3>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">✕</button>
              </div>
              <form onSubmit={handleManualBooking} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Cliente</label>
                    <select 
                      required 
                      data-cy="manual-client-select"
                      className="ui-input font-bold appearance-none cursor-pointer"
                      value={bookingForm.clientId}
                      onChange={e => setBookingForm({...bookingForm, clientId: e.target.value})}
                    >
                       <option value="">-- Buscar en base de datos --</option>
                       {clients.map(c => <option key={c.id} value={c.userId || c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Servicio Requerido</label>
                    <select 
                      required 
                      data-cy="manual-service-select"
                      className="ui-input font-bold appearance-none cursor-pointer"
                      value={bookingForm.serviceId}
                      onChange={e => setBookingForm({...bookingForm, serviceId: e.target.value})}
                    >
                       <option value="">-- Elige un servicio --</option>
                       {services.map(s => <option key={s.id} value={s.id}>{s.name} (${s.price})</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fecha</label>
                      <input 
                        type="date" 
                        required 
                        data-cy="manual-date-input"
                        className="ui-input font-bold"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hora</label>
                      <input 
                        type="time" 
                        required 
                        data-cy="manual-time-input"
                        className="ui-input font-bold"
                        value={bookingForm.startTime}
                        onChange={e => setBookingForm({...bookingForm, startTime: e.target.value})}
                      />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancelar</button>
                    <button 
                      type="submit" 
                      data-cy="manual-submit-btn"
                      className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
                    >
                      Registrar Cita
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAgenda;
