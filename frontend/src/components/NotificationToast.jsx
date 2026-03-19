import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { Bell, X, Heart, Truck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationToast() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const addNotification = (notif) => {
      const id = Date.now();
      setNotifications(prev => [...prev, { ...notif, id }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    socket.on('donationAccepted', (data) => {
      addNotification({
        title: 'Donation Accepted!',
        message: `Your donation of ${data.foodName} was accepted by ${data.trustName}.`,
        icon: <Heart size={20} className="text-primary" />,
        type: 'success'
      });
    });

    socket.on('taskAssigned', (data) => {
      addNotification({
        title: 'New Mission Assigned!',
        message: `You have been assigned to deliver ${data.foodName}.`,
        icon: <Truck size={20} className="text-blue-500" />,
        type: 'info'
      });
    });

    socket.on('statusUpdated', (data) => {
      addNotification({
        title: 'Delivery Status Update',
        message: `The delivery for ${data.foodName} is now ${data.status}.`,
        icon: <CheckCircle size={20} className="text-primary" />,
        type: 'info'
      });
    });

    socket.on('newDonation', (data) => {
        // This might be too noisy for everyone, but let's keep it for now
        // or filter by role in a real app.
    });

    return () => {
      socket.off('donationAccepted');
      socket.off('taskAssigned');
      socket.off('statusUpdated');
      socket.off('newDonation');
    };
  }, [socket]);

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white/80 backdrop-blur-xl border border-white/20 p-5 rounded-[2rem] shadow-2xl shadow-black/10 flex gap-4 items-start relative overflow-hidden group"
          >
            <div className={`p-3 rounded-2xl ${n.type === 'success' ? 'bg-primary/20' : 'bg-blue-50'}`}>
              {n.icon}
            </div>
            <div className="flex-1 pr-6">
              <h4 className="font-black text-primary-dark text-sm mb-1">{n.title}</h4>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">{n.message}</p>
            </div>
            <button 
              onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
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
