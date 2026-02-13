
import { IApiClient, AuthResponse } from './types';
import { 
  User, 
  UserRole, 
  ProfessionalProfile, 
  Service, 
  Appointment, 
  Slot, 
  SubscriptionStatus, 
  AppointmentStatus, 
  SubscriptionPlan, 
  ClientProfile 
} from '../domain/types';

export const DB_KEY = 'reservapro_db_v3_stable';

interface MockDB {
  users: User[];
  professionals: ProfessionalProfile[];
  services: Service[];
  slots: Slot[];
  appointments: Appointment[];
  clients: ClientProfile[];
}

export class MockApiClient implements IApiClient {
  private getDB(): MockDB {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      const initial: MockDB = {
        users: [
          { id: 'u1', name: 'Admin SaaS', email: 'admin@reservapro.com', role: UserRole.SUPER_ADMIN },
          { id: 'u2', name: 'Dr. Roberto Gomez', email: 'roberto@saludplus.com', role: UserRole.PROFESSIONAL },
          { id: 'u3', name: 'Juan Perez', email: 'juan@gmail.com', role: UserRole.CLIENT },
          { id: 'u4', name: 'Lic. Martha Sanchez', email: 'martha@care.com', role: UserRole.PROFESSIONAL },
        ],
        professionals: [
          { id: 'p1', userId: 'u2', specialty: 'Medicina General', bio: 'Experto en salud familiar con más de 15 años de experiencia.', subscriptionStatus: SubscriptionStatus.ACTIVE, subscriptionPlan: SubscriptionPlan.PRO, isVisibleInDirectory: true, businessName: 'Clinica Salud Plus', location: 'Centro Médico, Local 4' },
          { id: 'p2', userId: 'u4', specialty: 'Psicología', bio: 'Terapia cognitiva conductual para adultos y parejas.', subscriptionStatus: SubscriptionStatus.ACTIVE, subscriptionPlan: SubscriptionPlan.ENTERPRISE, isVisibleInDirectory: true, businessName: 'MentalCare Center', location: 'Torre Empresarial, Piso 10' }
        ],
        services: [
          { id: 's1', professionalId: 'p1', name: 'Consulta General', description: 'Evaluación integral de salud física.', durationMinutes: 30, price: 50, active: true },
          { id: 's2', professionalId: 'p1', name: 'Control Diabetes', description: 'Plan de seguimiento personalizado.', durationMinutes: 45, price: 75, active: true },
          { id: 's3', professionalId: 'p2', name: 'Terapia Individual', description: 'Sesión de psicología personalizada.', durationMinutes: 60, price: 80, active: true }
        ],
        slots: [
          { id: 'sl1', professionalId: 'p1', dayOfWeek: 1, startTime: '09:00' },
          { id: 'sl2', professionalId: 'p1', dayOfWeek: 1, startTime: '10:00' },
          { id: 'sl3', professionalId: 'p1', dayOfWeek: 2, startTime: '15:00' },
          { id: 'sl4', professionalId: 'p1', dayOfWeek: 3, startTime: '09:00' }
        ],
        appointments: [
          { id: 'a1', professionalId: 'p1', clientId: 'u3', clientName: 'Juan Perez', serviceId: 's1', serviceName: 'Consulta General', date: new Date().toISOString().split('T')[0], startTime: '09:00', status: AppointmentStatus.CONFIRMED, predictionScore: 0.92 },
        ],
        clients: [
          { id: 'c1', userId: 'u3', name: 'Juan Perez', email: 'juan@gmail.com', phone: '123456789', professionalId: 'p1' }
        ]
      };
      localStorage.setItem(DB_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  private saveDB(db: MockDB) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const db = this.getDB();
    const user = db.users.find(u => u.email === email);
    if (!user) throw new Error('Credenciales inválidas para la demo.');
    
    // Real-ish password check for E2E tests
    if (password !== 'password123') {
      throw new Error('Contraseña incorrecta.');
    }
    
    const professional = db.professionals.find(p => p.userId === user.id);
    return { 
      user, 
      token: `mock-jwt-${user.id}`,
      professional 
    };
  }

  async register(data: any): Promise<AuthResponse> {
    const db = this.getDB();
    const userId = `u${Date.now()}`;
    const newUser: User = { id: userId, name: data.name, email: data.email, role: data.role };
    db.users.push(newUser);

    let professional: ProfessionalProfile | undefined;
    if (data.role === UserRole.PROFESSIONAL) {
      professional = {
        id: `p${Date.now()}`,
        userId: userId,
        specialty: 'Pendiente',
        bio: 'Sin descripción todavía.',
        subscriptionStatus: SubscriptionStatus.TRIAL,
        subscriptionPlan: SubscriptionPlan.FREE,
        isVisibleInDirectory: false,
        businessName: `Clínica ${data.name}`,
        location: 'Pendiente'
      };
      db.professionals.push(professional);
    }

    this.saveDB(db);
    return { user: newUser, token: `mock-jwt-reg-${userId}`, professional };
  }

  async logout(): Promise<void> { return Promise.resolve(); }

  async getProfessionals(search?: string, specialty?: string): Promise<ProfessionalProfile[]> {
    const db = this.getDB();
    return db.professionals.filter(p => {
      const isActive = p.subscriptionStatus !== SubscriptionStatus.SUSPENDED && p.subscriptionStatus !== SubscriptionStatus.EXPIRED;
      if (!isActive || !p.isVisibleInDirectory) return false;
      if (search && !p.businessName.toLowerCase().includes(search.toLowerCase())) return false;
      if (specialty && specialty !== 'Todas' && p.specialty !== specialty) return false;
      return true;
    });
  }

  async getProfessionalById(id: string): Promise<ProfessionalProfile | null> {
    const db = this.getDB();
    return db.professionals.find(p => p.id === id) || null;
  }

  async getProfessionalServices(profId: string): Promise<Service[]> {
    const db = this.getDB();
    return db.services.filter(s => s.professionalId === profId && s.active);
  }

  async getProfessionalSlots(profId: string): Promise<Slot[]> {
    const db = this.getDB();
    return db.slots.filter(sl => sl.professionalId === profId);
  }

  async getAvailableTimes(profId: string, date: string): Promise<string[]> {
    const db = this.getDB();
    const defaultTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    const booked = db.appointments
      .filter(a => a.professionalId === profId && a.date === date && a.status !== AppointmentStatus.CANCELLED)
      .map(a => a.startTime);
    return defaultTimes.filter(t => !booked.includes(t));
  }

  async createAppointment(data: any): Promise<Appointment> {
    const db = this.getDB();
    const isBooked = db.appointments.some(a => 
      a.professionalId === data.professionalId && 
      a.date === data.date && 
      a.startTime === data.startTime &&
      a.status !== AppointmentStatus.CANCELLED
    );
    if (isBooked) throw new Error('El horario ya se encuentra ocupado.');

    const service = db.services.find(s => s.id === data.serviceId);
    const newApp: Appointment = {
      id: `a${Date.now()}`,
      professionalId: data.professionalId,
      clientId: data.clientId || `guest-${Date.now()}`,
      clientName: data.guestInfo?.name || db.users.find(u => u.id === data.clientId)?.name || 'Cliente',
      serviceId: data.serviceId,
      serviceName: service?.name || 'Servicio',
      date: data.date,
      startTime: data.startTime,
      status: AppointmentStatus.PENDING,
      predictionScore: Math.random()
    };

    db.appointments.push(newApp);
    this.saveDB(db);
    return newApp;
  }

  async getAppointments(filters: any): Promise<Appointment[]> {
    const db = this.getDB();
    return db.appointments.filter(a => {
      if (filters.professionalId && a.professionalId !== filters.professionalId) return false;
      if (filters.clientId && a.clientId !== filters.clientId) return false;
      return true;
    });
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const db = this.getDB();
    const idx = db.appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      db.appointments[idx].status = status as AppointmentStatus;
      this.saveDB(db);
      return db.appointments[idx];
    }
    throw new Error('Cita no encontrada');
  }

  async getTenants(): Promise<any[]> {
    const db = this.getDB();
    return db.professionals.map(p => ({ ...p, user: db.users.find(u => u.id === p.userId) }));
  }

  async updateProfessionalProfile(id: string, data: Partial<ProfessionalProfile>): Promise<void> {
    const db = this.getDB();
    const idx = db.professionals.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.professionals[idx] = { ...db.professionals[idx], ...data };
      this.saveDB(db);
    }
  }

  async updateSubscription(profId: string, status: SubscriptionStatus): Promise<void> {
    const db = this.getDB();
    const idx = db.professionals.findIndex(p => p.id === profId);
    if (idx !== -1) {
      db.professionals[idx].subscriptionStatus = status;
      if (status === SubscriptionStatus.ACTIVE) db.professionals[idx].subscriptionPlan = SubscriptionPlan.PRO;
      this.saveDB(db);
    }
  }

  async getClients(profId?: string): Promise<ClientProfile[]> {
    const db = this.getDB();
    return db.clients.filter(c => !profId || c.professionalId === profId);
  }

  async createClient(data: Partial<ClientProfile>): Promise<ClientProfile> {
    const db = this.getDB();
    const client = { ...data, id: `c${Date.now()}` } as ClientProfile;
    db.clients.push(client);
    this.saveDB(db);
    return client;
  }

  async createService(service: Partial<Service>): Promise<Service> {
    const db = this.getDB();
    const s = { ...service, id: `s${Date.now()}`, active: true } as Service;
    db.services.push(s);
    this.saveDB(db);
    return s;
  }

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    const db = this.getDB();
    const idx = db.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      db.services[idx] = { ...db.services[idx], ...service };
      this.saveDB(db);
      return db.services[idx];
    }
    throw new Error('Servicio no encontrado');
  }

  async deleteService(id: string): Promise<void> {
    const db = this.getDB();
    const idx = db.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      db.services[idx].active = false;
      this.saveDB(db);
    }
  }
}
