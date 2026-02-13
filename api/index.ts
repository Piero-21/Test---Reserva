
import { IApiClient } from './types';
import { MockApiClient } from './mockClient';
import { HttpApiClient } from './httpClient';

// Safe environment access
const getEnv = (key: string, fallback: string): string => {
  const env = (import.meta as any).env;
  return env && env[key] ? env[key] : fallback;
};

// Fix: Read configuration from localStorage to ensure settings from updateApiConfig persist after page reload
const BACKEND_MODE = localStorage.getItem('reservapro_api_mode') || getEnv('VITE_BACKEND_MODE', 'mock');
const API_BASE_URL = localStorage.getItem('reservapro_api_url') || getEnv('VITE_API_BASE_URL', 'https://api.reservapro.com/v1');

export const apiClient: IApiClient = BACKEND_MODE === 'real' 
  ? new HttpApiClient(API_BASE_URL) 
  : new MockApiClient();

export const getApiConfig = () => ({
  mode: BACKEND_MODE,
  baseUrl: API_BASE_URL
});

// Fix: Implemented and exported updateApiConfig to allow dynamic API mode switching in the SettingsDev component
export const updateApiConfig = (mode: 'mock' | 'real', baseUrl?: string) => {
  localStorage.setItem('reservapro_api_mode', mode);
  if (baseUrl) {
    localStorage.setItem('reservapro_api_url', baseUrl);
  }
  window.location.reload();
};
