import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import MapComponent from '../components/MapComponent';
import DashboardLayout from '../components/DashboardLayout';
import { Package, Clock, MapPin, CheckCircle, PlusCircle, History, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonorDashboard() {
  const { userData } = useAuth();
  const socket = useSocket();
  const [donations, setDonations] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('Veg');
  const [expiry, setExpiry] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setLocation({ lat: userData.location.coordinates[1], lng: userData.location.coordinates[0] });
      fetchDonations();
    }
  }, [userData]);

  useEffect(() => {
    if (!socket) return;
    socket.on('donationAccepted', () => fetchDonations());
    socket.on('statusUpdated', () => fetchDonations());
    return () => {
      socket.off('donationAccepted');
      socket.off('statusUpdated');
    };
  }, [socket]);

  async function fetchDonations() {
    try {
      const res = await axios.get(`${API_URL}/food/my/${userData.firebaseId}`);
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/food`, {
        donorId: userData.firebaseId,
        foodName,
        quantity,
        type,
        expiryTime: expiry,
        latitude: location.lat,
        longitude: location.lng
      });
      setFoodName('');
      setQuantity('');
      fetchDonations();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  if (!userData || !location) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout role="donor">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Donor Dashboard</h1>
            <p className="text-slate-500 font-medium text-lg">Manage your contributions and post new donations.</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-[1.5rem] shadow-sm flex items-center gap-6 border border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary-dark">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Posts</p>
                <p className="text-xl font-black text-primary-dark">{donations.length}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Post Form */}
          <section className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-2xl shadow-black/5 h-fit border border-slate-50">
            <h2 className="text-2xl font-black mb-8 text-primary-dark flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
                <PlusCircle size={24} className="text-primary-dark" />
              </div> 
              Post Donation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4 group-focus-within:text-primary transition-colors">Food Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rice & Curry" 
                  className="w-full bg-slate-50 border-none p-5 rounded-3xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4 group-focus-within:text-primary transition-colors">Quantity</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10 kg / 20 persons" 
                  className="w-full bg-slate-50 border-none p-5 rounded-3xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Food Type</label>
                <div className="flex gap-4 p-1.5 bg-slate-50 rounded-[2rem]">
                  {['Veg', 'Non-Veg'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-4 px-6 rounded-3xl capitalize font-black transition-all ${type === t ? 'bg-white text-primary-dark shadow-xl shadow-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4 group-focus-within:text-primary transition-colors">Expiry Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-slate-50 border-none p-5 rounded-3xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Pickup Location</label>
                <div className="rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner h-[300px] relative">
                  <MapComponent 
                    center={location} 
                    markers={location ? [{ position: location }] : []}
                    onMapClick={setLocation}
                    selectable={true}
                    showSearch={true}
                  />
                  <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
                     <AlertCircle className="text-primary" size={14} />
                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">Drag marker to pin location</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-dark py-5 text-lg shadow-2xl shadow-primary-dark/20 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Donation'}
              </button>
            </form>
          </section>

          {/* List of Donations */}
          <section className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-primary-dark flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 text-primary-dark">
                <History size={24} />
              </div>
              Donation History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {donations.map((donation, idx) => (
                  <motion.div 
                    key={donation._id} 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 hover:translate-y-[-8px] transition-all border border-transparent hover:border-primary group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="bg-slate-50 p-5 rounded-3xl group-hover:bg-primary/10 transition-colors">
                        <Package className="text-primary" size={32} />
                      </div>
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                        donation.status === 'pending' ? 'bg-amber-50 text-amber-500 border border-amber-100' : 
                        donation.status === 'accepted' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 
                        'bg-primary/20 text-primary-dark border border-primary/10'
                      }`}>
                        {donation.status}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-primary-dark mb-2">{donation.foodName}</h3>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-sm font-bold text-slate-400">{donation.quantity}</span>
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                      <span className={`text-sm font-black ${donation.type === 'Veg' ? 'text-primary' : 'text-orange-400'}`}>{donation.type}</span>
                    </div>

                    <div className="space-y-4 text-sm font-bold text-slate-500 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary-dark shadow-sm">
                           <Clock size={16} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Expires</p>
                           <p className="text-sm font-black text-primary-dark opacity-80">{new Date(donation.expiryTime).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pb-2">
                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary-dark shadow-sm text-primary">
                           <MapPin size={16} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</p>
                           <p className="text-sm font-black text-primary-dark opacity-80">Pickup point verified</p>
                        </div>
                      </div>
                    </div>
                    
                    {donation.status === 'accepted' && (
                      <div className="mt-8 flex items-center gap-4 bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50">
                         <div className="bg-blue-500 text-white p-2 rounded-lg">
                            <CheckCircle size={18} />
                         </div>
                         <p className="text-xs font-black text-blue-600 uppercase tracking-wider">A trust has accepted this!</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {donations.length === 0 && (
                <div className="col-span-full bg-white text-center py-24 rounded-[3.5rem] shadow-xl shadow-black/5 border border-dashed border-slate-200">
                  <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Package size={48} className="text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-primary-dark mb-2">No donations yet</h3>
                  <p className="text-slate-400 font-bold max-w-sm mx-auto">Start your journey of kindness by posting your first food donation.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
