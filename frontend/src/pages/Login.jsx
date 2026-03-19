import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 bg-surface">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-black/5"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-3xl mb-6">
            <Heart className="fill-primary-dark text-primary-dark" size={32} />
          </div>
          <h2 className="text-3xl font-black text-primary-dark">Welcome Back</h2>
          <p className="text-slate-500 font-medium mt-2">Log in to your Donatly account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3">
             <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
             {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-dark py-4 text-lg shadow-xl shadow-primary-dark/20 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-500 font-medium">
            Don't have an account? <Link to="/signup" className="text-primary-dark font-black hover:underline underline-offset-4">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
