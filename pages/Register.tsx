
import React, { useState } from 'react';
// Changed import from react-router-dom to react-router
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10">
        <h2 className="text-3xl font-black mb-6 text-slate-900">Únete a ReservaPro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Nombre" 
            data-cy="register-name"
            className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-indigo-500"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <input 
            type="email" placeholder="Email" 
            data-cy="register-email"
            className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-indigo-500"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" placeholder="Contraseña" 
            data-cy="register-password"
            className="w-full p-4 bg-slate-100 rounded-2xl border-none outline-indigo-500"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          <div className="flex gap-4">
            <button 
              type="button" 
              data-cy="role-client-btn"
              onClick={() => setFormData({...formData, role: UserRole.CLIENT})}
              className={`flex-1 p-4 rounded-2xl font-bold transition-all ${formData.role === UserRole.CLIENT ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Soy Cliente
            </button>
            <button 
              type="button" 
              data-cy="role-pro-btn"
              onClick={() => setFormData({...formData, role: UserRole.PROFESSIONAL})}
              className={`flex-1 p-4 rounded-2xl font-bold transition-all ${formData.role === UserRole.PROFESSIONAL ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Soy Profesional
            </button>
          </div>
          <button 
            data-cy="register-submit"
            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all mt-4 shadow-xl shadow-slate-200">
            Crear Cuenta
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-slate-500">
          ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 font-bold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
