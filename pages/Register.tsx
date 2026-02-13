
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../domain/types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: UserRole.CLIENT });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate(formData.role === UserRole.PROFESSIONAL ? '/pro/dashboard' : '/client/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">R</div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ReservaPro</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Crea tu Espacio</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Empieza a digitalizar tu agenda hoy mismo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Nombre completo" 
            data-cy="register-name"
            className="ui-input font-bold"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" placeholder="Correo electrónico" 
            data-cy="register-email"
            className="ui-input font-bold"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Contraseña segura" 
            data-cy="register-password"
            className="ui-input font-bold"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <div className="py-4">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block text-center">¿Cómo usarás ReservaPro?</label>
             <div className="flex gap-4">
               <button 
                 type="button" 
                 data-cy="role-client-btn"
                 onClick={() => setFormData({...formData, role: UserRole.CLIENT})}
                 className={`flex-1 p-4 rounded-2xl font-bold transition-all border-2 ${formData.role === UserRole.CLIENT ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent'}`}
               >
                 Reservar Citas
               </button>
               <button 
                 type="button" 
                 data-cy="role-pro-btn"
                 onClick={() => setFormData({...formData, role: UserRole.PROFESSIONAL})}
                 className={`flex-1 p-4 rounded-2xl font-bold transition-all border-2 ${formData.role === UserRole.PROFESSIONAL ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent'}`}
               >
                 Ofrecer Servicios
               </button>
             </div>
          </div>

          <button 
            data-cy="register-submit"
            className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 shadow-xl shadow-indigo-500/10 uppercase text-xs tracking-widest">
            Crear mi Cuenta
          </button>
        </form>
        <p className="text-center mt-8 text-sm text-slate-500 font-medium">
          ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 font-black hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
