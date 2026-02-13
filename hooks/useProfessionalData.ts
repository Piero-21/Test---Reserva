
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api';
import { Service, ClientProfile, Appointment, ProfessionalProfile } from '../domain/types';

export const useProfessionalServices = (profId: string | undefined) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    if (!profId) return;
    setLoading(true);
    const data = await apiClient.getProfessionalServices(profId);
    setServices(data);
    setLoading(false);
  }, [profId]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  return { services, loading, refetch: fetchServices };
};

export const useProfessionalClients = (profId: string | undefined) => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    if (!profId) return;
    setLoading(true);
    const data = await apiClient.getClients(profId);
    setClients(data);
    setLoading(false);
  }, [profId]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  return { clients, loading, refetch: fetchClients };
};

export const useProfessionalAppointments = (profId: string | undefined) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    if (!profId) return;
    setLoading(true);
    const data = await apiClient.getAppointments({ professionalId: profId });
    setAppointments(data);
    setLoading(false);
  }, [profId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  return { appointments, loading, refetch: fetchAppointments };
};
