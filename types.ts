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

export interface BusinessHours {
  day: number; // 0-6 (Sunday-Saturday)
  open: string; // "HH:mm"
  close: string; // "HH:mm"
}

export interface Tenant {
  id: string;
  name: string;
  professionalName: string;
  email: string;
  category: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  renewalDate: string;
  createdAt: string;
  logo?: string;
  businessHours: BusinessHours[];
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
}

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  dateTime: string;
  status: AppointmentStatus;
  predictionScore?: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  name: string;
  avatar?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
}