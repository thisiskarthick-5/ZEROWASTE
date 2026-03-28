import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Bell, X, Heart, Truck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  heart: <Heart size={20} className="text-primary" />,
  truck: <Truck size={20} className="text-blue-500" />,
  check: <CheckCircle size={20} className="text-primary" />,
  bell: <Bell size={20} className="text-amber-500" />
};

export default function NotificationToast() {
  const { notifications } = useNotifications();
  const [activeToasts, setActiveToasts] = useState([]);

  // When a new unread notification arrives, show a toast
  useEffect(() => {
    const latestNotif = notifications[0];
    if (latestNotif && !latestNotif.read) {
      // Avoid duplicates if re-rendered
      if (!activeToasts.find(t => t.id === latestNotif.id)) {
        setActiveToasts(prev => [...prev, latestNotif]);
        setTimeout(() => {
          setActiveToasts(prev => prev.filter(t => t.id !== latestNotif.id));
        }, 5000);
      }
    }
  }, [notifications]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 max-w-sm w-full">
      <AnimatePresence>
        {activeToasts.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] shadow-2xl shadow-black/10 flex gap-4 items-start relative overflow-hidden group mb-4"
          >
            <div className={`p-3 rounded-2xl ${n.type === 'success' ? 'bg-primary/20' : 'bg-blue-50'}`}>
              {iconMap[n.icon] || <Bell size={20} />}
            </div>
            <div className="flex-1 pr-6">
              <h4 className="font-black text-primary-dark text-sm mb-1">{n.title}</h4>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">{n.message}</p>
            </div>
            <button 
              onClick={() => setActiveToasts(prev => prev.filter(notif => notif.id !== n.id))}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-0 left-0 h-1 bg-primary animate-progress-shrink" style={{ width: '100%' }}></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
