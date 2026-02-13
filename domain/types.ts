
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PROFESSIONAL = 'PROFESSIONAL',
  CLIENT = 'CLIENT'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED'
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NOSHOW = 'NOSHOW'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenantId?: string;
}

export interface ProfessionalProfile {
  id: string;
  userId: string;
  specialty: string;
  bio: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  isVisibleInDirectory: boolean;
  businessName: string;
  location: string;
}

export interface Service {
  id: string;
  professionalId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

export interface Slot {
  id: string;
  professionalId: string;
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
}

export interface ClientProfile {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  phone: string;
  professionalId?: string;
}

export interface Appointment {
  id: string;
  professionalId: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  status: AppointmentStatus;
  predictionScore?: number;
}
