import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, Ticket, 
  CheckCircle2, Clock3, 
  Download, Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Registrations() {
  const { user, loading } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('campus_pass_registrations');
    if (saved) {
      setRegistrations(JSON.parse(saved));
    }
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  const latest = registrations[0];
  const history = registrations.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Registered Events</h1>
            <p className="text-slate-500 text-lg">Manage your registrations and view your event history.</p>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">No registered events yet</h3>
              <p className="text-slate-500 mb-10 max-w-xs mx-auto">You haven't registered for any events yet. Start exploring now!</p>
              <Link to="/events" className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Latest Registration */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  Latest Registration
                </h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-indigo-50/50 flex flex-col lg:flex-row group"
                >
                  {/* Visual / Image */}
                  <div className="lg:w-96 h-64 lg:h-auto relative overflow-hidden">
                    <img 
                      src={latest.image || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800"} 
                      alt={latest.event_title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Status</div>
                      <div className="flex items-center gap-2">
                        {latest.status === 'confirmed' ? (
                          <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                            <CheckCircle2 size={12} /> Confirmed
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                            <Clock3 size={12} /> Pending Verification
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-grow p-8 lg:p-10 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 mb-4">{latest.event_title}</h3>
                        <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-bold">
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                            <Calendar size={16} className="text-indigo-600" /> {latest.date}
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                            <Clock size={16} className="text-indigo-600" /> {latest.time}
                          </div>
                          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                            <MapPin size={16} className="text-indigo-600" /> {latest.venue}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</div>
                          <div className="text-lg font-black text-slate-900">{latest.price}</div>
                        </div>
                        <div className="w-px h-10 bg-slate-200"></div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket ID</div>
                          <div className="text-lg font-black text-indigo-600">#{latest.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                      {latest.status === 'confirmed' ? (
                        <button className="flex-grow flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                          <Download size={20} /> Download PDF
                        </button>
                      ) : (
                        <button className="flex-grow flex items-center justify-center gap-3 bg-slate-100 text-slate-400 px-6 py-4 rounded-xl font-bold cursor-not-allowed">
                          <Clock3 size={20} /> Verifying...
                        </button>
                      )}
                      <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Registration History</h2>
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <th className="px-6 py-4">Event</th>
                          <th className="px-6 py-4 hidden md:table-cell">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {history.map((reg) => (
                          <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{reg.event_title}</div>
                              <div className="text-xs text-slate-500 md:hidden mt-1">{reg.date}</div>
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600 font-medium">
                              {reg.date}
                            </td>
                            <td className="px-6 py-4">
                              {reg.status === 'confirmed' ? (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Confirmed</span>
                              ) : (
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-indigo-600 font-bold text-sm hover:underline">View Ticket</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
