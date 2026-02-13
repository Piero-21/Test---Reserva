
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { Guard } from './auth/Guard';
import { UserRole } from './domain/types';

import Landing from './pages/Landing';
import Directory from './pages/client/Directory';
import PublicProfile from './pages/client/PublicProfile';
import BookingEngine from './pages/client/BookingEngine';
import Login from './pages/Login';
import Register from './pages/Register';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import ProfessionalDashboard from './pages/professional/Dashboard';
import ProfessionalServices from './pages/professional/Services';
import ProfessionalClients from './pages/professional/Clients';
import ProfessionalAgenda from './pages/professional/Agenda';
import SubscriptionPage from './pages/professional/Subscription';
import ClientDashboard from './pages/client/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import { ClientLayout } from './layouts/ClientLayout';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Public Area */}
          <Route path="/" element={<Landing />} />
          <Route element={<ClientLayout />}>
             <Route path="/directory" element={<Directory />} />
             <Route path="/p/:professionalId" element={<PublicProfile />} />
             <Route path="/p/:professionalId/book" element={<BookingEngine />} />
             <Route path="/client/dashboard" element={
               <Guard allowedRoles={[UserRole.CLIENT]}><ClientDashboard /></Guard>
             } />
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Internal: Professional Panel */}
          <Route path="/pro" element={
            <Guard allowedRoles={[UserRole.PROFESSIONAL]}>
              <DashboardLayout />
            </Guard>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProfessionalDashboard />} />
            <Route path="services" element={<ProfessionalServices />} />
            <Route path="clients" element={<ProfessionalClients />} />
            <Route path="agenda" element={<ProfessionalAgenda />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>

          {/* Internal: SaaS SuperAdmin */}
          <Route path="/admin" element={
            <Guard allowedRoles={[UserRole.SUPER_ADMIN]}>
              <DashboardLayout />
            </Guard>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="tenants" element={<SuperAdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
