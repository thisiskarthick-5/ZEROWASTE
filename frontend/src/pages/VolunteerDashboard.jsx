import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Truck, 
  MapPin, 
  CheckCircle, 
  Navigation, 
  LayoutGrid, 
  Package, 
  Shield, 
  Trophy,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    socket.on('statusUpdated', () => fetchTasks());
    return () => {
      socket.off('taskAssigned');
      socket.off('statusUpdated');
    };
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
    <DashboardLayout role="volunteer">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Volunteer Dashboard</h1>
            <p className="text-slate-500 font-medium text-lg">Your mission: bridge the gap between waste and want.</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-[1.5rem] shadow-sm flex items-center gap-6 border border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary-dark">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Missions</p>
                <p className="text-xl font-black text-primary-dark">{tasks.filter(t => t.status !== 'delivered').length}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black mb-8 text-primary-dark flex items-center gap-4">
              <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 text-primary-dark">
                <LayoutGrid size={24} />
              </div>
              Assigned Tasks
            </h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3.5rem] shadow-2xl shadow-black/5 border border-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary mb-6"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing missions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence>
                  {tasks.map((task, idx) => (
                    <motion.div 
                      key={task._id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-transparent hover:border-primary transition-all group flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div className="bg-slate-50 p-5 rounded-3xl group-hover:bg-primary/10 transition-colors">
                           <Package className="text-primary" size={32} />
                        </div>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          task.status === 'assigned' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
                          task.status === 'picked' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                          'bg-primary/20 text-primary-dark border-primary/20'
                        }`}>
                          {task.status}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-primary-dark mb-2 tracking-tight">{task.foodPost.foodName}</h3>
                      <p className="text-slate-400 font-bold mb-8">Quantity: {task.foodPost.quantity}</p>

                      <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex-1">
                        <div className="flex items-start gap-4">
                           <div className="bg-white p-2 rounded-lg shadow-sm">
                              <MapPin className="text-primary-dark" size={16} />
                           </div>
                           <div>
                              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Pickup From</p>
                              <p className="text-sm font-bold text-primary-dark opacity-80 leading-snug">{task.foodPost.donor?.address || 'Address on Map'}</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 border-t border-slate-200 pt-4">
                           <div className="bg-white p-2 rounded-lg shadow-sm">
                              <MapPin className="text-primary" size={16} />
                           </div>
                           <div>
                              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Deliver To</p>
                              <p className="text-sm font-bold text-primary-dark opacity-80 leading-snug">{task.trust?.address || 'Trust Hub'}</p>
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        {task.status === 'assigned' && (
                          <button 
                            onClick={() => updateStatus(task._id, 'picked')}
                            className="flex-1 btn-dark py-4 text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-primary-dark/10 active:scale-95 transition-all"
                          >
                             Confirm Pickup <ArrowRight size={18} />
                          </button>
                        )}
                        
                        {task.status === 'picked' && (
                          <button 
                            onClick={() => updateStatus(task._id, 'delivered')}
                            className="flex-1 bg-primary text-primary-dark py-4 rounded-[1.5rem] font-black text-sm flex items-center justify-center gap-3 hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                          >
                             Mark as Delivered <CheckCircle size={18} />
                          </button>
                        )}

                        {task.status === 'delivered' && (
                          <div className="flex items-center gap-3 text-emerald-600 font-black px-6 py-4 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 text-sm w-full justify-center">
                            <CheckCircle size={18} /> Mission Accomplished
                          </div>
                        )}
                        
                        <button 
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${task.foodPost.location.coordinates[1]},${task.foodPost.location.coordinates[0]}`)}
                          className="bg-slate-50 p-4 rounded-[1.5rem] text-primary-dark hover:bg-primary/20 transition-all border border-slate-100 shadow-sm"
                          title="Open in Maps"
                        >
                          <Navigation size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                  <div className="col-span-full bg-white p-24 rounded-[3.5rem] text-center shadow-2xl shadow-black/5 border border-dashed border-slate-200">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                       <Truck className="text-slate-300" size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-primary-dark mb-2 tracking-tight">Waiting for Missions</h3>
                    <p className="text-slate-400 font-bold max-w-sm mx-auto">Once a Community Trust assigns you a delivery, your next mission will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="lg:col-span-1 space-y-10">
             <section className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-black/5 border border-slate-50 h-fit">
                <h3 className="text-xl font-black mb-8 text-primary-dark">Hero Profile</h3>
                <div className="flex items-center gap-5 mb-10">
                   <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-primary-dark font-black text-3xl shadow-lg shadow-primary/20">
                      {userData?.name ? userData.name.charAt(0) : 'V'}
                   </div>
                   <div>
                      <div className="text-2xl font-black text-primary-dark tracking-tight">{userData?.name || 'Volunteer'}</div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Elite Rescuer</div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                      <span className="font-bold text-slate-500 text-sm">Completed</span>
                      <span className="font-black text-primary-dark">{tasks.filter(t => t.status === 'delivered').length} Deliveries</span>
                   </div>
                   <div className="flex justify-between items-center bg-primary/20 p-6 rounded-[1.5rem] border border-primary/10">
                      <span className="font-bold text-primary-dark text-sm opacity-60">Impact Points</span>
                      <span className="font-black text-primary-dark">2,450 XP</span>
                   </div>
                </div>
             </section>

             <section className="bg-primary-dark p-10 rounded-[3rem] text-white overflow-hidden relative group hover:scale-[1.02] transition-transform duration-500 shadow-2xl shadow-black/20">
               <div className="relative z-10">
                 <h3 className="text-3xl font-black mb-6 leading-tight">Your Weekly <br />Impact</h3>
                 <p className="font-bold mb-8 text-white/60 leading-relaxed text-sm">You are in the top 5% of rescuers in your neighborhood this week!</p>
                 <button className="bg-primary text-primary-dark px-10 py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-primary/20 group-hover:px-12 transition-all duration-300">
                    Leaderboard
                 </button>
               </div>
               <Trophy className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-700" size={240} />
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
