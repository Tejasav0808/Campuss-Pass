import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Clock, Mail, LogOut, Ticket } from 'lucide-react';

export default function OrganizerPendingPage() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'CampusPass | Awaiting Approval';
  }, []);

  return (
    <div className="min-h-screen bg-[#050014] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/15 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10 text-center"
      >
        <div className="bg-white/10 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/10">
          {/* Icon */}
          <div className="w-20 h-20 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock size={40} />
          </div>

          {/* Brand */}
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm font-bold mb-6">
            <Ticket size={16} />
            CampusPass
          </div>

          <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
            Awaiting Approval
          </h1>
          <p className="text-slate-400 leading-relaxed mb-2">
            Hi <span className="text-white font-bold">{user?.name}</span>, your organizer account is under review.
          </p>
          <p className="text-slate-500 text-sm leading-relaxed mb-10">
            An administrator will activate your account shortly. You'll receive an email at{' '}
            <span className="text-slate-300 font-medium">{user?.email}</span> once you're approved.
          </p>

          {/* Info box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex items-start gap-3 text-left">
            <Mail size={18} className="text-violet-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed">
              If you haven't received a confirmation within 24 hours, please contact your campus administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all"
            >
              Back to Home
            </Link>
            <button
              onClick={logout}
              className="w-full py-4 rounded-2xl text-slate-500 font-bold text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
