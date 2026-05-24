import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Plus, BarChart2, Calendar, Users, Ticket, ArrowRight } from 'lucide-react';

export default function OrganizerDashboard() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'CampusPass | Organizer Hub';
  }, []);

  const quickActions = [
    { label: 'Create Event', description: 'Launch a new campus event', icon: Plus, href: '/create-event', color: 'violet' },
    { label: 'Browse Events', description: 'View all published events', icon: Calendar, href: '/events', color: 'indigo' },
    { label: 'Registrations', description: 'Manage attendee sign-ups', icon: Users, href: '/registrations', color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-violet-200 mb-4">
              <Ticket size={12} />
              Organizer Hub
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3">
              Welcome back, <span className="text-violet-600">{user?.name}</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Manage your events and track registrations.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {quickActions.map((action, idx) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={action.href}
                  className={`block bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <action.icon size={28} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{action.label}</h3>
                  <p className="text-sm text-slate-400 font-medium mb-4">{action.description}</p>
                  <div className={`flex items-center gap-2 text-${action.color}-600 text-sm font-bold`}>
                    Go <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Stats placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10"
          >
            <div className="flex items-center gap-3 mb-8">
              <BarChart2 size={24} className="text-violet-600" />
              <h2 className="text-2xl font-black text-slate-900">Your Events</h2>
            </div>
            <div className="py-16 text-center text-slate-400 font-bold">
              Events you create will appear here. <Link to="/create-event" className="text-violet-600 hover:underline">Create your first event →</Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
