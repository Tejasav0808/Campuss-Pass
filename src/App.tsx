import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EventsGrid from './pages/EventsGrid';
import EventDetail from './pages/EventDetail';
import Registrations from './pages/Registrations';
import CreateEvent from './pages/CreateEvent';
import InvitePage from './pages/InvitePage';
import EventStats from './pages/EventStats';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerPendingPage from './pages/OrganizerPendingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useAuth } from './context/AuthContext';

// ─── Protected Route ─────────────────────────────────────────────────────────
// Role is sourced exclusively from the profiles table via AuthContext.
// Never reads from localStorage or user_metadata.
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect each role to its correct home instead of a blank /dashboard fallback
    switch (user.role) {
      case 'admin': return <Navigate to="/admin" replace />;
      case 'organizer': return <Navigate to="/organizer" replace />;
      case 'organizer_pending': return <Navigate to="/organizer-pending" replace />;
      default: return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Student dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Shared student + organizer + admin routes */}
        <Route path="/events" element={
          <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
            <EventsGrid />
          </ProtectedRoute>
        } />
        <Route path="/events/:id" element={
          <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
            <EventDetail />
          </ProtectedRoute>
        } />
        <Route path="/registrations" element={
          <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
            <Registrations />
          </ProtectedRoute>
        } />

        {/* Organizer hub */}
        <Route path="/organizer" element={
          <ProtectedRoute allowedRoles={['organizer']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        } />

        {/* Organizer pending approval */}
        <Route path="/organizer-pending" element={
          <ProtectedRoute allowedRoles={['organizer_pending']}>
            <OrganizerPendingPage />
          </ProtectedRoute>
        } />

        {/* Organizer & Admin only */}
        <Route path="/create-event" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <CreateEvent />
          </ProtectedRoute>
        } />
        <Route path="/stats/:id" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}>
            <EventStats />
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/invite" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <InvitePage />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
