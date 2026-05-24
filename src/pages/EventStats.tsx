import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ArrowLeft, Users, Calendar, MapPin, 
  Download, Search, Mail,
  Clock, Hash
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EventStats() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'CampusPass | Event Statistics';
    
    // Load event details
    const savedEvents = localStorage.getItem('campus_pass_org_events');
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      const found = events.find((e: any) => String(e.id) === id);
      if (found) {
        setEvent(found);
      }
    }

    // Load registrations for this event
    const allRegs = localStorage.getItem('campus_pass_global_registrations');
    if (allRegs && event) {
      const parsed = JSON.parse(allRegs);
      const filtered = parsed.filter((r: any) => String(r.event_id) === String(id));
      setRegistrations(filtered);
    }
  }, [id, event]);

  if (loading) return null;
  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return <Link to="/login" />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050014] transition-colors duration-300 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Event Not Found</h1>
            <Link to="/dashboard" className="text-indigo-600 font-bold hover:underline">Back to Dashboard</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.student_roll?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    // In a real app, this would generate a CSV/Excel
    // For now, we'll simulate the download
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Roll No,Email,Branch,Semester,Status\n"
      + registrations.map(r => `${r.student_name},${r.student_roll},${r.student_email},${r.student_branch},${r.student_semester},${r.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerifyReg = (regId: string) => {
    const allRegs = JSON.parse(localStorage.getItem('campus_pass_global_registrations') || '[]');
    const updatedGlobal = allRegs.map((r: any) => r.id === regId ? { ...r, status: 'confirmed' } : r);
    localStorage.setItem('campus_pass_global_registrations', JSON.stringify(updatedGlobal));
    
    setRegistrations(registrations.map(r => r.id === regId ? { ...r, status: 'confirmed' } : r));

    // Also update local student regs just in case
    const localRegs = JSON.parse(localStorage.getItem('campus_pass_registrations') || '[]');
    const updatedLocal = localRegs.map((r: any) => r.id === regId ? { ...r, status: 'confirmed' } : r);
    localStorage.setItem('campus_pass_registrations', JSON.stringify(updatedLocal));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050014] transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-bold group mb-6"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  Event Statistics
                </div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-6 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2 font-bold">
                    <Calendar size={18} className="text-indigo-600" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <MapPin size={18} className="text-indigo-600" /> {event.venue || 'Main Hall'}
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <Clock size={18} className="text-indigo-600" /> {event.time || '10:00 AM'}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleExport}
                className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-3"
              >
                <Download size={20} />
                Export to Excel
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{registrations.length}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Registrations</div>
            </div>
            <div className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Download size={28} />
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                {registrations.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Confirmed Tickets</div>
            </div>
            <div className="bg-white dark:bg-[#12092a] transition-colors duration-300 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock size={28} />
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                {registrations.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending Verification</div>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="bg-white dark:bg-[#12092a] transition-colors duration-300 rounded-[3rem] border border-slate-100 dark:border-slate-800/60 shadow-sm dark:shadow-none overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registered Students</h3>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or roll no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-slate-50 dark:bg-[#050014] transition-colors duration-300 border border-slate-100 dark:border-slate-800/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredRegistrations.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-[#050014] transition-colors duration-300 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-8 py-5">Student Info</th>
                      <th className="px-8 py-5">Roll Number</th>
                      <th className="px-8 py-5">Branch & Sem</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-[#1c2333] dark:bg-[#050014] transition-colors duration-300/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                              {reg.student_name?.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{reg.student_name}</div>
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <Mail size={12} /> {reg.student_email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 transition-colors duration-300/50 px-3 py-1.5 rounded-lg w-fit">
                            <Hash size={14} className="text-slate-400" />
                            {reg.student_roll}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{reg.student_branch}</div>
                            <div className="text-xs text-slate-400">Semester {reg.student_semester}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {reg.status === 'confirmed' ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Confirmed</span>
                          ) : (
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Pending</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right flex items-center justify-end gap-3">
                          {reg.status === 'pending' && (
                            <button 
                              onClick={() => handleVerifyReg(reg.id)}
                              className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          <button className="text-indigo-600 text-sm font-bold hover:underline">View Proof</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-[#050014] transition-colors duration-300 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No students found</h4>
                  <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or check back later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
