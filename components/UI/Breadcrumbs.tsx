
import React from 'react';
// Changed import from react-router-dom to react-router
import { useLocation, Link } from 'react-router';

const pathMap: Record<string, string> = {
  admin: 'SaaS Admin',
  pro: 'Profesional',
  dashboard: 'Resumen',
  tenants: 'Clientes SaaS',
  services: 'Servicios',
  clients: 'Directorio Clientes',
  agenda: 'Agenda',
  client: 'Portal Cliente',
  book: 'Reservar'
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex mb-6 text-sm font-medium" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400">
            ReservaPro
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = pathMap[value] || value;

          return (
            <li key={to}>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-slate-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                {last ? (
                  <span className="ml-1 text-slate-900 dark:text-white font-bold md:ml-2">
                    {label}
                  </span>
                ) : (
                  <Link to={to} className="ml-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 md:ml-2">
                    {label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
