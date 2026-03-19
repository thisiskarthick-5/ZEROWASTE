import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Heart, User, Menu } from 'lucide-react';

export default function Navbar() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out", err);
    }
  }

  return (
    <nav className={`sticky top-0 z-[100] px-6 py-4 flex justify-between items-center transition-all ${isLanding ? 'bg-primary' : 'bg-white border-b border-slate-100'}`}>
      <Link to="/" className="flex items-center gap-2 text-2xl font-black text-primary-dark">
        <Heart className="fill-primary-dark" size={32} />
        <span>Donatly</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 font-bold text-sm">
        <Link to="/" className="hover:opacity-60 transition-opacity">Home</Link>
        <Link to="#" className="hover:opacity-60 transition-opacity">Features</Link>
        <Link to="#" className="hover:opacity-60 transition-opacity">Package</Link>
        <Link to="#" className="hover:opacity-60 transition-opacity">Partnership</Link>
        <Link to="#" className="hover:opacity-60 transition-opacity">FAQ</Link>
      </div>

      <div className="flex items-center gap-4">
        {userData ? (
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-black/5">
             <div className="flex flex-col items-end leading-none">
                <span className="text-sm font-bold">{userData.name}</span>
                <span className="text-[10px] uppercase font-black opacity-60 tracking-tighter">{userData.role}</span>
             </div>
             <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-black/10 rounded-full transition-all"
             >
                <LogOut size={18} />
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-6 py-2.5 font-bold hover:bg-black/5 rounded-full transition-all">Login</Link>
            <Link to="/signup" className="btn-dark !py-2.5 !px-6 shadow-xl shadow-primary-dark/20 text-sm">
              Get started
            </Link>
          </div>
        )}
        <button className="md:hidden p-2">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
