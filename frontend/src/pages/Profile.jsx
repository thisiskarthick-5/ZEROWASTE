import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import DashboardLayout from '../components/DashboardLayout';
import MapComponent from '../components/MapComponent';
import { User, Mail, Phone, MapPin, Save, Camera, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    location: userData?.location || { type: 'Point', coordinates: [78.9629, 20.5937] }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.patch(`${API_URL}/users/profile`, {
        firebaseId: userData.firebaseId,
        ...formData
      });
      await refreshUserData();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={userData?.role}>
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">My Profile</h1>
            <p className="text-slate-400 font-bold">Manage your personal information and location.</p>
          </div>
          <button 
            onClick={() => navigate(`/${userData?.role}`)}
            className="flex items-center gap-3 text-slate-400 font-bold hover:text-primary transition-colors bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-50"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Avatar & Quick Info */}
          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-black/5 border border-slate-50 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary-dark text-5xl font-black border-4 border-white shadow-xl">
                  {userData?.name?.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 text-slate-400 hover:text-primary transition-colors">
                  <Camera size={20} />
                </button>
              </div>
              <h2 className="text-2xl font-black text-primary-dark mb-1">{userData?.name}</h2>
              <p className="text-xs font-black uppercase tracking-widest text-primary px-4 py-1.5 bg-primary/5 rounded-full inline-block">{userData?.role}</p>
              
              <div className="mt-10 pt-10 border-t border-slate-50 space-y-6 text-left">
                <div className="flex items-center gap-4 text-slate-400">
                  <Mail size={18} />
                  <span className="text-sm font-bold truncate">{userData?.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                  <User size={18} />
                  <span className="text-sm font-bold">Member since {new Date(userData?.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Edit Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleUpdate} className="bg-white p-12 rounded-[3.5rem] shadow-xl shadow-black/5 border border-slate-50 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-none pl-16 pr-8 py-5 rounded-[1.8rem] font-bold outline-none focus:ring-4 ring-primary/10 transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border-none pl-16 pr-8 py-5 rounded-[1.8rem] font-bold outline-none focus:ring-4 ring-primary/10 transition-all"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Pickup / Center Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-50 border-none pl-16 pr-8 py-5 rounded-[1.8rem] font-bold outline-none focus:ring-4 ring-primary/10 transition-all"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Location Validation</label>
                <div className="h-[300px] rounded-[2rem] overflow-hidden border-4 border-white shadow-inner bg-slate-50">
                  <MapComponent 
                    center={{ lat: formData.location.coordinates[1], lng: formData.location.coordinates[0] }}
                    onLocationSelect={(lat, lng, address) => {
                      setFormData({
                        ...formData,
                        address: address || formData.address,
                        location: { type: 'Point', coordinates: [lng, lat] }
                      });
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <p className={`text-sm font-bold ${message.includes('success') ? 'text-emerald-500' : 'text-red-500'}`}>{message}</p>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-sm flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary-dark/10"
                >
                  {loading ? 'Saving...' : <><Save size={20} /> Save Profile</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
