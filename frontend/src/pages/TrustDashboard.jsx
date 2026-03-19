import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import MapComponent from '../components/MapComponent';
import { MapPin, Search, CheckCircle, UserPlus, Heart, Shield, Clock, Package, ChevronRight, LayoutGrid, Users } from 'lucide-react';

export default function TrustDashboard() {
  const { userData } = useAuth();
  const socket = useSocket();
  const [nearbyFood, setNearbyFood] = useState([]);
  const [radius, setRadius] = useState(5000); // 5km
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState({});

  useEffect(() => {
    if (userData) {
      fetchNearbyFood();
      fetchVolunteers();
      fetchMyRequests();
    }
  }, [userData, radius]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newDonation', () => fetchNearbyFood());
    socket.on('foodAccepted', () => {
      fetchNearbyFood();
      fetchMyRequests();
    });
    socket.on('statusUpdated', () => fetchMyRequests());

    return () => {
      socket.off('newDonation');
      socket.off('foodAccepted');
      socket.off('statusUpdated');
    };
  }, [socket]);

  async function fetchNearbyFood() {
    if (!userData?.location?.coordinates) return;
    setLoading(true);
    setError(null);
    try {
      const { coordinates } = userData.location;
      const res = await axios.get(`${API_URL}/food/nearby?lat=${coordinates[1]}&lng=${coordinates[0]}&radius=${radius}`);
      setNearbyFood(res.data);
    } catch (err) {
      console.error('Error fetching nearby food:', err);
      setError(err.response?.data?.msg || 'Could not find nearby donations.');
    }
    setLoading(false);
  }

  async function fetchVolunteers() {
    try {
      const res = await axios.get(`${API_URL}/users/volunteers`);
      setVolunteers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMyRequests() {
    try {
      const res = await axios.get(`${API_URL}/requests/my/${userData.firebaseId}`);
      setMyRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAccept(foodId) {
    try {
      await axios.post(`${API_URL}/requests/accept`, {
        foodId,
        trustFirebaseId: userData.firebaseId
      });
      fetchNearbyFood();
      fetchMyRequests();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAssign(requestId) {
    if (!selectedVolunteer[requestId]) return;
    try {
      await axios.patch(`${API_URL}/requests/assign`, {
        requestId,
        volunteerId: selectedVolunteer[requestId]
      });
      fetchMyRequests();
    } catch (err) {
      console.error(err);
    }
  }

  if (!userData?.location?.coordinates) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mx-auto"></div>
          <p className="text-slate-400 font-bold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Trust Dashboard</h1>
            <p className="text-slate-500 font-medium text-lg">Manage community support and coordination.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl">
               <Shield className="text-primary-dark" size={20} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">Trust Hub</div>
              <div className="text-sm font-black text-primary-dark truncate max-w-[200px]">{userData.name}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Phase 1: Available Food */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-primary-dark flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-xl text-primary-dark">
                    <Heart size={24} />
                  </div>
                  Nearby Donations
                </h2>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm">
                  <span className="text-xs font-black text-slate-400 uppercase ml-2">Radius:</span>
                  <select 
                    className="bg-surface border-none px-4 py-2 rounded-xl outline-none font-bold text-sm"
                    value={radius}
                    onChange={e => setRadius(Number(e.target.value))}
                  >
                    <option value={2000}>2 km</option>
                    <option value={5000}>5 km</option>
                    <option value={10000}>10 km</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-xl shadow-black/5">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4"></div>
                  <p className="text-slate-400 font-bold">Scanning for food...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nearbyFood.map(food => (
                    <div key={food._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-black/5 border border-transparent hover:border-primary transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-surface p-4 rounded-2xl">
                           <Package className="text-primary" size={32} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                           food.type === 'Veg' ? 'bg-primary/20 text-primary-dark' : 'bg-orange-50 text-orange-500'
                        }`}>
                          {food.type}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-primary-dark mb-2">{food.foodName}</h3>
                      <p className="text-slate-400 font-bold mb-6">Donor: {food.donor?.name || 'Anonymous'}</p>

                      <div className="bg-surface p-4 rounded-2xl mb-8 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                           <Clock size={14} /> Expires
                        </div>
                        <p className="text-sm font-bold text-primary-dark">{new Date(food.expiryTime).toLocaleString()}</p>
                      </div>

                      <button 
                        onClick={() => handleAccept(food._id)}
                        className="w-full btn-dark py-4 rounded-2xl text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-dark transition-all"
                      >
                        Accept Donation <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                  {nearbyFood.length === 0 && (
                    <div className="col-span-full donatly-card bg-white py-20">
                       <p className="text-slate-400 font-bold">No new donations in this radius.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Phase 2: Active Requests & Volunteer Assignment */}
            <section>
              <h2 className="text-2xl font-black text-primary-dark mb-8 flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-primary-dark">
                  <LayoutGrid size={24} />
                </div>
                Active Missions
              </h2>

              <div className="space-y-6">
                {myRequests.map(req => (
                  <div key={req._id} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 flex flex-col md:flex-row gap-8 items-center border border-slate-100">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-4">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                            req.status === 'assigned' ? 'bg-blue-100 text-blue-600' : 
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-bold text-slate-400">ID: {req._id.slice(-6)}</span>
                       </div>
                       <h3 className="text-2xl font-black text-primary-dark mb-2">{req.foodPost?.foodName || 'Food Item'}</h3>
                       <p className="text-slate-500 font-medium">Pickup from {req.foodPost?.donor?.name || 'Donor'}</p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-4">
                      {req.status === 'pending' ? (
                        <div className="flex flex-col gap-3 min-w-[250px]">
                           <select 
                            className="bg-surface border-none p-4 rounded-2xl font-bold text-sm outline-none"
                            value={selectedVolunteer[req._id] || ''}
                            onChange={(e) => setSelectedVolunteer({...selectedVolunteer, [req._id]: e.target.value})}
                           >
                              <option value="">Select Volunteer</option>
                              {volunteers.map(v => (
                                <option key={v._id} value={v._id}>{v.name}</option>
                              ))}
                           </select>
                           <button 
                            onClick={() => handleAssign(req._id)}
                            className="btn-dark py-4 text-sm"
                           >
                            Assign Volunteer
                           </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 bg-surface p-6 rounded-[2rem] min-w-[250px]">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-black shadow-sm">
                              {req.volunteer?.name?.charAt(0) || 'V'}
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</p>
                              <p className="text-sm font-bold text-primary-dark">{req.volunteer?.name || 'Volunteer'}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {myRequests.length === 0 && (
                  <div className="donatly-card bg-white py-12 text-center">
                    <p className="text-slate-400 font-bold">No active missions to display.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-black/5 overflow-hidden border-4 border-white h-fit">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-primary-dark">
                  <div className="bg-primary p-1.5 rounded-lg">
                     <MapPin size={16} />
                  </div>
                  Regional View
                </h3>
                <div className="h-[350px] rounded-[2rem] overflow-hidden">
                  <MapComponent 
                    center={{ lat: userData.location.coordinates[1], lng: userData.location.coordinates[0] }}
                    markers={[
                      ...nearbyFood.map(f => ({
                        position: { lat: f.location.coordinates[1], lng: f.location.coordinates[0] },
                        title: f.foodName,
                        type: 'donor'
                      })),
                      ...myRequests.filter(r => r.foodPost).map(r => ({
                        position: { lat: r.foodPost.location.coordinates[1], lng: r.foodPost.location.coordinates[0] },
                        title: `Accepted: ${r.foodPost.foodName}`,
                        type: 'trust'
                      }))
                    ]}
                  />
                </div>
             </div>

             <div className="bg-primary p-8 rounded-[2.5rem] text-primary-dark relative overflow-hidden h-fit">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                     <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                        <div className="text-3xl font-black">{myRequests.length}</div>
                        <div className="text-[10px] font-black uppercase opacity-60">Total Missions</div>
                     </div>
                     <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                        <div className="text-3xl font-black">{volunteers.length}</div>
                        <div className="text-[10px] font-black uppercase opacity-60">Volunteers Online</div>
                     </div>
                  </div>
                </div>
                <Users className="absolute -bottom-6 -right-6 text-black/5" size={160} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
