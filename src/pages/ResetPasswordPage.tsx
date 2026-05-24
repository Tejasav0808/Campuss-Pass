import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();

  useEffect(() => {
    document.title = 'CampusPass | Reset Password';
    
    // Check if there is an access token hash indicating a recovery attempt
    if (!window.location.hash.includes('access_token')) {
      setError('Invalid or expired password reset link. Please request a new one.');
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSending(true);
      const result = await updatePassword(password);

      if (result.success) {
        setSuccessMsg('Password updated successfully!');
        
        const role = user?.role;
        switch (role) {
          case 'admin': navigate('/admin', { replace: true }); break;
          case 'organizer': navigate('/organizer', { replace: true }); break;
          case 'organizer_pending': navigate('/organizer-pending', { replace: true }); break;
          default: navigate('/dashboard', { replace: true }); break;
        }
        return; // Stop execution after successful navigate
      } else {
        setError(result.message || 'Failed to update password');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSending(false);
    }
  };

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
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={32} />
            </div>
            
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
              Set New Password
            </h1>
            <p className="text-slate-400">
              Please enter your new password below.
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

          <form className="space-y-6" onSubmit={handleUpdatePassword}>
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
                    disabled={!!error && error.includes('Invalid')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={!!error && error.includes('Invalid')}
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
                    disabled={!!error && error.includes('Invalid')}
                  />
                </div>
              </div>
            </motion.div>

            <button 
              type="submit" 
              disabled={isSending || (!!error && error.includes('Invalid'))}
              className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 shadow-indigo-600/20`}
            >
              {isSending ? (
                <span className="animate-pulse">Updating...</span>
              ) : 'Update Password'}
              {!isSending && <ArrowRight size={20} />}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
