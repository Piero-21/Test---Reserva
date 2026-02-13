
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api';
import { Appointment, AppointmentStatus } from '../../domain/types';
import { Link } from 'react-router';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      apiClient.getAppointments({ clientId: user.id }).then(setAppointments);
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Hola, {user?.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Aquí puedes ver el historial y estado de tus citas.</p>
        </div>
        <Link 
          to="/directory" 
          className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
        >
          Reservar Nueva Cita
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ui-card p-8 text-center group">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Próxima Cita</p>
          <p className="text-2xl font-black text-indigo-600 group-hover:scale-110 transition-transform">
            {appointments.find(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING) 
              ? appointments.find(a => a.status === AppointmentStatus.CONFIRMED || a.status === AppointmentStatus.PENDING)!.date 
              : 'Ninguna'}
          </p>
        </div>
        <div className="ui-card p-8 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Reservas</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{appointments.length}</p>
        </div>
        <div className="ui-card p-8 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nivel Usuario</p>
          <p className="text-2xl font-black text-emerald-600 uppercase tracking-tighter">Premium</p>
        </div>
      </div>

      <div className="ui-card overflow-hidden shadow-xl border-slate-100 dark:border-slate-800">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800">
           <h3 className="font-black text-slate-800 dark:text-white text-xl tracking-tight">Mis Reservas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Profesional / Clínica</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Fecha y Hora</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-14 text-center text-slate-400 font-bold italic">No tienes citas programadas todavía.</td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-500/5 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 font-black">🏢</div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white tracking-tight">{app.professionalId === 'p1' ? 'Clinica Salud Plus' : app.professionalId === 'p2' ? 'MentalCare Center' : 'Especialista'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.serviceName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-black text-slate-700 dark:text-slate-300">{app.date}</p>
                       <p className="text-xs text-slate-400 font-bold">{app.startTime}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase border ${
                          app.status === AppointmentStatus.CONFIRMED ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          app.status === AppointmentStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          app.status === AppointmentStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                       }`}>
                         {app.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
