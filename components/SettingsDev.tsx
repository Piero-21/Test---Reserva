
import React, { useState } from 'react';
import { updateApiConfig, getApiConfig } from '../api';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../domain/types';

export const SettingsDev: React.FC = () => {
  const { user } = useAuth();
  const config = getApiConfig();
  const [baseUrl, setBaseUrl] = useState(config.baseUrl || '');

  // Only show for admins or if explicitly enabled (demo purposes we show it for all)
  if (!user || user.role !== UserRole.SUPER_ADMIN) return null;

  return (
    <div className="fixed bottom-4 right-4 ui-card p-6 z-[999] w-72 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Configuración Dev</p>
        <div className={`w-2 h-2 rounded-full ${config.mode === 'mock' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Modo API</label>
          <div className="flex gap-2">
            <button 
              onClick={() => updateApiConfig('mock')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${config.mode === 'mock' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              Mock
            </button>
            <button 
              onClick={() => updateApiConfig('real', baseUrl)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${config.mode === 'real' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              Real
            </button>
          </div>
        </div>

        {config.mode === 'real' && (
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Base URL</label>
            <input 
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://localhost:5001"
              className="ui-input w-full p-2 text-xs"
            />
            <button 
              onClick={() => updateApiConfig('real', baseUrl)}
              className="w-full mt-2 py-2 bg-slate-900 dark:bg-white dark:text-slate-950 text-white text-[10px] font-black uppercase rounded-lg"
            >
              Guardar y Recargar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
