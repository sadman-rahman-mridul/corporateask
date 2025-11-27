import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Loader2, LogIn, UserPlus } from 'lucide-react';
import Button from './Button';
import { supabase } from '../lib/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { role: string; username: string }) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Check Hardcoded Admin
      if (!isSignUp && formData.username === 'admin' && formData.password === 'hellohi') {
        onLoginSuccess({ role: 'admin', username: 'admin' });
        setLoading(false);
        onClose();
        return;
      }

      // 2. Handle DB Auth
      if (isSignUp) {
        // Sign Up Logic
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('username', formData.username)
          .single();

        if (existingUser) {
          setError('Username already taken');
          setLoading(false);
          return;
        }

        const { error: insertError } = await supabase
          .from('users')
          .insert({
            username: formData.username,
            password: formData.password, // Storing as plain text per request
            role: 'customer'
          });

        if (insertError) throw insertError;

        onLoginSuccess({ role: 'customer', username: formData.username });
        onClose();

      } else {
        // Login Logic (Check DB)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', formData.username)
          .eq('password', formData.password)
          .single();

        if (error || !data) {
          setError('Invalid username or password');
        } else {
          onLoginSuccess({ role: data.role, username: data.username });
          onClose();
        }
      }

    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 !bg-white !text-gray-900 focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all placeholder-gray-400";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              
              {/* Header - Matching BookingModal Style */}
              <div className="bg-brand-red p-6 flex justify-between items-center text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {isSignUp ? <UserPlus size={24} /> : <LogIn size={24} />}
                  {isSignUp ? 'অ্যাকাউন্ট খুলুন' : 'লগ ইন করুন'}
                </h2>
                <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ব্যবহারকারীর নাম (Username)</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Enter username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-brand-red text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                      ⚠️ {error}
                    </div>
                  )}

                  <Button type="submit" fullWidth disabled={loading} className="text-lg font-bold shadow-lg">
                    {loading ? (
                       <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
                    ) : (
                       isSignUp ? 'Sign Up' : 'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-gray-500 hover:text-brand-red font-medium transition-colors"
                  >
                    {isSignUp ? (
                      <>Already have an account? <span className="underline font-bold">Sign In</span></>
                    ) : (
                      <>Don't have an account? <span className="underline font-bold">Create Account</span></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;