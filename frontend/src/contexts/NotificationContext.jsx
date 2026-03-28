import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { Heart, Truck, CheckCircle, Bell } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const socket = useSocket();
  const { userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notif) => {
    const newNotif = {
      ...notif,
      id: Date.now(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20)); // Keep last 20
    setUnreadCount(prev => prev + 1);
  };

  useEffect(() => {
    if (!socket || !userData) return;

    // Donor notifications
    socket.on('donationAccepted', (data) => {
      addNotification({
        title: 'Donation Accepted!',
        message: `Your donation of ${data.foodName} was accepted by ${data.trustName}.`,
        icon: 'heart',
        type: 'success'
      });
    });

    // Volunteer notifications
    socket.on('taskAssigned', (data) => {
      addNotification({
        title: 'New Mission!',
        message: `You have been assigned to deliver ${data.foodName}.`,
        icon: 'truck',
        type: 'info'
      });
    });

    // Trust notifications
    socket.on('newDonation', (data) => {
      if (userData.role === 'trust') {
        addNotification({
          title: 'Donation Nearby!',
          message: `A new donation of ${data.foodName} is available in your region.`,
          icon: 'bell',
          type: 'info'
        });
      }
    });

    // Universal status updates
    socket.on('statusUpdated', (data) => {
      addNotification({
        title: 'Status Updated',
        message: `The mission for ${data.foodName} is now ${data.status}.`,
        icon: 'check',
        type: 'info'
      });
    });

    return () => {
      socket.off('donationAccepted');
      socket.off('taskAssigned');
      socket.off('newDonation');
      socket.off('statusUpdated');
    };
  }, [socket, userData]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
