import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Truck, MapPin, CheckCircle, Navigation, LayoutGrid, Package, Shield } from 'lucide-react';

export default function VolunteerDashboard() {
  const { userData } = useAuth();
  const socket = useSocket();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) fetchTasks();
  }, [userData]);

  useEffect(() => {
    if (!socket) return;
    socket.on('taskAssigned', () => fetchTasks());
    return () => socket.off('taskAssigned');
  }, [socket]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/requests/my/${userData.firebaseId}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(requestId, status) {
    try {
      await axios.patch(`${API_URL}/requests/status`, { requestId, status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Volunteer Dashboard</h1>
            <p className="text-slate-500 font-medium text-lg">Manage your assigned deliveries and track impact.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl">
               <Truck className="text-primary-dark" size={20} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400">Status</div>
              <div className="text-sm font-black text-primary-dark">Active Support</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black mb-8 text-primary-dark flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl text-primary-dark">
                <LayoutGrid size={24} />
              </div>
              Assigned Tasks
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-black/5 shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-4"></div>
                <p className="text-slate-400 font-bold">Loading your tasks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map(task => (
                  <div key={task._id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-transparent hover:border-primary transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-surface p-4 rounded-2xl">
                         <Package className="text-primary" size={32} />
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        task.status === 'assigned' ? 'bg-blue-50 text-blue-500' : 'bg-primary/20 text-primary-dark'
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-primary-dark mb-2">{task.foodPost.foodName}</h3>
                    <p className="text-slate-400 font-bold mb-6">Quantity: {task.foodPost.quantity}</p>

                    <div className="space-y-4 mb-8 bg-surface p-6 rounded-2xl">
                      <div className="flex items-start gap-3">
                         <MapPin className="text-primary-dark mt-1 shrink-0" size={18} />
                         <div>
                            <p className="text-xs uppercase font-black text-slate-400 tracking-wider">Pickup From</p>
                            <p className="text-sm font-bold text-primary-dark">{task.foodPost.donor?.address || 'Donor Address unavailable'}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3 border-t border-slate-200 pt-4">
                         <MapPin className="text-primary mt-1 shrink-0" size={18} />
                         <div>
                            <p className="text-xs uppercase font-black text-slate-400 tracking-wider">Deliver To</p>
                            <p className="text-sm font-bold text-primary-dark">{task.trust?.address || 'Trust Address unavailable'}</p>
                         </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {task.status === 'assigned' && (
                        <button 
                          onClick={() => updateStatus(task._id, 'picked')}
                          className="flex-1 btn-dark py-3 text-sm flex items-center justify-center gap-2"
                        >
                           Mark as Picked <CheckCircle size={18} />
                        </button>
                      )}
                      
                      {task.status === 'picked' && (
                        <button 
                          onClick={() => updateStatus(task._id, 'delivered')}
                          className="flex-1 bg-primary text-primary-dark py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                           Mark as Delivered <CheckCircle size={18} />
                        </button>
                      )}

                      {task.status === 'delivered' && (
                        <div className="flex items-center gap-2 text-emerald-500 font-bold px-4 py-3 rounded-xl bg-emerald-50 text-sm w-full justify-center">
                          <CheckCircle size={18} /> Mission Completed
                        </div>
                      )}
                      
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.foodPost.location.coordinates[1]},${task.foodPost.location.coordinates[0]}`)}
                        className="bg-surface p-3 rounded-xl text-primary-dark hover:bg-slate-200 transition-colors"
                      >
                        <Navigation size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="col-span-full bg-white p-20 rounded-[3rem] text-center shadow-xl shadow-black/5">
                    <div className="bg-surface w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Truck className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-primary-dark mb-2">No active missions</h3>
                    <p className="text-slate-400 font-medium">When a trust assigns you a delivery, it will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
             <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/5">
                <h3 className="text-xl font-black mb-6">Volunteer Profile</h3>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-primary-dark font-black text-2xl shadow-inner">
                      {userData?.name ? userData.name.charAt(0) : 'V'}
                   </div>
                   <div>
                      <div className="text-xl font-black text-primary-dark">{userData?.name || 'Volunteer'}</div>
                      <div className="text-sm font-bold text-slate-400 capitalize">{userData?.role || 'Service Member'}</div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-surface p-4 rounded-2xl">
                      <span className="font-bold text-slate-500">Completed</span>
                      <span className="font-black text-primary-dark">12 Deliveries</span>
                   </div>
                   <div className="flex justify-between items-center bg-surface p-4 rounded-2xl">
                      <span className="font-bold text-slate-500">Impact</span>
                      <span className="font-black text-primary-dark">240+ Meals</span>
                   </div>
                </div>
             </div>

             <div className="bg-primary p-8 rounded-[2.5rem] text-primary-dark overflow-hidden relative">
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-4">Be the Hero</h3>
                 <p className="font-bold mb-6 opacity-70 leading-relaxed">Your effort bridged the gap between excess and need.</p>
                 <button className="bg-primary-dark text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-primary-dark/20">
                    My Rewards
                 </button>
               </div>
               <Shield className="absolute -bottom-8 -right-8 text-black/5" size={180} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
