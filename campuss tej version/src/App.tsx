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
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsGrid /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
        <Route path="/registrations" element={<ProtectedRoute><Registrations /></ProtectedRoute>} />
        
        {/* Organizer & Admin Only */}
        <Route path="/create-event" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}><CreateEvent /></ProtectedRoute>
        } />
        <Route path="/stats/:id" element={
          <ProtectedRoute allowedRoles={['organizer', 'admin']}><EventStats /></ProtectedRoute>
        } />
        
        {/* Admin Only */}
        <Route path="/invite" element={
          <ProtectedRoute allowedRoles={['admin']}><InvitePage /></ProtectedRoute>
        } />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
