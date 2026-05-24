import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Users, Clock, Settings, Trash2, 
  ShieldCheck, Zap, UserPlus, Activity, 
  BarChart3, Search, Filter, MoreVertical,
  CheckCircle2, XCircle, Mail, Calendar,
  ArrowRight, LayoutDashboard, Database,
  FileText, Download
} from 'lucide-react';

import { useBackButtonLogout } from '../hooks/useBackButtonLogout';

export default function AdminDashboard() {
  const { user } = useAuth();
  useBackButtonLogout();
  const [activeTab, setActiveTab] = useState<'events' | 'organizers' | 'users' | 'logs'>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [stats, setStats] = useState({
    totalMembers: 0,
    totalStudents: 0,
    liveEvents: 0,
    organizers: 0
  });
  const [events, setEvents] = useState<any[]>([]);
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    document.title = 'CampusPass | Admin Command Hub';
    
    // Load Real Data
    const loadData = () => {
      const savedEvents = JSON.parse(localStorage.getItem('campus_pass_org_events') || '[]');
      const savedUsers = JSON.parse(localStorage.getItem('campus_pass_all_users') || '[]');
      const savedRegs = JSON.parse(localStorage.getItem('campus_pass_global_registrations') || '[]');

      setEvents(savedEvents);
      setAllUsers(savedUsers);
      
      const orgList = savedUsers.filter((u: any) => u.role === 'organizer');
      const studentList = savedUsers.filter((u: any) => u.role === 'student');
      setOrganizers(orgList);

      setStats({
        totalMembers: savedUsers.length,
        totalStudents: studentList.length,
        liveEvents: savedEvents.length,
        organizers: orgList.length
      });

      // Filter users who logged in past 24 hours
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      const recentLogins = savedUsers
        .filter((u: any) => u.lastLogin && new Date(u.lastLogin) > oneDayAgo)
        .map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          rollNumber: u.rollNumber || 'N/A',
          timestamp: u.lastLogin,
          type: 'login'
        }))
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setLogs(recentLogins);
    };

    loadData();
    // Poll for "real-time" updates every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const downloadExcelReport = () => {
    if (logs.length === 0) return;

    // CSV Header
    const headers = ['Name', 'Email', 'Role', 'Roll Number', 'Login Timestamp'];
    
    // CSV Rows
    const rows = logs.map(log => [
      log.name,
      log.email,
      log.role,
      `"${log.rollNumber}"`, // Quote roll number to prevent Excel formatting issues
      new Date(log.timestamp).toLocaleString()
    ]);

    // Combine into CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `campus_pass_login_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200">
                  System Administrator
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">Command Hub</h1>
              <p className="text-slate-500 text-lg font-medium">Global oversight and platform orchestration.</p>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200/50 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
              >
                <UserPlus size={20} />
                Invite Organizer
              </button>
              <Link to="/create-event" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
                <Plus size={20} />
                Launch Event
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Members', value: stats.totalMembers.toLocaleString(), change: 'All Roles', icon: Users, color: 'indigo' },
              { label: 'Student Accounts', value: stats.totalStudents.toLocaleString(), change: 'Registered Students', icon: Activity, color: 'emerald' },
              { label: 'Active Organizers', value: stats.organizers.toString(), change: 'Club Representatives', icon: ShieldCheck, color: 'violet' },
              { label: 'Live Events', value: stats.liveEvents.toString(), change: 'Across Campus', icon: Zap, color: 'amber' },
            ].map((stat, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={stat.label} 
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500`} />
                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6`}>
                  <stat.icon size={28} />
                </div>
                <div className="flex items-end justify-between mb-1">
                  <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.includes('new') || stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            {/* Tab Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-10 pt-10 border-b border-slate-50 gap-6">
              <div className="flex items-center gap-8">
                {[
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'organizers', label: 'Organizers', icon: ShieldCheck },
                  { id: 'users', label: 'Platform Users', icon: Users },
                  { id: 'logs', label: 'Audit Logs', icon: Database },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-8 text-xs font-black tracking-[0.2em] uppercase transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeAdminTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="pb-8 flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
                  />
                </div>
                <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-colors">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            {/* Tab Panels */}
            <div className="p-10">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div 
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    <div className="lg:col-span-2 space-y-8">
                      {/* Quick Actions removed */}
                    </div>

                    <div className="space-y-8">
                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 group-hover:scale-125 transition-transform duration-700" />
                        <h3 className="text-xl font-bold mb-6">Pending Approvals</h3>
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                              <div className="text-sm font-bold mb-1">New Event: Tech Fest 2026</div>
                              <div className="text-[10px] text-slate-400 font-medium mb-3">By Organizer Alex • 2h ago</div>
                              <div className="flex gap-2">
                                <button className="flex-grow py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all">Approve</button>
                                <button className="px-3 py-2 bg-white/5 text-slate-400 rounded-xl hover:text-white transition-colors"><XCircle size={14} /></button>
                              </div>
                            </div>
                          ))}
                          <button className="w-full py-3 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors">View All Pending</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'events' && (
                  <motion.div 
                    key="events"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4 -mt-4">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-6 py-4">Event Identity</th>
                            <th className="px-6 py-4">Organizer</th>
                            <th className="px-6 py-4 text-center">Registrations</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Operations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No events found.</td>
                            </tr>
                          ) : (
                            events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase())).map((ev) => (
                              <tr key={ev.id} className="group hover:bg-slate-50 transition-all bg-white shadow-sm ring-1 ring-slate-100 rounded-3xl">
                                <td className="px-6 py-5 rounded-l-[1.5rem]">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                      <img src={ev.image || `https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=100&h=100&fit=crop`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900">{ev.title}</div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{ev.date} • {ev.venue}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                                    <span className="text-sm font-bold text-slate-600">{ev.category}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                  <div className="font-black text-slate-900">{ev.registered || 0}</div>
                                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live Attendance</div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${ev.status === 'Draft' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                    {ev.status || 'Published'}
                                  </span>
                                </td>
                                <td className="px-6 py-5 rounded-r-[1.5rem] text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Settings size={16} /></button>
                                    <button 
                                      onClick={() => {
                                        if (window.confirm('Delete this event?')) {
                                          const updated = events.filter(e => e.id !== ev.id);
                                          localStorage.setItem('campus_pass_org_events', JSON.stringify(updated));
                                          setEvents(updated);
                                        }
                                      }}
                                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    ><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'organizers' && (
                  <motion.div 
                    key="organizers"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {organizers.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-slate-400 font-bold">No organizers found.</div>
                      ) : (
                        organizers.filter(o => o.name.toLowerCase().includes(searchQuery.toLowerCase())).map((org) => (
                          <div key={org.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-100">
                                {org.name.substring(0, 2).toUpperCase()}
                              </div>
                              <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                              {org.name}
                            </h4>
                            <p className="text-sm text-slate-400 font-medium mb-6">{org.email}</p>
                            
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Platform Role</span>
                                <span className="font-bold text-slate-700">Organizer</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 border border-emerald-100`}>
                                Active
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'users' && (
                  <motion.div 
                    key="users"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4 -mt-4">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined On</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allUsers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-20 text-center text-slate-400 font-bold">No users found.</td>
                            </tr>
                          ) : (
                            allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                              <tr key={u.id} className="group hover:bg-slate-50 transition-all bg-white shadow-sm ring-1 ring-slate-100 rounded-3xl">
                                <td className="px-6 py-5 rounded-l-[1.5rem]">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                                      {u.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                      <div className="font-bold text-slate-900">{u.name}</div>
                                      <div className="text-[10px] text-slate-400 font-medium">{u.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 
                                    u.role === 'organizer' ? 'bg-violet-50 text-violet-600' : 
                                    'bg-slate-50 text-slate-500'
                                  }`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-600">
                                  {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'Unknown'}
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-slate-600">
                                  {u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                </td>
                                <td className="px-6 py-5 rounded-r-[1.5rem] text-right">
                                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100">Active</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'logs' && (
                  <motion.div 
                    key="logs"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700">
                        <Clock size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Viewing access logs for the past 24 hours</span>
                      </div>
                      
                      <button 
                        onClick={downloadExcelReport}
                        disabled={logs.length === 0}
                        className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-200"
                      >
                        <Download size={18} />
                        Export Excel (.csv)
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4 -mt-4">
                        <thead>
                          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-6 py-4">User Identity</th>
                            <th className="px-6 py-4">Contact & Roll No</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Login Timestamp (Full)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-20 text-center text-slate-400 font-bold">No logins recorded in the last 24 hours.</td>
                            </tr>
                          ) : (
                            logs.map((log) => (
                              <tr key={log.id} className="group hover:bg-slate-50 transition-all bg-white shadow-sm ring-1 ring-slate-100 rounded-3xl">
                                <td className="px-6 py-5 rounded-l-[1.5rem]">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                                      {log.name[0].toUpperCase()}
                                    </div>
                                    <div className="font-bold text-slate-900">{log.name}</div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="text-sm font-bold text-slate-700">{log.email}</div>
                                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Roll: {log.rollNumber}</div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                    log.role === 'organizer' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {log.role}
                                  </span>
                                </td>
                                <td className="px-6 py-5 rounded-r-[1.5rem] text-right">
                                  <div className="text-sm font-black text-slate-900">
                                    {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </div>
                                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Invite Modal */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <UserPlus size={28} />
                  </div>
                  <button 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 mb-2">Invite Organizer</h3>
                <p className="text-slate-500 mb-8 font-medium">Send an invitation link to a club or society representative.</p>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsInviteModalOpen(false); alert('Invitation sent!'); }}>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., John Doe"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        placeholder="organizer@mru.ca"
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Club / Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Music Titans"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all mt-4"
                  >
                    Send Invitation Link
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
