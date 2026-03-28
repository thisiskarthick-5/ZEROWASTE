import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import MapComponent from '../components/MapComponent';
import { Phone, MapPin, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileSetup() {
  const { userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(userData?.address || '');
  const [location, setLocation] = useState(userData?.location || { type: 'Point', coordinates: [78.9629, 20.5937] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleComplete = async () => {
    if (!phone) return setError('Phone is required');
    setLoading(true);
    setError('');
    try {
      console.log('Finalizing profile setup for:', userData?.firebaseId);
      const res = await axios.patch(`${API_URL}/users/profile`, {
        firebaseId: userData.firebaseId,
        phone,
        address,
        location
      });
      console.log('Update response:', res.status);
      await refreshUserData();
      
      // Force immediate redirect if role exists
      const target = userData?.role || 'donor';
      setTimeout(() => navigate(`/${target}`), 800);
    } catch (err) {
      console.error('Setup error:', err);
      setError(err.response?.data?.msg || err.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-[4rem] shadow-2xl shadow-black/[0.03] border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[700px]"
      >
        {/* Left: Branding/Intro */}
        <div className="md:w-[40%] bg-primary-dark p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary-dark mb-8 shadow-2xl shadow-black/20">
                <Heart fill="currentColor" size={32} />
             </div>
             <h2 className="text-4xl font-black mb-4 leading-tight">Welcome, {userData?.name}!</h2>
             <p className="font-bold opacity-70 text-lg leading-relaxed">Let's set up your profile to start making an impact in your community.</p>
          </div>

          <div className="relative bg-white/10 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
             <div className="flex items-center gap-4 mb-3">
                <Sparkles className="text-primary" size={24} />
                <span className="text-xs font-black uppercase tracking-widest">Setup Progress</span>
             </div>
             <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  className="h-full bg-primary"
                ></motion.div>
             </div>
          </div>
        </div>

        {/* Right: Steps */}
        <div className="flex-1 p-12 lg:p-20 relative flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h3 className="text-3xl font-black text-primary-dark mb-2">Contact Details</h3>
                  <p className="text-slate-400 font-bold">Trusted volunteers need to reach you for pickups.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={24} />
                    <input 
                      type="tel" 
                      placeholder="+91 12345 67890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border-none pl-20 pr-8 py-6 rounded-[2rem] font-black text-xl outline-none focus:ring-4 ring-primary/10 transition-all placeholder:text-slate-200"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => phone && setStep(2)}
                  disabled={!phone}
                  className="w-full bg-primary-dark text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-primary-dark/20 disabled:opacity-50"
                >
                  Continue <ArrowRight size={24} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-3xl font-black text-primary-dark mb-2">Primary Location</h3>
                  <p className="text-slate-400 font-bold text-sm">Verify your address for local donation coordination.</p>
                </div>

                <div className="space-y-6">
                   <div className="h-[280px] rounded-[2.5rem] overflow-hidden border-2 border-slate-50 shadow-inner">
                      <MapComponent 
                        center={{ lat: location.coordinates[1], lng: location.coordinates[0] }}
                        onLocationSelect={(lat, lng, addr) => {
                          setLocation({ type: 'Point', coordinates: [lng, lat] });
                          if (addr) setAddress(addr);
                        }}
                      />
                   </div>
                   <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-50 border-none pl-16 pr-8 py-5 rounded-[1.8rem] font-bold text-sm outline-none focus:ring-4 ring-primary/10 transition-all"
                        placeholder="Confirm address"
                      />
                   </div>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-bold text-center animate-bounce">{error}</p>
                )}

                <div className="flex gap-4">
                   <button 
                     onClick={() => setStep(1)}
                     className="px-8 py-5 rounded-[1.8rem] font-black text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
                   >
                     Back
                   </button>
                   <button 
                     onClick={handleComplete}
                     disabled={loading}
                     className="flex-1 bg-primary text-primary-dark py-5 rounded-[1.8rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     {loading ? 'Finalizing...' : 'Complete Setup'}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
