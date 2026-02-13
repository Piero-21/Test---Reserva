
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { apiClient } from '../../api';
import { Appointment, AppointmentStatus } from '../../domain/types';
// Changed import from react-router-dom to react-router
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Hola, {user?.name}</h2>
          <p className="text-slate-500">Aquí puedes ver el historial y estado de tus citas.</p>
        </div>
        <Link to="/client/book" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          Reservar Nueva Cita
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Próxima Cita</p>
          <p className="text-xl font-bold text-indigo-600">
            {appointments.find(a => a.status === AppointmentStatus.CONFIRMED) ? appointments.find(a => a.status === AppointmentStatus.CONFIRMED)!.date : 'Ninguna'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Total Reservas</p>
          <p className="text-xl font-bold text-slate-900">{appointments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Puntos Fidelidad</p>
          <p className="text-xl font-bold text-emerald-600">150 pts</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
           <h3 className="font-bold text-slate-800">Mis Reservas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Profesional</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Fecha y Hora</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">No tienes citas programadas todavía.</td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{app.professionalId}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-sm text-slate-700">{app.date} {app.startTime}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${
                          app.status === AppointmentStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-700' :
                          app.status === AppointmentStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
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
