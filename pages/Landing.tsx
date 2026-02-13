
import React from 'react';
// Changed import from react-router-dom to react-router
import { Link } from 'react-router';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">R</div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ReservaPro</span>
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
           <Link to="/directory" className="hover:text-indigo-600 transition-colors">Directorio</Link>
           <a href="#features" className="hover:text-indigo-600 transition-colors">Funciones</a>
           <a href="#pricing" className="hover:text-indigo-600 transition-colors">Precios</a>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-6 py-2.5 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all">
            Empezar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            SaaS de Próxima Generación
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-none mb-8">
            Domina tu agenda, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">potencia tu negocio.</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
            La plataforma definitiva para profesionales independientes y clínicas. Gestión de citas, predicción de inasistencias con IA y multi-tenant real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-black rounded-2xl hover:scale-105 transition-all text-center shadow-2xl">
              Crear mi Espacio
            </Link>
            <Link to="/directory" className="px-10 py-5 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-center">
              Explorar Directorio
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
             <span>Confiado por:</span>
             <div className="flex gap-4 opacity-50">
                <span className="hover:opacity-100 transition-opacity">SaludPlus</span>
                <span className="hover:opacity-100 transition-opacity">LegalGroup</span>
                <span className="hover:opacity-100 transition-opacity">TechAssist</span>
             </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-[120px] rounded-full"></div>
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-2 shadow-2xl border border-white dark:border-slate-800 transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
             <img 
               src="https://images.unsplash.com/photo-1551288049-bb148328723d?auto=format&fit=crop&q=80&w=1200" 
               alt="Dashboard Mockup" 
               className="rounded-[36px]"
             />
          </div>
          
          <div className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 hidden md:block animate-bounce">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl">✓</div>
                 <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Reserva Exitosa</p>
                    <p className="text-sm font-bold dark:text-white">Nueva cita confirmada</p>
                 </div>
              </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section id="features" className="bg-slate-50 dark:bg-slate-900/50 py-32 transition-colors">
        <div className="max-w-7xl mx-auto px-8 text-center mb-20">
           <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Diseñado para cada sector</h3>
           <p className="text-slate-500 font-medium">Soluciones especializadas para profesionales de alto rendimiento.</p>
        </div>
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            title="Salud y Bienestar"
            desc="Citas médicas, terapias psicológicas y seguimiento de pacientes."
            icon="🩺"
          />
           <FeatureCard 
            title="Servicios Técnicos"
            desc="Gasfiteros, electricistas y mantenimiento con gestión de zonas."
            icon="🛠️"
          />
           <FeatureCard 
            title="Consultoría Legal"
            desc="Abogados y contadores con facturación y agenda prioritaria."
            icon="⚖️"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="p-10 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white tracking-tight">{title}</h4>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Landing;
