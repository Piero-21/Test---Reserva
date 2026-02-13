import { Tenant, Service, Appointment, SubscriptionStatus, SubscriptionPlan, UserRole, User, LogEntry, AppointmentStatus } from '../types';

const defaultHours = [
  { day: 1, open: '09:00', close: '18:00' },
  { day: 2, open: '09:00', close: '18:00' },
  { day: 3, open: '09:00', close: '18:00' },
  { day: 4, open: '09:00', close: '18:00' },
  { day: 5, open: '09:00', close: '17:00' },
];

export const mockTenants: Tenant[] = [
  {
    id: 't1',
    name: 'Clinica Salud Plus',
    professionalName: 'Dr. Roberto Gomez',
    email: 'roberto@saludplus.com',
    category: 'Medicina General',
    status: SubscriptionStatus.ACTIVE,
    plan: SubscriptionPlan.PRO,
    renewalDate: '2025-01-15',
    createdAt: '2023-01-15',
    businessHours: defaultHours,
  },
  {
    id: 't2',
    name: 'MentalCare Center',
    professionalName: 'Lic. Martha Sanchez',
    email: 'martha@mentalcare.com',
    category: 'Psicología',
    status: SubscriptionStatus.ACTIVE,
    plan: SubscriptionPlan.ENTERPRISE,
    renewalDate: '2025-05-20',
    createdAt: '2023-05-20',
    businessHours: defaultHours,
  }
];

export const mockServices: Service[] = [
  { id: 's1', tenantId: 't1', name: 'Consulta General', description: 'Revisión médica completa', duration: 30, price: 50 },
  { id: 's2', tenantId: 't1', name: 'Control Diabetes', description: 'Seguimiento especializado', duration: 45, price: 75 },
  { id: 's3', tenantId: 't2', name: 'Terapia Pareja', description: 'Sesión enfocada en relaciones', duration: 60, price: 100 },
];

let appointments: Appointment[] = [
  { id: 'a1', tenantId: 't1', clientId: 'u3', clientName: 'Juan Perez', serviceId: 's1', serviceName: 'Consulta General', dateTime: '2025-06-10T10:00:00', status: AppointmentStatus.CONFIRMED, predictionScore: 0.95 },
  { id: 'a2', tenantId: 't1', clientId: 'c-high-risk', clientName: 'Carlos Riesgo', serviceId: 's1', serviceName: 'Consulta General', dateTime: '2025-06-10T11:00:00', status: AppointmentStatus.PENDING, predictionScore: 0.15 },
  { id: 'a3', tenantId: 't2', clientId: 'u3', clientName: 'Juan Perez', serviceId: 's3', serviceName: 'Terapia Pareja', dateTime: '2025-06-11T16:00:00', status: AppointmentStatus.CONFIRMED, predictionScore: 0.88 },
  { id: 'h1', tenantId: 't1', clientId: 'c-high-risk', clientName: 'Carlos Riesgo', serviceId: 's1', serviceName: 'Consulta General', dateTime: '2024-01-01T10:00:00', status: AppointmentStatus.CANCELLED },
  { id: 'h2', tenantId: 't1', clientId: 'c-high-risk', clientName: 'Carlos Riesgo', serviceId: 's1', serviceName: 'Consulta General', dateTime: '2024-02-01T10:00:00', status: AppointmentStatus.CANCELLED },
  { id: 'h3', tenantId: 't1', clientId: 'c-high-risk', clientName: 'Carlos Riesgo', serviceId: 's1', serviceName: 'Consulta General', dateTime: '2024-03-01T10:00:00', status: AppointmentStatus.NOSHOW },
  { id: 'h4', tenantId: 't1', clientId: 'u3', clientName: 'Juan Perez', serviceId: 's1', serviceName: 'Consulta General', dateTime: '2024-04-01T10:00:00', status: AppointmentStatus.COMPLETED },
];

export const getAppointments = () => appointments;
export const setAppointments = (newApps: Appointment[]) => { appointments = newApps; };

export const mockUsers: User[] = [
  { id: 'u1', email: 'admin@reservapro.com', role: UserRole.SUPER_ADMIN, name: 'SaaS Administrator' },
  { id: 'u2', email: 'roberto@saludplus.com', role: UserRole.PROFESSIONAL, tenantId: 't1', name: 'Dr. Roberto', avatar: 'https://i.pravatar.cc/150?u=roberto' },
  { id: 'u3', email: 'juan@gmail.com', role: UserRole.CLIENT, name: 'Juan Perez', avatar: 'https://i.pravatar.cc/150?u=juan' },
];

export const mockLogs: LogEntry[] = [
  { id: 'l1', timestamp: '2024-06-01T12:00:00', action: 'LOGIN', user: 'admin@reservapro.com', details: 'Successful login from IP 192.168.1.1' },
];