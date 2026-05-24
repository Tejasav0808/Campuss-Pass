import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Upload, Calendar, MapPin, 
  DollarSign, QrCode, Info, ChevronRight, Clock, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'CampusPass | Create Event';
  }, []);

  if (authLoading) return null;

  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string || 'New Event';
    const date = formData.get('date') as string || 'TBD';
    const time = formData.get('time') as string || '10:00 AM';
    const venue = formData.get('venue') as string || 'Campus Venue';
    const mainCategory = formData.get('mainCategory') as string || 'Clubs';
    const category = formData.get('organizerName') as string || 'General';
    const description = formData.get('description') as string || 'No description provided.';
    const imageUrl = formData.get('image') as string || 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800';
    const price = formData.get('price') as string;
    
    const saved = localStorage.getItem('campus_pass_org_events');
    let events = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(events)) events = [];
    
    const newEvent = {
      id: Date.now(),
      title,
      description,
      registered: 0,
      date,
      time,
      venue,
      category,
      mainCategory,
      revenue: isPaid && price ? `$0 (0 tickets @ ₹${price})` : '$0',
      status: 'Live',
      image: imageUrl,
      creator_email: user.email
    };
    
    localStorage.setItem('campus_pass_org_events', JSON.stringify([newEvent, ...events]));

    setTimeout(() => {
      setLoading(false);
      alert('Event created successfully!');
      navigate('/dashboard', { replace: true });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-10 pt-8">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold group mb-6">
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Create Event</h1>
            <p className="text-slate-500 text-lg">Launch your next campus activity in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Poster Upload */}
            <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Upload size={20} />
                </div>
                Event Media
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Event Poster</label>
                  <div className="relative group h-64">
                    <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 group-hover:bg-slate-100 group-hover:border-indigo-300 transition-all cursor-pointer overflow-hidden">
                      <div className="text-center p-6">
                        <Upload className="mx-auto text-slate-400 mb-4" size={32} />
                        <p className="text-sm font-bold text-slate-600">Click or drag poster</p>
                        <p className="text-xs text-slate-400 mt-2">Recommended: 1200x800px</p>
                      </div>
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 h-full flex flex-col justify-center">
                    <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                      <Info size={18} />
                      Poster Tips
                    </h3>
                    <ul className="text-indigo-700/70 text-sm space-y-2 font-medium">
                      <li>• Use high-quality JPG or PNG</li>
                      <li>• Keep text minimal and legible</li>
                      <li>• Include your club logo</li>
                      <li>• Highlight the date and time clearly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Basic Info */}
            <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                  <Info size={20} />
                </div>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Event Title</label>
                  <input 
                    type="text" 
                    name="title"
                    placeholder="e.g., Annual Tech Innovation Summit"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell students what to expect..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Main Category</label>
                  <select 
                    name="mainCategory"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Clubs">Clubs</option>
                    <option value="Clans">Clans</option>
                    <option value="Societies">Societies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Organizing Body (Club/Clan/Society)</label>
                  <div className="relative">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="organizerName"
                      list="organizer-options"
                      placeholder="e.g. Mru cyber squad or enter manually"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                    <datalist id="organizer-options">
                      <optgroup label="Clubs">
                        <option value="Mru cyber squad" />
                        <option value="AIML INNOVATION CLUB" />
                        <option value="CCMRU" />
                        <option value="IEEE" />
                      </optgroup>
                      <optgroup label="Clans">
                        <option value="wild cats" />
                        <option value="Airfalcons" />
                        <option value="Forest rhinos" />
                        <option value="MRU Foundation" />
                      </optgroup>
                      <optgroup label="Societies">
                        <option value="Rudra" />
                        <option value="Moksha" />
                        <option value="Khalibali" />
                        <option value="Noora" />
                        <option value="felicia" />
                      </optgroup>
                    </datalist>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Event Type / Tag</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer">
                    <option>Technology</option>
                    <option>Music</option>
                    <option>Arts</option>
                    <option>Business</option>
                    <option>Wellness</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Venue</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      name="venue"
                      placeholder="e.g., Main Hall, Building A"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Date & Time */}
            <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                Date & Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="date" 
                      name="date"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Event Time</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="time" 
                      name="time"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing & Payments */}
            <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                  Pricing & Payments
                </h2>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!isPaid ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    Free
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isPaid ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {isPaid && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Ticket Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="number" 
                        name="price"
                        placeholder="0.00"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required={isPaid}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Payment QR Code</label>
                    <div className="relative group">
                      <div className="flex items-center gap-4 w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl group-hover:bg-slate-100 group-hover:border-amber-300 transition-all cursor-pointer">
                        <QrCode className="text-slate-400" size={24} />
                        <span className="text-sm font-bold text-slate-600">Upload GPay/QR</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!isPaid && (
                <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-emerald-700 font-bold">This event is free for all students!</p>
                  <p className="text-emerald-600/70 text-sm">Registrations will be confirmed automatically.</p>
                </div>
              )}
              </section>

              {/* Event Content */}
              <section className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Info size={20} />
                  </div>
                  Event Content
                </h2>
                
                {/* Event Description */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                    Description
                  </label>
                  <textarea 
                    name="description"
                    rows={4}
                    placeholder="Tell students what this event is about, what they'll learn, and why they should attend..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-600 leading-relaxed"
                    required
                  ></textarea>
                </div>

                {/* Event Image */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                    Cover Image URL
                  </label>
                  <input 
                    type="url" 
                    name="image"
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-6 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                  <p className="text-[10px] text-slate-400 px-1 italic">Pro Tip: Use a high-quality image URL from Unsplash for a professional look.</p>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-6 pt-10">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-12 py-5 bg-slate-900 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4 disabled:opacity-50"
                >
                  {loading ? 'Launching...' : 'Launch Event'}
                  <ChevronRight size={24} />
                </button>
              </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
