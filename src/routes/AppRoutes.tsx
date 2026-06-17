import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import ChooseLogin from '../pages/Login/ChooseLogin';

// Auth Pages
const Login = lazy(() => import('../pages/Login/Login'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const Agents = lazy(() => import('../pages/Admin/Agents'));
const Admins = lazy(() => import('../pages/Admin/Admins'));
const Customers = lazy(() => import('../pages/Admin/Customers'));
const Referrals = lazy(() => import('../pages/Admin/Referrals'));
const Withdrawals = lazy(() => import('../pages/Admin/Withdrawals'));
const Forms = lazy(() => import('../pages/Admin/Forms'));
const FormBuilderPage = lazy(() => import('../pages/Admin/FormBuilderPage'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const ChangePassword = lazy(() => import('../pages/ChangePassword/ChangePassword'));

// Agent Pages
const AgentDashboard = lazy(() => import('../pages/Agent/AgentDashboard'));
const AgentSettings = lazy(() => import('../pages/Agent/Settings'));

// Withdrawal Pages
const WithdrawalDashboard = lazy(() => import('../pages/Withdrawal/WithdrawalDashboard'));
const WithdrawalSettings = lazy(() => import('../pages/Withdrawal/Settings'));

const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const Loader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/choose-login" replace />} />
        <Route path="/choose-login" element={<ChooseLogin />} />
        
        {/* Public Login Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/agent/login" element={<Login />} />
        <Route path="/withdrawal/login" element={<Login />} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'superAdmin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="agents" element={<Agents />} />
          <Route
            path="admins"
            element={
              <ProtectedRoute allowedRoles={['superAdmin']}>
                <Admins />
              </ProtectedRoute>
            }
          />
          <Route path="customers" element={<Customers />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="forms" element={<Forms />} />
          <Route path="forms/new" element={<FormBuilderPage />} />
          <Route path="forms/:formId/edit" element={<FormBuilderPage />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="settings" element={<Settings />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Agent Protected Routes */}
        <Route path="/agent" element={
          <ProtectedRoute allowedRoles={['agent']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="register-customer" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Register Customer (Coming Soon)</h2></div>} />
          <Route path="customers" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">My Customers (Coming Soon)</h2></div>} />
          <Route path="referrals" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Referrals (Coming Soon)</h2></div>} />
          <Route path="documents" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Documents (Coming Soon)</h2></div>} />
          <Route path="profile" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Profile (Coming Soon)</h2></div>} />
          <Route path="settings" element={<AgentSettings />} />
        </Route>

        {/* Withdrawal Protected Routes */}
        <Route path="/withdrawal" element={
          <ProtectedRoute allowedRoles={['withdrawal']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/withdrawal/dashboard" replace />} />
          <Route path="dashboard" element={<WithdrawalDashboard />} />
          <Route path="request" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Request Withdrawal (Coming Soon)</h2></div>} />
          <Route path="history" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Withdrawal History (Coming Soon)</h2></div>} />
          <Route path="notifications" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Notifications (Coming Soon)</h2></div>} />
          <Route path="profile" element={<div className="p-8"><h2 className="text-2xl text-text font-bold">Profile (Coming Soon)</h2></div>} />
          <Route path="settings" element={<WithdrawalSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
