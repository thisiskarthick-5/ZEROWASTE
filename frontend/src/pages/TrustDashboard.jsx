import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import MapComponent from '../components/MapComponent';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Navigation, 
  Heart, 
  Shield, 
  Users,
  LayoutGrid,
  Package,
  Activity,
  ArrowRight,
  Bell,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrustDashboard() {
  const { userData } = useAuth();
  const socket = useSocket();
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [myMissions, setMyMissions] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(5000); // meters
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (userData) {
      fetchNearby();
      fetchMyMissions();
      fetchVolunteers();
    }
  }, [userData, radius]);

  useEffect(() => {
    if (!socket) return;
    socket.on('newDonation', () => fetchNearby());
    socket.on('missionUpdated', () => {
      fetchNearby();
      fetchMyMissions();
    });
    return () => {
      socket.off('newDonation');
      socket.off('missionUpdated');
    };
  }, [socket]);

  async function fetchNearby() {
    try {
      if (!userData?.location?.coordinates) return;
      const [lng, lat] = userData.location.coordinates;
      const res = await axios.get(`${API_URL}/food/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      setNearbyDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchMyMissions() {
    try {
      const res = await axios.get(`${API_URL}/requests/my/${userData.firebaseId}`);
      setMyMissions(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchVolunteers() {
    try {
      const res = await axios.get(`${API_URL}/users/volunteers`);
      setVolunteers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function acceptDonation() {
    if (!selectedDonation) return;
    try {
      await axios.post(`${API_URL}/requests/accept`, {
        trustFirebaseId: userData.firebaseId,
        foodId: selectedDonation._id
      });
      setShowModal(false);
      setSelectedDonation(null);
      fetchNearby();
      fetchMyMissions();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAssign(requestId, volunteerId) {
    if (!volunteerId) return;
    try {
      await axios.patch(`${API_URL}/requests/assign`, { requestId, volunteerId });
      fetchMyMissions();
    } catch (err) {
      console.error(err);
    }
  }

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout role="trust">
      <AnimatePresence>
        {showModal && selectedDonation && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black text-primary-dark mb-2">Confirm Acceptance</h2>
                    <p className="text-slate-400 font-bold">Please verify donor contact info before proceeding.</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-red-400 transition-colors">
                    <X size={32} />
                  </button>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                         <Mail size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Donor Email</p>
                         <p className="font-bold text-primary-dark">{selectedDonation.donor?.email || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                         <Phone size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Donor Phone</p>
                         <p className="font-bold text-primary-dark">{selectedDonation.donor?.phone || 'Not provided'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                         <MapPin size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Pickup Address</p>
                         <p className="font-bold text-primary-dark">{selectedDonation.donor?.address || 'N/A'}</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => setShowModal(false)}
                     className="flex-1 py-5 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
                   >
                     Go Back
                   </button>
                   <button 
                     onClick={acceptDonation}
                     className="flex-[2] bg-primary-dark text-white py-5 rounded-2xl font-black shadow-xl shadow-primary-dark/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                   >
                      Confirm & Accept <ArrowRight size={20} />
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-20 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h1 className="text-[3.5rem] font-black text-primary-dark leading-none mb-4">Trust Dashboard</h1>
            <p className="text-slate-500 font-bold text-lg">Manage community coordination and rescue missions.</p>
          </div>
          
          <div className="bg-white p-2 rounded-[2rem] shadow-sm flex items-center border border-slate-100 mt-4 h-fit">
             <span className="text-[10px] font-black uppercase text-slate-400 px-6 tracking-[0.2em]">Radius</span>
             <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem]">
               {[2000, 5000, 10000].map((r) => (
                 <button 
                   key={r}
                   onClick={() => setRadius(r)}
                   className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${radius === r ? 'bg-white text-primary-dark shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {r/1000}km
                 </button>
               ))}
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section className="space-y-8">
            <h2 className="text-2xl font-black text-primary-dark flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 text-primary-dark">
                <MapPin size={24} />
              </div>
              Nearby Donations
              <div className="ml-auto flex bg-slate-100 p-1 rounded-2xl">
                 {[2000, 5000, 10000].map(r => (
                   <button 
                     key={r}
                     onClick={() => setRadius(r)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${radius === r ? 'bg-white text-primary-dark shadow-sm' : 'text-slate-400'}`}
                   >
                     {r/1000}KM
                   </button>
                 ))}
              </div>
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence>
                {nearbyDonations.map((post, idx) => (
                  <motion.div 
                    key={post._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 flex flex-col sm:flex-row justify-between items-center gap-8 border border-transparent hover:border-primary transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-slate-50 p-5 rounded-3xl group-hover:bg-primary/10 transition-colors">
                        <Package className="text-primary" size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-primary-dark mb-1">{post.foodName}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{post.type} • {post.donor?.name || 'Donor'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedDonation(post);
                        setShowModal(true);
                      }}
                      className="w-full sm:w-auto btn-dark py-4 px-8 text-sm flex items-center gap-3 active:scale-95 transition-all text-white"
                    >
                      Accept <ArrowRight size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {nearbyDonations.length === 0 && <p className="text-center py-12 text-slate-400 font-bold italic">No donations in this range...</p>}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-black text-primary-dark flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 text-primary-dark">
                <Activity size={24} />
              </div>
              Live Regional View
            </h2>
            <div className="rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl h-[500px]">
              <MapComponent 
                center={userData?.location?.coordinates ? { lat: userData.location.coordinates[1], lng: userData.location.coordinates[0] } : { lat: 20.5937, lng: 78.9629 }}
                markers={[
                  ...(userData?.location ? [{
                    position: { lat: userData.location.coordinates[1], lng: userData.location.coordinates[0] },
                    title: "Your Trust Center"
                  }] : []),
                  ...nearbyDonations.map(d => ({
                    position: { lat: d.location.coordinates[1], lng: d.location.coordinates[0] },
                    title: d.foodName
                  }))
                ]}
              />
            </div>
          </section>

          {myMissions.length > 0 && (
            <section className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-black text-primary-dark flex items-center gap-4">
                <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 text-primary-dark">
                  <Users size={24} />
                </div>
                Active Missions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {myMissions.map((mission) => (
                  <div key={mission._id} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-slate-50">
                    <div className="flex justify-between items-start mb-6">
                       <h4 className="text-xl font-black text-primary-dark">{mission.foodPost?.foodName}</h4>
                       <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">{mission.status}</span>
                    </div>
                    {mission.status === 'assigned_to_trust' ? (
                       <div className="flex gap-3">
                          <select 
                            onChange={(e) => mission._tempVolunteer = e.target.value}
                            className="flex-1 bg-slate-50 border-none px-4 py-3 rounded-2xl font-bold text-xs outline-none focus:ring-4 ring-primary/20"
                            defaultValue=""
                          >
                            <option value="" disabled>Select Volunteer</option>
                            {volunteers.map(v => (
                              <option key={v.firebaseId} value={v.firebaseId}>{v.name}</option>
                            ))}
                          </select>
                          <button 
                            onClick={() => handleAssign(mission._id, mission._tempVolunteer)}
                            className="bg-primary text-primary-dark p-3 rounded-2xl shadow-lg shadow-primary/20 active:scale-90 transition-all font-black"
                          >
                             Assign
                          </button>
                       </div>
                    ) : (
                       <p className="text-xs font-bold text-slate-400">Being handled by {mission.volunteer?.name || 'a volunteer'}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
