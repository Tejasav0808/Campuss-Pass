import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, User, Users, ArrowRight, 
  Ticket, Mail, Lock, CheckCircle2,
  ChevronLeft, Send, Eye, EyeOff, KeyRound
} from 'lucide-react';

type Tab = 'student' | 'organizer' | 'admin';
type Mode = 'login' | 'signup' | 'forgot-password' | 'otp' | 'update-password';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as Tab) || 'student';
  const hasForcedRole = !!searchParams.get('role');

  const [activeTab, setActiveTab] = useState<Tab>(initialRole);
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loginWithPassword, resetPassword, updatePassword, user } = useAuth();

  useEffect(() => {
    document.title = 'CampusPass | Login';
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (hasForcedRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole, hasForcedRole]);

  useEffect(() => {
    // Check if the user arrived via a password reset/recovery link
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      setMode('update-password');
      setSuccessMsg('Recovery link verified. Please enter your new password.');
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'update-password') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      setIsSending(true);
      const result = await updatePassword(password);
      setIsSending(false);
      if (result.success) {
        setSuccessMsg('Password updated successfully!');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        setError(result.message || 'Failed to update password');
      }
      return;
    }

    if (activeTab === 'student' && !email.endsWith('@mru.ac.in')) {
      setError(`please use your college mail id`);
      return;
    }

    if (mode === 'forgot-password') {
      setIsSending(true);
      const result = await resetPassword(email);
      setIsSending(false);
      if (result.success) {
        setIsResetSent(true);
      } else {
        setError(result.message || 'Failed to send reset link');
      }
      return;
    }

    if (mode === 'login') {
      setIsSending(true);
      const result = await loginWithPassword(email, password);
      setIsSending(false);
      
      if (result.success) {
        setSuccessMsg('Login successful!');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } else {
        setError(result.message || 'Invalid credentials');
      }
      return;
    }

    if (mode === 'otp') {
      setIsSending(true);
      const result = await verifyOtp(email, otpCode, password, activeTab, name);
      setIsSending(false);
      
      if (result.success) {
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } else {
        setError(result.message || 'Invalid OTP');
      }
      return;
    }

    // mode is signup
    setIsSending(true);
    const result = await sendOtp(email);
    setIsSending(false);
    
    if (result.success) {
      setSuccessMsg('OTP sent to your email!');
      setTimeout(() => {
        setSuccessMsg('');
        setMode('otp');
      }, 1500);
    } else {
      setError(result.message || 'Failed to send OTP');
    }
  };

  const tabs = [
    { id: 'student', label: 'Student', icon: User, color: 'indigo' },
    { id: 'organizer', label: 'Organizer', icon: Users, color: 'violet' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-[#050014] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/10">
          {/* Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-6 hover:gap-3 transition-all">
              <ChevronLeft size={18} /> Back to Home
            </Link>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-500/20">
              <Ticket size={32} />
            </div>
            
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              {mode === 'forgot-password' ? 'Reset Password' : 
               mode === 'otp' ? 'Enter OTP' :
               mode === 'signup' ? 'Join the Hub' : 'Welcome Back'}
            </h1>
            <p className="text-slate-400">
              {mode === 'forgot-password' ? "Enter your email to receive a reset link." :
               mode === 'otp' ? `We sent a 6-digit code to ${email}` :
               mode === 'signup' ? 'Create your student account to start exploring.' : 
               `Sign in to your ${activeTab} account.`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-center text-sm font-semibold">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-center text-sm font-semibold">
              {successMsg}
            </div>
          )}

          {/* Role Tabs - Only show if role wasn't pre-selected from landing page and not in OTP mode */}
          {!hasForcedRole && (mode === 'login' || mode === 'signup') && (
            <div className="grid grid-cols-3 gap-3 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    activeTab === tab.id 
                      ? `border-${tab.color}-500 bg-${tab.color}-500/10 text-${tab.color}-400` 
                      : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-bold text-[10px] uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          {isResetSent ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Reset Link Sent!</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We've sent a password reset link to <span className="text-white font-bold">{email}</span>. Please check your inbox.
              </p>
              <button 
                onClick={() => { setMode('login'); setIsResetSent(false); }}
                className="text-indigo-400 font-bold hover:underline"
              >
                Back to Login
              </button>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleAuth}>
              {mode === 'otp' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">6-Digit Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white text-center tracking-[0.5em] text-2xl placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                      placeholder="------" 
                      required 
                    />
                  </div>
                </motion.div>
              ) : mode === 'update-password' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                        placeholder="••••••••" 
                        required 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                        placeholder="••••••••" 
                        required 
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {mode === 'signup' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                          placeholder="Enter your name" 
                          required 
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                        placeholder={
                          activeTab === 'admin' ? 'admin@campuspass.com' : 
                          activeTab === 'organizer' ? 'e.g., organizer@mru.ac.in' : 
                          'e.g., student@mru.ac.in'
                        }
                        required 
                      />
                    </div>
                  </div>

                  {mode !== 'forgot-password' && (
                    <div>
                      <div className="flex justify-between items-center mb-2 ml-1">
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                        <button 
                          type="button"
                          onClick={() => setMode('forgot-password')}
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                          placeholder="••••••••" 
                          required={mode === 'login' || mode === 'signup'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button 
                type="submit" 
                disabled={isSending}
                className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'admin' ? 'bg-emerald-600 shadow-emerald-600/20' : 
                  activeTab === 'organizer' ? 'bg-violet-600 shadow-violet-600/20' : 
                  'bg-indigo-600 shadow-indigo-600/20'
                }`}
              >
                {isSending ? (
                  <span className="animate-pulse">Processing...</span>
                ) : mode === 'forgot-password' ? 'Send Reset Link' : 
                    mode === 'otp' ? 'Verify OTP' :
                    mode === 'update-password' ? 'Update Password' :
                    mode === 'signup' ? 'Create Account (Send OTP)' : `Sign in as ${activeTab}`}
                {!isSending && <ArrowRight size={20} />}
              </button>

              {(mode === 'forgot-password' || mode === 'otp' || mode === 'update-password') && (
                <button 
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                  className="w-full text-slate-400 text-sm font-bold hover:text-white transition-colors"
                >
                  {mode === 'otp' ? 'Back to Login (Change Email)' : 'Back to Login'}
                </button>
              )}
            </form>
          )}

          {/* Toggle Sign Up / Mode Switch */}
          {activeTab === 'student' && mode !== 'forgot-password' && mode !== 'otp' && !isResetSent && (
            <div className="mt-8 text-center border-t border-white/5 pt-8">
              <button 
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-slate-400 text-sm font-bold hover:text-indigo-400 transition-colors"
              >
                {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          )}

          {activeTab === 'organizer' && mode === 'login' && !isResetSent && (
            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-3">
              <CheckCircle2 size={20} className="text-violet-400 mt-1" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Organizers are invited by Administrators. If you received an invitation email, click the link to set your password and log in.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
