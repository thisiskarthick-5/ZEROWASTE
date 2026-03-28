import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import MapComponent from '../components/MapComponent';

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
    <div className="min-h-screen bg-surface px-6 py-20 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl shadow-black/5 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Form */}
        <div className="flex-1 p-10 lg:p-16">
          <div className="mb-12">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-3xl mb-6 shadow-lg shadow-primary/20">
              <Heart className="fill-primary-dark text-primary-dark" size={32} />
            </div>
            <h2 className="text-4xl font-black text-primary-dark mb-4">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Log in to your Donatly account to continue making an impact.</p>
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
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-surface border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="text-slate-400" size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-surface border-none pl-12 pr-4 py-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-dark py-4 text-lg shadow-xl shadow-primary-dark/20 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              <LogIn className="group-hover:translate-x-1 transition-transform" size={20} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account? <Link to="/signup" className="text-primary-dark font-black hover:underline underline-offset-4">Create Account</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Map Preview / Visual */}
        <div className="lg:w-[45%] bg-primary-dark p-10 lg:p-16 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 mb-10 text-white">
            <h3 className="text-2xl font-black mb-2">Our Community Impact</h3>
            <p className="font-medium opacity-80 text-sm">Join thousands of donors and volunteers connecting in real-time to eliminate waste.</p>
          </div>
          
          <div className="relative z-10 flex-1 min-h-[300px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 group">
            <MapComponent 
              center={{ lat: 12.9716, lng: 77.5946 }} 
              markers={[
                { position: { lat: 12.9716, lng: 77.5946 }, title: 'Active Need', type: 'donor' },
                { position: { lat: 12.98, lng: 77.60 }, title: 'Trust Center', type: 'trust' },
                { position: { lat: 12.96, lng: 77.58 }, title: 'Volunteer', type: 'volunteer' }
              ]}
              selectable={false}
              showSearch={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-500"></div>
          </div>

          <div className="relative z-10 mt-10 space-y-4">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
              <div className="bg-primary p-2 rounded-full text-primary-dark">
                 <ShieldCheck size={20} />
              </div>
              <p className="text-white font-bold text-sm">Secure & Verified Profiles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
