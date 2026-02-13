
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api';
import { ProfessionalProfile, Service } from '../../domain/types';

const BookingEngine: React.FC = () => {
  const { professionalId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [prof, setProf] = useState<ProfessionalProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Selection State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({ name: '', phone: '', email: '' });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (professionalId) loadProfessional(professionalId);
  }, [professionalId]);

  useEffect(() => {
    if (selectedService && selectedDate && professionalId) {
      loadAvailability(professionalId, selectedDate);
    }
  }, [selectedService, selectedDate, professionalId]);

  const loadProfessional = async (id: string) => {
    setLoading(true);
    const [p, s] = await Promise.all([
      apiClient.getProfessionalById(id),
      apiClient.getProfessionalServices(id)
    ]);
    setProf(p);
    setServices(s);
    
    // Auto-select service if in URL
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const found = s.find(svc => svc.id === serviceId);
      if (found) {
        setSelectedService(found);
        setStep(2);
      }
    }
    setLoading(false);
  };

  const loadAvailability = async (id: string, date: string) => {
    const times = await apiClient.getAvailableTimes(id, date);
    setAvailableTimes(times);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (!professionalId || !selectedService || !selectedTime) return;
    
    setProcessing(true);
    setError(null);
    try {
      await apiClient.createAppointment({
        professionalId,
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedTime,
        clientId: user?.id,
        guestInfo: !user ? guestInfo : undefined
      });
      navigate('/client/dashboard'); // Or a generic success page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Iniciando sistema de reservas...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="mb-10 flex items-center justify-between">
        <div>
           <Link to={`/p/${professionalId}`} className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">← Volver al Perfil</Link>
           <h2 className="text-3xl font-black dark:text-white mt-2">Reservar en {prof?.businessName}</h2>
        </div>
        <div className="hidden md:flex items-center gap-1">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                {step > s ? '✓' : s}
             </div>
           ))}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 rounded-3xl font-bold animate-shake">
           ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: SERVICE */}
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
               <h3 className="text-xl font-bold dark:text-white mb-6">¿Qué servicio necesitas?</h3>
               {services.map(s => (
                 <button 
                   key={s.id} 
                   onClick={() => { setSelectedService(s); setStep(2); }}
                   className="w-full ui-card p-6 flex justify-between items-center group hover:border-indigo-600 transition-all text-left"
                 >
                   <div>
                      <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.durationMinutes} min</p>
                   </div>
                   <p className="font-black text-indigo-600 group-hover:scale-110 transition-transform">${s.price}</p>
                 </button>
               ))}
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
               <div>
                  <h3 className="text-xl font-bold dark:text-white mb-4">Selecciona Fecha</h3>
                  <input 
                    type="date" 
                    className="ui-input w-full p-4 font-bold" 
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
               </div>

               <div>
                  <h3 className="text-xl font-bold dark:text-white mb-4">Horarios Disponibles</h3>
                  {availableTimes.length === 0 ? (
                    <div className="p-10 bg-slate-100 dark:bg-slate-900 rounded-3xl text-center">
                       <p className="text-slate-400 font-bold italic">No hay horarios disponibles para este día.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableTimes.map(time => (
                        <button 
                          key={time}
                          onClick={() => { setSelectedTime(time); setStep(3); }}
                          className={`p-4 rounded-2xl font-black text-xs border transition-all ${selectedTime === time ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 hover:border-indigo-500'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* STEP 3: CONTACT INFO (if guest) */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <h3 className="text-xl font-bold dark:text-white mb-6">Detalles de Contacto</h3>
               {user ? (
                 <div className="p-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl">
                    <p className="text-emerald-600 font-bold">Identificado como {user.name}</p>
                    <p className="text-xs text-emerald-500 mt-1">Usaremos tus datos guardados para la reserva.</p>
                    <button onClick={() => setStep(4)} className="mt-6 px-8 py-3 bg-emerald-500 text-white font-black rounded-xl text-xs">Continuar</button>
                 </div>
               ) : (
                 <div className="space-y-4">
                    <input 
                      className="ui-input w-full p-4" 
                      placeholder="Nombre Completo" 
                      value={guestInfo.name}
                      onChange={e => setGuestInfo({...guestInfo, name: e.target.value})}
                    />
                    <input 
                      className="ui-input w-full p-4" 
                      placeholder="Teléfono de Contacto" 
                      value={guestInfo.phone}
                      onChange={e => setGuestInfo({...guestInfo, phone: e.target.value})}
                    />
                    <input 
                      className="ui-input w-full p-4" 
                      placeholder="Email (Opcional)" 
                      value={guestInfo.email}
                      onChange={e => setGuestInfo({...guestInfo, email: e.target.value})}
                    />
                    <button 
                      disabled={!guestInfo.name || !guestInfo.phone}
                      onClick={() => setStep(4)} 
                      className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl disabled:opacity-50"
                    >
                      Siguiente Paso
                    </button>
                 </div>
               )}
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-8 animate-in zoom-in duration-300">
               <div className="p-10 bg-indigo-600 rounded-[3rem] text-white text-center shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✨</div>
                  <h3 className="text-3xl font-black mb-2">Casi listo</h3>
                  <p className="text-indigo-100 font-medium">Por favor, revisa que los datos de tu cita sean correctos antes de confirmar.</p>
               </div>
               
               <button 
                 disabled={processing}
                 onClick={handleConfirm}
                 className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-black rounded-[2rem] text-xl shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all"
               >
                 {processing ? 'Procesando Reserva...' : 'Confirmar y Reservar'}
               </button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="ui-card p-8 sticky top-32">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Resumen de Cita</h4>
             <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">🏷️</div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Servicio</p>
                      <p className="text-sm font-bold dark:text-white">{selectedService?.name || 'No seleccionado'}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">📅</div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fecha y Hora</p>
                      <p className="text-sm font-bold dark:text-white">{selectedDate} {selectedTime ? `@ ${selectedTime}` : ''}</p>
                   </div>
                </div>
                {selectedService && (
                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <p className="font-bold text-slate-900 dark:text-white">Precio Total</p>
                      <p className="text-2xl font-black text-indigo-600">${selectedService.price}</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingEngine;
