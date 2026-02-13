
import { IApiClient, AuthResponse, DemoAccount } from './types';
import { 
  User, 
  ProfessionalProfile, 
  Service, 
  Appointment, 
  Slot, 
  SubscriptionStatus, 
  ClientProfile 
} from '../domain/types';

export class HttpApiClient implements IApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:5001';
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const session = localStorage.getItem('reserva_pro_session');
    const token = session ? JSON.parse(session).token : null;

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: any): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    // Usually a token invalidation endpoint or just local cleanup
    return Promise.resolve();
  }

  // Fixed: Implemented getDemoAccounts to satisfy IApiClient interface
  async getDemoAccounts(): Promise<DemoAccount[]> {
    return this.request<DemoAccount[]>('/auth/demo-accounts');
  }

  async getProfessionals(search?: string, specialty?: string): Promise<ProfessionalProfile[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (specialty) params.append('specialty', specialty);
    return this.request<ProfessionalProfile[]>(`/professionals?${params.toString()}`);
  }

  async getProfessionalById(id: string): Promise<ProfessionalProfile | null> {
    return this.request<ProfessionalProfile>(`/professionals/${id}`);
  }

  async getProfessionalServices(profId: string): Promise<Service[]> {
    return this.request<Service[]>(`/professionals/${profId}/services`);
  }

  async getProfessionalSlots(profId: string): Promise<Slot[]> {
    return this.request<Slot[]>(`/professionals/${profId}/slots`);
  }

  async updateProfessionalProfile(id: string, data: Partial<ProfessionalProfile>): Promise<void> {
    return this.request<void>(`/professionals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Implementation of missing getAvailableTimes method to satisfy IApiClient
  async getAvailableTimes(profId: string, date: string): Promise<string[]> {
    return this.request<string[]>(`/professionals/${profId}/availability?date=${date}`);
  }

  async createService(service: Partial<Service>): Promise<Service> {
    return this.request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  }

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    return this.request<Service>(`/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(service),
    });
  }

  async deleteService(id: string): Promise<void> {
    return this.request<void>(`/services/${id}`, { method: 'DELETE' });
  }

  async getAppointments(filters: { professionalId?: string; clientId?: string }): Promise<Appointment[]> {
    const params = new URLSearchParams(filters as any);
    return this.request<Appointment[]>(`/appointments?${params.toString()}`);
  }

  async createAppointment(data: any): Promise<Appointment> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    return this.request<Appointment>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getClients(profId?: string): Promise<ClientProfile[]> {
    const params = profId ? `?professionalId=${profId}` : '';
    return this.request<ClientProfile[]>(`/clients${params}`);
  }

  async createClient(data: Partial<ClientProfile>): Promise<ClientProfile> {
    return this.request<ClientProfile>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTenants(): Promise<any[]> {
    return this.request<any[]>('/tenants');
  }

  async updateSubscription(profId: string, status: SubscriptionStatus): Promise<void> {
    return this.request<void>(`/tenants/${profId}/subscription`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}
