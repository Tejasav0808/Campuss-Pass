import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Tag, 
  ChevronRight, Users,
  CheckCircle2, X, QrCode, Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Payment, 4: Success
  const [screenshot, setScreenshot] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    rollNo: '',
    branch: '',
    semester: ''
  });

  const getEventData = () => {
    // Check localStorage first
    const saved = localStorage.getItem('campus_pass_org_events');
    if (saved) {
      const events = JSON.parse(saved);
      const found = events.find((e: any) => String(e.id) === id);
      if (found) {
        return {
          ...found,
          price: found.revenue.includes('@') ? found.revenue.split('@')[1].replace(')', '').trim() : (found.revenue.includes('$') ? found.revenue : 'Free'),
          isPaid: found.revenue.includes('$')
        };
      }
    }

    switch (id) {
      case '1': return { title: 'Cyber Security Hackathon', price: 'Free', isPaid: false, date: 'Oct 24, 2026', time: '10:00 AM', venue: 'MRU Main Hall', category: 'Mru cyber squad', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200' };
      case '2': return { title: 'AI Innovation Meetup', price: '₹150', isPaid: true, date: 'Nov 12, 2026', time: '6:00 PM', venue: 'Campus Green', category: 'AIML INNOVATION CLUB', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200' };
      case '3': return { title: 'Rudra Dance Fest', price: 'Free', isPaid: false, date: 'Dec 05, 2026', time: '5:30 PM', venue: 'Library Lounge', category: 'Rudra', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200' };
      case '4': return { title: 'Wild Cats Clan Meet', price: 'Free', isPaid: false, date: 'Oct 15, 2026', time: '8:00 AM', venue: 'Recreation Wing', category: 'wild cats', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1200' };
      case '5': return { title: 'IEEE Workshop', price: '₹250', isPaid: true, date: 'Dec 12, 2026', time: '2:00 PM', venue: 'Creative Studio', category: 'IEEE', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=1200' };
      default: return { title: 'Event Details', price: 'Free', isPaid: false, date: 'Oct 24, 2026', time: '10:00 AM', venue: 'Campus Venue', category: 'General', image: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=1200' };
    }
  };

  const eventData = getEventData();
  const isPaid = eventData.isPaid;
  const price = eventData.price;

  const saveRegistration = (status: 'confirmed' | 'pending') => {
    const existing = JSON.parse(localStorage.getItem('campus_pass_registrations') || '[]');
    const globalExisting = JSON.parse(localStorage.getItem('campus_pass_global_registrations') || '[]');
    
    const newReg = {
      id: `reg${Math.floor(Math.random() * 10000)}`,
      event_id: id,
      event_title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      venue: eventData.venue,
      status,
      price,
      image: eventData.image,
      student_name: formData.fullName,
      student_email: formData.email,
      student_roll: formData.rollNo,
      student_branch: formData.branch,
      student_semester: formData.semester,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem('campus_pass_registrations', JSON.stringify([newReg, ...existing]));
    localStorage.setItem('campus_pass_global_registrations', JSON.stringify([newReg, ...globalExisting]));

    // Update registered count in events list
    const savedEvents = localStorage.getItem('campus_pass_org_events');
    if (savedEvents) {
      const events = JSON.parse(savedEvents);
      const updatedEvents = events.map((ev: any) => {
        if (String(ev.id) === id) {
          return { ...ev, registered: (ev.registered || 0) + 1 };
        }
        return ev;
      });
      localStorage.setItem('campus_pass_org_events', JSON.stringify(updatedEvents));
    }
  };

  const handleNextStep = () => setStep(step + 1);

  const handleRegister = () => {
    saveRegistration(isPaid ? 'pending' : 'confirmed');
    setStep(4);
  };

  const handleVerify = () => {
    saveRegistration('pending');
    setStep(4);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 pt-8">
            <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold group">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                <ArrowLeft size={16} />
              </div>
              Back to Events
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-[400px] lg:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
              >
                <img src={eventData.image} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute top-8 left-8">
                  <span className="px-6 py-2.5 bg-white/95 backdrop-blur-md text-indigo-600 font-black text-xs tracking-widest rounded-2xl shadow-xl uppercase">
                    {eventData.category}
                  </span>
                </div>
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                  {eventData.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-slate-600">
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="text-indigo-600" size={20} />
                    <span className="font-bold">{eventData.date}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Clock className="text-indigo-600" size={20} />
                    <span className="font-bold">{eventData.time}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <MapPin className="text-indigo-600" size={20} />
                    <span className="font-bold">{eventData.venue}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">About the Event</h2>
                <div className="prose prose-slate max-w-none text-slate-500 leading-relaxed text-lg whitespace-pre-line">
                  {eventData.description || "Experience the future of campus life at our annual flagship event. Join us for an unforgettable opportunity to connect and grow."}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="sticky top-32">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-indigo-100/50"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Registration Fees</div>
                      <div className="text-4xl font-black text-slate-900">{price}</div>
                    </div>
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <Tag size={28} />
                    </div>
                  </div>
                  <button 
                    onClick={() => { setStep(1); setShowRegisterModal(true); }}
                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    Register Now
                    <ChevronRight size={20} />
                  </button>
                </motion.div>

                {/* Organizer */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 mt-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Organizer</h3>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="font-bold">{eventData.category}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowRegisterModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-10">
                <button onClick={() => setShowRegisterModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>

                {/* Step 1: Student Details */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Student Details</h2>
                      <p className="text-slate-500">Please provide your information to register.</p>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                          <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" placeholder="Your Name" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Roll Number</label>
                          <input type="text" value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" placeholder="e.g. 2K23CSUN0000" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" placeholder="Your Email" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Branch</label>
                          <input type="text" value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" placeholder="e.g. CSE" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Semester</label>
                          <input type="text" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" placeholder="e.g. 4" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <button onClick={handleNextStep} disabled={!formData.fullName || !formData.rollNo || !formData.branch} className="w-full py-5 bg-indigo-600 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                      Next: Review Fees <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Review Fees</h2>
                      <p className="text-slate-500">Check your details before proceeding.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Attendee</span><span className="text-slate-900 font-bold">{formData.fullName}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">ID / Roll No</span><span className="text-slate-900 font-bold">{formData.rollNo}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Branch</span><span className="text-slate-900 font-bold">{formData.branch} - Sem {formData.semester}</span></div>
                      <div className="border-t border-slate-200 pt-4 flex justify-between">
                        <span className="text-slate-900 font-bold">Registration Fees</span>
                        <span className="text-indigo-600 font-black text-xl">{price}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-grow py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl">Edit Details</button>
                      <button onClick={isPaid ? handleNextStep : handleRegister} className="flex-grow py-5 bg-indigo-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                        {isPaid ? 'Go to Payment' : 'Complete Registration'} <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <QrCode size={40} />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 mb-2">Secure Payment</h2>
                      <p className="text-slate-500">Scan the QR code below to pay <span className="font-bold text-violet-600">{price}</span></p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 flex justify-center shadow-inner">
                      <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-300">
                        <div className="text-center p-4">
                          <QrCode size={80} className="mx-auto text-slate-300 mb-2" />
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scan with GPay/PhonePe</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700 ml-1">Upload Payment Screenshot</label>
                      <div className="relative group">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center group-hover:border-violet-300 transition-colors">
                          <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                          <div className="text-sm font-bold text-slate-600">{screenshot ? screenshot.name : 'Choose a file or drag it here'}</div>
                          <div className="text-xs text-slate-400 mt-1">JPEG, PNG up to 5MB</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(2)} className="flex-grow py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl">Back</button>
                      <button onClick={handleVerify} disabled={!screenshot} className="flex-grow py-5 bg-violet-600 disabled:opacity-50 text-white font-black text-lg rounded-2xl shadow-xl shadow-violet-100 flex items-center justify-center gap-3">
                        Submit Screenshot <CheckCircle2 size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                  <div className="space-y-8 py-10">
                    <div className="text-center">
                      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 10 }} className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100">
                        <CheckCircle2 size={48} />
                      </motion.div>
                      <h2 className="text-3xl font-black text-slate-900 mb-4">Registration Sent!</h2>
                      <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                        {isPaid ? "Your payment is being verified manually. We'll notify you once confirmed." : "You're all set! Your registration is confirmed."}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Link to="/registrations" className="flex-grow py-5 bg-slate-900 text-white font-black text-center rounded-2xl shadow-xl shadow-slate-200">My Registrations</Link>
                      <button onClick={() => setShowRegisterModal(false)} className="flex-grow py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl">Dismiss</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
