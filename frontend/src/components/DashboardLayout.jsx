import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  Heart,
  Shield,
  Truck,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
  heart: <Heart size={16} className="text-primary" />,
  truck: <Truck size={16} className="text-blue-500" />,
  check: <CheckCircle size={16} className="text-primary" />,
  bell: <Bell size={16} className="text-amber-500" />
};

export default function DashboardLayout({ children, role }) {
  const { userData, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: `/${role}` },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const roleIcons = {
    donor: <Heart className="text-primary" size={24} />,
    trust: <Shield className="text-primary" size={24} />,
    volunteer: <Truck className="text-primary" size={24} />
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[1001] bg-primary-dark text-white p-4 rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[1000] w-72 bg-white border-r border-slate-100 shadow-2xl transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              {roleIcons[role] || <Heart className="text-primary-dark" size={24} />}
            </div>
            <h1 className="text-2xl font-black text-primary-dark">Donatly</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all
                    ${isActive 
                      ? 'bg-primary text-primary-dark shadow-lg shadow-primary/10' 
                      : 'text-slate-400 hover:text-primary-dark hover:bg-slate-50'}
                  `}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <footer className="mt-auto space-y-4">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-primary animate-pulse rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Ready</span>
              </div>
              <p className="text-xs font-bold text-slate-500">Live impact tracking active.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </footer>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth bg-surface">
        {/* Header */}
        <header className="sticky top-0 z-[500] bg-surface/80 backdrop-blur-md px-10 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="relative w-full md:w-[450px] group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-white border border-slate-100 pl-20 pr-8 py-5 rounded-full shadow-sm focus:ring-4 ring-primary/10 outline-none font-bold transition-all text-sm placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markAllAsRead();
                }}
                className={`
                  relative w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all border
                  ${isNotifOpen || unreadCount > 0 ? 'bg-primary/10 border-primary/20 text-primary-dark shadow-lg shadow-primary/5' : 'bg-white border-slate-50 text-slate-400 hover:text-primary-dark shadow-sm'}
                `}
              >
                 <Bell size={24} className={unreadCount > 0 ? 'animate-wiggle' : ''} />
                 {unreadCount > 0 && (
                   <span className="absolute top-4 right-4 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[7px] font-black text-white">
                     {unreadCount}
                   </span>
                 )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotifOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-6 w-96 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden z-[600]"
                    >
                      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-primary-dark">
                        <div>
                          <h3 className="font-black text-white text-lg">Notifications</h3>
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest">{unreadCount} New Messages</p>
                        </div>
                        <button 
                          onClick={clearNotifications}
                          className="p-3 bg-white/10 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Clear Library"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="max-h-[450px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="py-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Bell size={32} className="text-slate-200" />
                            </div>
                            <p className="text-sm font-black text-slate-400">Your mission log is empty.</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <motion.div 
                              layout
                              key={n.id} 
                              className={`p-5 rounded-3xl flex gap-5 transition-all border ${n.read ? 'bg-white border-slate-50' : 'bg-primary/5 border-primary/10 shadow-sm'}`}
                            >
                              <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm ${n.read ? 'bg-slate-50 text-slate-400' : 'bg-white text-primary'}`}>
                                {iconMap[n.icon] || <Bell size={18} />}
                              </div>
                              <div className="min-w-0">
                                <h4 className={`text-sm font-black mb-1 truncate ${n.read ? 'text-slate-600' : 'text-primary-dark'}`}>
                                  {n.title}
                                </h4>
                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-3">
                                  {n.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider">
                                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {!n.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                      
                      {notifications.length > 0 && (
                        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                          <button 
                             onClick={() => setIsNotifOpen(false)}
                             className="text-[10px] font-black text-primary-dark uppercase hover:text-primary transition-colors"
                          >
                             Close Activity Log
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-5 group cursor-pointer hover:opacity-80 transition-opacity pl-4 border-l border-slate-100">
               <div className="text-right hidden md:block">
                  <p className="text-lg font-black text-primary-dark leading-none mb-1">{userData?.name || 'User'}</p>
                  <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">{role}</p>
               </div>
               <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center p-0.5 border-2 border-primary/20 shadow-sm">
                  <div className="w-full h-full bg-primary/10 rounded-[1rem] flex items-center justify-center text-primary-dark font-black text-2xl uppercase">
                    {userData?.name?.charAt(0) || 'U'}
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="px-10 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
           {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
