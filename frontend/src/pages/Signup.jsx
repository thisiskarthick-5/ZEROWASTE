import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { Heart } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('donor');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name, role, address, location);
      navigate('/');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-20 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl shadow-black/5 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Form */}
        <div className="flex-1 p-10 lg:p-16">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-primary-dark mb-4">Create Account</h2>
            <p className="text-slate-500 font-medium">Join our community of compassionate donors.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3">
               <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
               {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Choose Your Role</label>
              <div className="flex gap-4 p-1 bg-surface rounded-2xl">
                {['donor', 'trust', 'volunteer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-3 px-4 rounded-xl capitalize font-black transition-all ${role === r ? 'bg-white text-primary-dark shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-4">Residential/Office Address</label>
              <textarea 
                placeholder="Enter your full address" 
                className="w-full bg-surface border-none p-4 rounded-2xl focus:ring-4 ring-primary/20 outline-none font-bold transition-all h-32"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-dark py-4 text-lg shadow-xl shadow-primary-dark/20 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account? <Link to="/login" className="text-primary-dark font-black hover:underline underline-offset-4">Login here</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="lg:w-[45%] bg-primary p-10 lg:p-16 flex flex-col">
          <div className="mb-10 text-primary-dark">
            <h3 className="text-2xl font-black mb-2">Pin Your Location</h3>
            <p className="font-medium opacity-80 text-sm">Help us connect you with nearby needs by selecting your location on the map.</p>
          </div>
          <div className="flex-1 min-h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/20">
            <MapComponent 
              center={location} 
              markers={[{ position: location, title: 'Your Location' }]}
              onMapClick={setLocation}
              onAddressFound={setAddress}
              selectable={true}
              showSearch={true}
            />
          </div>
          <div className="mt-10 flex items-center gap-4 bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <div className="bg-white p-2 rounded-full text-primary">
               <Heart fill="currentColor" size={20} />
            </div>
            <p className="text-primary-dark font-bold text-sm">Join 8,000+ donors today!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
