
import React, { useState, useEffect } from 'react';
// Changed import from react-router-dom to react-router
import { useParams, Link, useNavigate } from 'react-router';
import { apiClient } from '../../api';
import { ProfessionalProfile, Service, Slot, AppointmentStatus } from '../../domain/types';
import { useAuth } from '../../auth/AuthContext';

const ProfessionalProfilePublic: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prof, setProf] = useState<ProfessionalProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (profId: string) => {
    setLoading(true);
    const [p, s, sl] = await Promise.all([
      apiClient.getProfessionalById(profId),
      apiClient.getProfessionalServices(profId),
      apiClient.getProfessionalSlots(profId)
    ]);
    setProf(p);
    setServices(s);
    setSlots(sl);
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }
    if (!selectedService || !selectedSlot) return;

    setBooking(true);
    setError(null);
    try {
      await apiClient.createAppointment({
        professionalId: id,
        clientId: user.id,
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedSlot,
      });
      navigate('/client/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Cargando perfil profesional...</div>;
  if (!prof) return <div className="p-20 text-center font-bold">Profesional no encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
             <div className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl p-1 mx-auto mb-6 shadow-xl">
                <img src={`https://ui-avatars.com/api/?name=${prof.businessName}&size=200&background=6366f1&color=fff`} className="w-full h-full rounded-2xl object-cover" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{prof.businessName}</h2>
             <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg">{prof.specialty}</span>
             <p className="text-slate-500 dark:text-slate-400 mt-6 leading-relaxed font-medium text-sm">{prof.bio}</p>
             <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-left space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                   <span className="text-lg">📍</span> {prof.location}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                   <span className="text-lg">💬</span> Habla Español, Inglés
                </div>
             </div>
          </div>
          
          <Link to="/directory" className="block text-center text-slate-400 font-bold hover:text-indigo-600 transition-colors">← Volver al Directorio</Link>
        </div>

        {/* Booking Section */}
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <div className="p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 rounded-3xl font-bold animate-shake">
               ⚠️ {error}
            </div>
          )}

          <section className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="text-2xl font-black mb-8 dark:text-white tracking-tight">1. Selecciona un Servicio</h3>
             <div className="grid gap-4">
                {services.map(s => (
                   <button 
                     key={s.id} 
                     onClick={() => setSelectedService(s)}
                     className={`p-6 rounded-3xl border-2 text-left transition-all ${selectedService?.id === s.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-slate-50 dark:border-slate-800 hover:border-slate-200'}`}
                   >
                      <div className="flex justify-between items-center">
                         <div>
                            <p className="font-black text-slate-900 dark:text-white">{s.name}</p>
                            <p className="text-sm text-slate-400 font-medium">{s.description}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-indigo-600 dark:text-indigo-400 font-black text-xl">${s.price}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.durationMinutes} MIN</p>
                         </div>
                      </div>
                   </button>
                ))}
             </div>
          </section>

          {selectedService && (
            <section className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h3 className="text-2xl font-black mb-8 dark:text-white tracking-tight">2. Elige Fecha y Hora</h3>
               <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Seleccionar Fecha</label>
                     <input 
                       type="date" 
                       value={selectedDate} 
                       onChange={(e) => setSelectedDate(e.target.value)}
                       min={new Date().toISOString().split('T')[0]}
                       className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold"
                     />
                  </div>
                  <div className="md:w-1/2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Horarios Disponibles</label>
                     <div className="grid grid-cols-3 gap-2">
                        {slots.length === 0 ? (
                           <p className="col-span-full text-xs text-slate-400 font-bold italic">No hay horarios configurados.</p>
                        ) : (
                          slots.map(sl => (
                            <button 
                              key={sl.id} 
                              onClick={() => setSelectedSlot(sl.startTime)}
                              className={`p-3 text-xs font-black rounded-xl border transition-all ${selectedSlot === sl.startTime ? 'bg-slate-900 text-white border-slate-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-500'}`}
                            >
                               {sl.startTime}
                            </button>
                          ))
                        )}
                     </div>
                  </div>
               </div>
               
               <div className="mt-12 p-8 bg-slate-900 dark:bg-indigo-600 rounded-[32px] text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div>
                     <p className="text-[10px] font-black text-indigo-300 dark:text-indigo-200 uppercase tracking-widest mb-1">Total a confirmar</p>
                     <p className="text-3xl font-black">${selectedService.price}</p>
                     <p className="text-xs font-bold text-indigo-200 mt-1">{selectedSlot ? `${selectedDate} a las ${selectedSlot}` : 'Falta seleccionar hora'}</p>
                  </div>
                  <button 
                    disabled={!selectedSlot || booking}
                    onClick={handleBooking}
                    className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {booking ? 'Procesando...' : 'Confirmar Reserva'}
                  </button>
               </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePublic;
