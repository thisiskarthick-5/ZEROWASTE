import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import MapComponent from '../components/MapComponent';
import { Package, Clock, MapPin, CheckCircle } from 'lucide-react';

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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Donor Dashboard</h1>
            <p className="text-slate-500 font-medium text-lg">Manage your contributions and post new donations.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl">
              <Package className="text-primary-dark" size={20} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">Your Impact</div>
              <div className="text-xl font-black text-primary-dark">{donations.length} Donations</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Post Form */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5 h-fit">
            <h2 className="text-2xl font-black mb-8 text-primary-dark flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl">
                <Package size={24} />
              </div> 
              Post Donation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Food Item Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rice & Curry" 
                  className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Quantity</label>
                <input 
                  type="text" 
                  placeholder="e.g. 10 kg / 20 persons" 
                  className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Food Type</label>
                <div className="flex gap-4 p-1 bg-surface rounded-2xl">
                  {['Veg', 'Non-Veg'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-3 px-4 rounded-xl capitalize font-black transition-all ${type === t ? 'bg-white text-primary-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Expiry Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Pickup Location</label>
                <div className="rounded-3xl overflow-hidden border-4 border-surface shadow-inner h-[250px]">
                  <MapComponent 
                    center={location} 
                    markers={location ? [{ position: location }] : []}
                    onMapClick={setLocation}
                    selectable={true}
                    showSearch={true}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn-dark py-4 text-lg shadow-xl shadow-primary-dark/20 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Donation'}
              </button>
            </form>
          </div>

          {/* List of Donations */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black mb-8 text-primary-dark flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-primary-dark">
                <Clock size={24} />
              </div>
              Donation History
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donations.map(donation => (
                <div key={donation._id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 hover:scale-[1.02] transition-all border border-transparent hover:border-primary">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-primary-dark">{donation.foodName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-slate-400">{donation.quantity}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className={`text-sm font-black ${donation.type === 'Veg' ? 'text-primary' : 'text-orange-400'}`}>{donation.type}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      donation.status === 'pending' ? 'bg-yellow-50 text-yellow-500' : 
                      donation.status === 'accepted' ? 'bg-blue-50 text-blue-500' : 
                      'bg-primary/20 text-primary-dark'
                    }`}>
                      {donation.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm font-bold text-slate-500 bg-surface p-4 rounded-2xl">
                    <p className="flex items-center gap-3"><Clock className="text-primary-dark" size={16} /> Expires: {new Date(donation.expiryTime).toLocaleString()}</p>
                    <p className="flex items-center gap-3"><MapPin className="text-primary-dark" size={16} /> Pickup point set on map</p>
                  </div>
                  
                  {donation.status === 'accepted' && (
                    <div className="mt-6 flex items-center gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                       <CheckCircle className="text-blue-500" size={20} />
                       <p className="text-sm font-bold text-blue-600">A community trust has accepted this!</p>
                    </div>
                  )}
                </div>
              ))}
              {donations.length === 0 && (
                <div className="col-span-full donatly-card bg-white text-center py-20">
                  <Package size={64} className="mx-auto text-slate-200 mb-6" />
                  <p className="text-slate-400 font-bold text-xl">You haven't posted any donations yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
