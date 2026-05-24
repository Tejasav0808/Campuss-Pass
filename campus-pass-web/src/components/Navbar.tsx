import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Ticket, LogOut, LayoutDashboard, Calendar, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#050014]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-105">
            <Ticket size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Campus<span className="text-indigo-600">Pass</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {user && location.pathname !== '/' && (
            <>
              <Link to="/dashboard" className={`text-sm font-semibold flex items-center gap-2 transition-colors ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {user.role === 'student' && (
                <Link to="/registrations" className={`text-sm font-semibold flex items-center gap-2 transition-colors ${location.pathname === '/registrations' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                  <Calendar size={18} />
                  Registered Events
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && location.pathname !== '/' ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</span>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{user.role.replace('_', ' ')}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
