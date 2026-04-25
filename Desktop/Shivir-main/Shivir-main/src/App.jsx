import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import { useStudentStore } from './store/useStudentStore.js';
import { useVolunteerStore } from './store/useVolunteerStore.js';
import { useTransactionStore } from './store/useTransactionStore.js';
import { useCoinStore } from './store/useCoinStore.js';
import LoginPage from './pages/auth/LoginPage.jsx';
import VolunteerApp from './pages/volunteer/VolunteerApp.jsx';
import CoordinatorApp from './pages/coordinator/CoordinatorApp.jsx';
import CoinKeeperApp from './pages/coinkeeper/CoinKeeperApp.jsx';
import CollectionStation from './pages/collection/CollectionStation.jsx';
import DailySchedule from './pages/schedule/DailySchedule.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminCheckIn from './pages/admin/AdminCheckIn.jsx';

function AppInitializer() {
  const fetchStudents = useStudentStore(s => s.fetchStudents);
  const fetchVolunteers = useVolunteerStore(s => s.fetchVolunteers);
  const fetchTransactions = useTransactionStore(s => s.fetchTransactions);
  const fetchCoins = useCoinStore(s => s.fetchCoins);
  useEffect(() => {
    fetchStudents();
    fetchVolunteers();
    fetchTransactions();
    fetchCoins();
  }, []);
  return null;
}

function RequireAuth({ children, allowedRoles }) {
  const { currentUser, role } = useAuthStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'Inter, Noto Sans Devanagari, sans-serif' },
        }}
      />
      <AppInitializer />
      <Routes>
        <Route path="/" element={<Navigate to="/schedule" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/schedule" element={<DailySchedule />} />
        <Route path="/checkin" element={<AdminCheckIn />} />

        <Route path="/volunteer" element={
          <RequireAuth allowedRoles={['volunteer', 'admin']}>
            <VolunteerApp />
          </RequireAuth>
        } />

        <Route path="/coordinator" element={
          <RequireAuth allowedRoles={['coordinator']}>
            <CoordinatorApp />
          </RequireAuth>
        } />

        <Route path="/coinkeeper" element={
          <RequireAuth allowedRoles={['coinkeeper']}>
            <CoinKeeperApp />
          </RequireAuth>
        } />

        <Route path="/collection" element={
          <RequireAuth allowedRoles={['collection', 'admin']}>
            <CollectionStation />
          </RequireAuth>
        } />

        <Route path="/admin/*" element={
          <RequireAuth allowedRoles={['admin']}>
            <AdminLayout />
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
