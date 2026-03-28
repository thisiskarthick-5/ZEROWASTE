import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { Bell, Shield, Eye, Smartphone, LogOut, ArrowLeft } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, description, toggle }) => (
  <div className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all group">
    <div className="flex items-center gap-6">
      <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-primary/10 transition-colors">
        <Icon className="text-slate-400 group-hover:text-primary" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-black text-primary-dark mb-1">{title}</h3>
        <p className="text-sm font-bold text-slate-400">{description}</p>
      </div>
    </div>
    <div className="relative inline-block w-14 h-8">
      <input type="checkbox" className="sr-only peer" defaultChecked={toggle} />
      <div className="w-full h-full bg-slate-200 peer-checked:bg-primary rounded-full transition-colors cursor-pointer"></div>
      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
    </div>
  </div>
);

export default function Settings() {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout role={userData?.role}>
      <div className="max-w-4xl mx-auto space-y-12 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Account Settings</h1>
            <p className="text-slate-400 font-bold">Customize your app experience and security.</p>
          </div>
          <button 
            onClick={() => navigate(`/${userData?.role}`)}
            className="flex items-center gap-3 text-slate-400 font-bold hover:text-primary transition-colors bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-50"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </header>

        <div className="space-y-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 ml-8 mb-4">Notifications</h2>
          <SettingItem 
            icon={Bell} 
            title="Push Notifications" 
            description="Get notified about new donations and mission updates."
            toggle={true}
          />
          <SettingItem 
            icon={Smartphone} 
            title="SMS Alerts" 
            description="Receive critical rescue missions via text message."
            toggle={false}
          />

          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 ml-8 mb-4 mt-12">Privacy & Security</h2>
          <SettingItem 
            icon={Shield} 
            title="Location Visibility" 
            description="Control who can see your exact coordinates on the map."
            toggle={true}
          />
          <SettingItem 
            icon={Eye} 
            title="Activity Status" 
            description="Show when you are active and ready for missions."
            toggle={true}
          />

          <div className="mt-12 pt-12 border-t border-slate-100 flex justify-center">
            <button 
              onClick={logout}
              className="flex items-center gap-4 text-red-400 font-bold hover:bg-red-50 px-10 py-5 rounded-2xl transition-all"
            >
              <LogOut size={20} />
              Session Logout
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
