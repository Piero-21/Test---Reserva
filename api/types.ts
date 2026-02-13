
import { 
  User, 
  ProfessionalProfile, 
  Service, 
  Appointment, 
  Slot, 
  ClientProfile, 
  SubscriptionStatus 
} from '../domain/types';

export interface AuthResponse {
  user: User;
  token: string;
  professional?: ProfessionalProfile;
}

export interface DemoAccount {
  email: string;
  password: string;
  label: string;
  testId: string;
}

export interface IApiClient {
  // Auth
  login(email: string, password: string): Promise<AuthResponse>;
  register(data: any): Promise<AuthResponse>;
  logout(): Promise<void>;
  getDemoAccounts(): Promise<DemoAccount[]>;
  
  // Directory & Profiles
  getProfessionals(search?: string, specialty?: string): Promise<ProfessionalProfile[]>;
  getProfessionalById(id: string): Promise<ProfessionalProfile | null>;
  getProfessionalServices(profId: string): Promise<Service[]>;
  getProfessionalSlots(profId: string): Promise<Slot[]>;
  
  // Business Logic
  getAvailableTimes(profId: string, date: string): Promise<string[]>;
  createAppointment(data: any): Promise<Appointment>;
  getAppointments(filters: { professionalId?: string; clientId?: string }): Promise<Appointment[]>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment>;
  
  // Management
  getTenants(): Promise<any[]>;
  updateProfessionalProfile(id: string, data: Partial<ProfessionalProfile>): Promise<void>;
  updateSubscription(profId: string, status: SubscriptionStatus): Promise<void>;
  
  // CRM
  getClients(profId?: string): Promise<ClientProfile[]>;
  createClient(data: Partial<ClientProfile>): Promise<ClientProfile>;
  
  // Services
  createService(service: Partial<Service>): Promise<Service>;
  updateService(id: string, service: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
}
