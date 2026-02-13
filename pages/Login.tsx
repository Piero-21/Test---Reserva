
import React, { useState } from 'react';
// Changed import from react-router-dom to react-router
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../domain/types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('roberto@saludplus.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="ui-card max-w-md w-full p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Bienvenido</h1>
          <p className="text-slate-500 mt-2">Accede a tu panel de gestión</p>
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
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ui-input w-full px-4 py-3"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            data-cy="login-submit"
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4">Usuarios Demo</p>
          <div className="flex flex-wrap gap-2">
            <DemoBadge email="admin@reservapro.com" label="SaaS Admin" onClick={setEmail} testId="demo-admin" />
            <DemoBadge email="roberto@saludplus.com" label="Profesional" onClick={setEmail} testId="demo-pro" />
            <DemoBadge email="juan@gmail.com" label="Paciente" onClick={setEmail} testId="demo-client" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoBadge = ({ email, label, onClick, testId }: { email: string, label: string, onClick: (s: string) => void, testId: string }) => (
  <button
    onClick={() => onClick(email)}
    data-cy={testId}
    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors uppercase border border-indigo-200 dark:border-indigo-500/30"
  >
    {label}
  </button>
);

export default Login;
