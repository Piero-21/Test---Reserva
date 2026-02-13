
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../domain/types';
import { apiClient } from '../api';
import { DemoAccount } from '../api/types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDemos = async () => {
      try {
        const demos = await apiClient.getDemoAccounts();
        setDemoAccounts(demos);
      } catch (err) {
        console.error("Error loading demo accounts", err);
      }
    };
    loadDemos();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const role = await login(email, password);
      setLoading(false);
      
      switch (role) {
        case UserRole.SUPER_ADMIN:
          navigate('/admin/dashboard');
          break;
        case UserRole.PROFESSIONAL:
          navigate('/pro/dashboard');
          break;
        case UserRole.CLIENT:
          navigate('/client/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error: any) {
      setLoading(false);
      alert(error.message || 'Error al iniciar sesión.');
    }
  };

  const fillCredentials = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="ui-card max-w-md w-full p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">R</div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ReservaPro</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Bienvenido</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Accede a tu panel de gestión empresarial</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Correo Electrónico</label>
            <input
              type="email"
              data-cy="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ui-input w-full px-4 py-3"
              placeholder="ejemplo@empresa.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Contraseña</label>
            <input
              type="password"
              data-cy="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ui-input w-full px-4 py-3"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            data-cy="login-submit"
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center text-sm uppercase tracking-widest"
          >
            {loading ? 'Cargando...' : 'Entrar al Sistema'}
          </button>
        </form>

        {demoAccounts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 text-center">Cuentas Demo para el AIS</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {demoAccounts.map(acc => (
                <button
                  key={acc.testId}
                  onClick={() => fillCredentials(acc)}
                  data-cy={acc.testId}
                  className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-full hover:bg-indigo-600 hover:text-white transition-all uppercase border border-slate-200 dark:border-slate-700"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
