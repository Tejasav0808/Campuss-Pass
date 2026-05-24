import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Role } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  sendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (email: string, otp: string, password?: string, role?: Role, name?: string) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, password: string, name: string, role: Role) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and listen to Supabase auth state changes
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as Role) || 'student',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        // Fallback for legacy local storage user if they haven't migrated to Supabase
        const savedUser = localStorage.getItem('campus_pass_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as Role) || 'student',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sendOtp = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string, password?: string, role: Role = 'student', name?: string) => {
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      
      if (data.success) {
        if (!password) {
          return { success: false, message: 'Password is required to complete signup' };
        }
        
        console.log('OTP verified successfully on backend. Signing up on Supabase...', { email, role, name });
        // OTP verified successfully, now create the user in Supabase
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              role: role,
            }
          }
        });
        console.log('Supabase signup response received:', { signUpData, signUpError });

        if (signUpError) {
          console.error('Supabase signup error:', signUpError);
          return { success: false, message: signUpError.message };
        }
        
        return { success: true, message: 'Account created successfully!' };
      }
      
      return data;
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  }, []);

  const loginWithPassword = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Mock fallback for legacy users who haven't set up Supabase yet
        const savedUser = localStorage.getItem('campus_pass_user');
        if (savedUser) {
           const parsedUser = JSON.parse(savedUser);
           if (parsedUser.email === email) {
              setUser(parsedUser);
              return { success: true, message: 'Logged in via legacy method' };
           }
        }
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Logged in successfully!' };
    } catch (error) {
       console.error('Login error:', error);
       return { success: false, message: 'Network error. Please try again later.' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('campus_pass_user');
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, role: Role) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error' };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { success: false, message: error.message };
      return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  }, []);

  const value = useMemo(() => ({
    user, sendOtp, verifyOtp, loginWithPassword, signup, resetPassword, updatePassword, logout, loading
  }), [user, sendOtp, verifyOtp, loginWithPassword, signup, resetPassword, updatePassword, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
