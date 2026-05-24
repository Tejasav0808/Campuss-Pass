import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Plus, Calendar, Compass,
  Clock, Settings, Trash2, 
  Zap,
  Activity, BarChart3
} from 'lucide-react';

import AdminDashboard from './AdminDashboard';

import { useBackButtonLogout } from '../hooks/useBackButtonLogout';

export default function Dashboard() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user) {
      document.title = `CampusPass | ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`;
    }
  }, [user]);

  // Back button logout confirmation
  useBackButtonLogout();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.role;

  // Render different dashboard based on role
  if (role === 'admin') return <AdminDashboard />;
  if (role === 'organizer') return <OrganizerDashboard />;
  return <StudentDashboard />;
}

// --- SUB-COMPONENTS ---


function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    useEffect(() => {
      const saved = localStorage.getItem('campus_pass_org_events');
      if (saved) {
        const allEvents = JSON.parse(saved);
        // Filter events by creator for Organizers
        const myEvents = allEvents.filter((ev: any) => ev.creator_email === user?.email);
        setEvents(myEvents);
      } else {
        setEvents([]);
      }
    }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEventId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  events.find(e => e.id === selectedEventId);

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this event?')) {
      const updated = events.filter(ev => ev.id !== id);
      setEvents(updated);
      localStorage.setItem('campus_pass_org_events', JSON.stringify(updated));
      if (selectedEventId === id) setSelectedEventId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050014] transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Organizer Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Welcome back, <span className="text-indigo-600">{user?.name}</span></p>
            </div>
            <Link to="/create-event" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center gap-3">
              <Plus size={20} />
              New Event
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none">
                <h3 className="text-xl font-bold mb-6">Your Recent Events</h3>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <p className="text-slate-400">No events found.</p>
                  ) : (
                    events.map((ev) => (
                      <div 
                        key={ev.id} 
                        onClick={() => navigate(`/stats/${ev.id}`)}
                        className="flex items-center gap-6 p-4 rounded-2xl border border-slate-50 dark:border-slate-800/40 hover:border-indigo-100 transition-colors cursor-pointer group"
                      >
                        <div className="w-16 h-16 bg-slate-50 dark:bg-[#050014] transition-colors duration-300 rounded-xl flex-shrink-0 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <BarChart3 size={32} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 transition-colors">{ev.title}</div>
                          <div className="text-sm text-slate-400 font-medium">{ev.registered} Registered • {ev.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#050014] transition-colors duration-300 text-slate-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                            onClick={(e) => { e.stopPropagation(); /* edit logic */ }}
                            title="Edit Event"
                          >
                            <Settings size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, ev.id)}
                            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#050014] transition-colors duration-300 text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                            title="Remove Event"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-[#12092a] transition-colors duration-300/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <Activity size={32} className="mb-6 text-indigo-400" />
                <h3 className="text-2xl font-black mb-1">Total Impact</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">Performance across all your events</p>
                
                <div className="space-y-6">
                  <div className="bg-white dark:bg-[#12092a] transition-colors duration-300/5 p-6 rounded-2xl border border-white/10 hover:bg-white dark:bg-[#12092a] transition-colors duration-300/10 transition-colors">
                    <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Registrations</div>
                    <div className="text-4xl font-black text-white">
                      {events.reduce((acc, ev) => acc + (ev.registered || 0), 0)}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-[#12092a] transition-colors duration-300/5 p-6 rounded-2xl border border-white/10 hover:bg-white dark:bg-[#12092a] transition-colors duration-300/10 transition-colors">
                    <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Estimated Revenue</div>
                    <div className="text-3xl font-black text-emerald-400">
                      ₹{events.reduce((acc, ev) => {
                        const revStr = String(ev.revenue || '$0').replace(/[^0-9.]/g, '');
                        return acc + (parseFloat(revStr) || 0);
                      }, 0)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-indigo-600/20 border border-indigo-500/20 rounded-2xl">
                  <div className="flex items-center gap-3 text-indigo-400 font-bold text-sm">
                    <Zap size={16} />
                    <span>Top performing: {events.sort((a, b) => b.registered - a.registered)[0]?.title || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none">
                <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" />
                  Recently Hosted
                </h4>
                {events.length > 0 ? (
                  <div 
                    onClick={() => navigate(`/stats/${events[0].id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-32 rounded-2xl overflow-hidden mb-4">
                      <img src={events[0].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Recent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-indigo-600 px-2 py-1 rounded">Latest</span>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{events[0].title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{events[0].registered} Students Registered</div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-400 text-sm font-medium">No events hosted yet.</div>
                )}
              </div>

              <div className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none">
                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-600" />
                  Quick Tips
                </h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></div>
                    Click on any event to see detailed student lists and export data.
                  </li>
                  <li className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></div>
                    Use the 'New Event' button to launch your next activity.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050014] transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Hello, {user?.name} 👋</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Find your next favorite campus event.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/registrations" className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Registered Events</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">View your upcoming events and past registrations history.</p>
            </Link>
            <Link to="/events" className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Explore Events</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Discover upcoming workshops, seminars, and social activities on campus.</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
