
import { Appointment, AppointmentStatus, Service, Tenant } from '../types';
import { getAppointments, setAppointments, mockTenants } from './mockData';

export class BookingConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingConflictError';
  }
}

/**
 * Calculates if a client is at high risk of No-Show
 * Rule: More than 2 historical cancellations or no-shows.
 */
export const getClientRiskProfile = (clientId: string) => {
  const history = getAppointments().filter(a => 
    a.clientId === clientId && 
    (a.status === AppointmentStatus.CANCELLED || a.status === AppointmentStatus.NOSHOW)
  );
  
  return {
    isHighRisk: history.length > 2,
    cancellationCount: history.length
  };
};

export const getAvailableSlots = (tenantId: string, date: Date, service: Service): string[] => {
  const tenant = mockTenants.find(t => t.id === tenantId);
  if (!tenant) return [];

  const dayOfWeek = date.getDay();
  const hours = tenant.businessHours.find(bh => bh.day === dayOfWeek);
  if (!hours) return [];

  const slots: string[] = [];
  const startStr = `${date.toISOString().split('T')[0]}T${hours.open}:00`;
  const endStr = `${date.toISOString().split('T')[0]}T${hours.close}:00`;
  
  let current = new Date(startStr);
  const end = new Date(endStr);

  const existingApps = getAppointments().filter(a => 
    a.tenantId === tenantId && 
    a.dateTime.startsWith(date.toISOString().split('T')[0]) &&
    a.status !== AppointmentStatus.CANCELLED
  );

  while (current < end) {
    const slotTimeStr = current.toISOString().slice(0, 16);
    
    // Check if slot overlaps with any existing appointment
    const isOccupied = existingApps.some(app => {
      const appStart = new Date(app.dateTime);
      const appEnd = new Date(appStart.getTime() + 30 * 60000); // Default 30 min
      return current >= appStart && current < appEnd;
    });

    if (!isOccupied) {
      slots.push(slotTimeStr);
    }
    
    current = new Date(current.getTime() + 30 * 60000);
  }

  return slots;
};

export const createAppointment = async (data: Omit<Appointment, 'id' | 'status' | 'predictionScore'>): Promise<Appointment> => {
  const existing = getAppointments().find(a => 
    a.tenantId === data.tenantId && 
    a.dateTime === data.dateTime && 
    a.status !== AppointmentStatus.CANCELLED
  );

  if (existing) {
    throw new BookingConflictError('409 Conflict: Horario no disponible');
  }

  // AI Simulation based on history
  const risk = getClientRiskProfile(data.clientId);
  const baseScore = risk.isHighRisk ? 0.2 : 0.85;

  const newApp: Appointment = {
    ...data,
    id: `a${Date.now()}`,
    status: AppointmentStatus.PENDING,
    predictionScore: baseScore + (Math.random() * 0.1) // Noise
  };

  const all = getAppointments();
  setAppointments([...all, newApp]);
  return newApp;
};

export const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus): Appointment => {
  const all = getAppointments();
  const appIndex = all.findIndex(a => a.id === id);
  if (appIndex === -1) throw new Error('Appointment not found');

  const app = all[appIndex];
  
  // State Machine Validation
  const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.PENDING]: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
    [AppointmentStatus.CONFIRMED]: [AppointmentStatus.COMPLETED, AppointmentStatus.NOSHOW, AppointmentStatus.CANCELLED],
    [AppointmentStatus.CANCELLED]: [],
    [AppointmentStatus.COMPLETED]: [],
    [AppointmentStatus.NOSHOW]: [],
  };

  if (!validTransitions[app.status].includes(newStatus)) {
    throw new Error(`Transición inválida de ${app.status} a ${newStatus}`);
  }

  const updatedApp = { ...app, status: newStatus };
  const newAll = [...all];
  newAll[appIndex] = updatedApp;
  setAppointments(newAll);
  return updatedApp;
};
