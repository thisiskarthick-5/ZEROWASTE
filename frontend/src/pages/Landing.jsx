import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, GraduationCap, Stethoscope, ChevronRight, Play, CheckCircle2, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const stats = [
    { label: 'Donors Worldwide', value: '8,000+' },
    { label: 'Impact Created', value: '421,530+' },
    { label: 'Communities Fed', value: '500+' }
  ];

  const categories = [
    { 
      title: 'Feeding Communities', 
      desc: "We've provided thousands of nutritious meals to children and families facing hunger, ensuring no one goes to bed hungry.",
      icon: <Heart className="text-primary" size={24} />,
      link: '#'
    },
    { 
      title: 'Health & Hygiene', 
      desc: "By distributing hygiene kits and supporting medical programs, we've improved health and prevented disease in underserved areas.",
      icon: <Stethoscope className="text-primary" size={24} />,
      link: '#'
    },
    { 
      title: 'Sustainable Livelihoods', 
      desc: "We help families build income through small businesses and farming initiatives, creating long-term independence.",
      icon: <Shield className="text-primary" size={24} />,
      link: '#'
    },
    { 
      title: 'Education & Learning', 
      desc: "We support children's access to quality education, providing schools with resources and scholarships for brighter futures.",
      icon: <GraduationCap className="text-primary" size={24} />,
      link: '#'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary pt-20 pb-32 px-6 rounded-b-[4rem] overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-8"
          >
            <span className="bg-white px-2 py-0.5 rounded-full text-black text-xs font-bold uppercase">New</span>
            Join thousands of donors making a difference
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-primary-dark mb-8 leading-[1.1]"
          >
            Small Acts of Kindness <br />
            Create <span className="text-white">Big Change</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-dark/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium"
          >
            Join thousands of donors worldwide who are making a difference every day. Your contribution brings hope, food, and shelter to those in need.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup" className="btn-dark px-10 py-4 text-lg">
              Donate now
            </Link>
            <button className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-10 py-4 rounded-full font-bold transition-all backdrop-blur-md">
              <div className="bg-white text-primary rounded-full p-2">
                <Play fill="currentColor" size={16} />
              </div>
              Watch Story
            </button>
          </motion.div>
        </div>

        {/* Decorative Image Overlap */}
        <div className="mt-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="donatly-card bg-primary-dark text-white flex flex-col justify-end min-h-[400px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img src="/assets/hero.png" alt="Join Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-20">
              <div className="bg-primary text-black inline-block px-3 py-1 rounded-lg text-xs font-bold mb-4">Join Community</div>
              <h3 className="text-4xl font-black leading-none">Join 8000+ <br />People Donate</h3>
            </div>
          </div>
          
          <div className="donatly-card bg-surface flex flex-col justify-end p-0 overflow-hidden min-h-[400px]">
             <img src="/assets/impact.png" alt="Giving" className="w-full h-full object-cover" />
          </div>

          <div className="donatly-card bg-primary-dark text-white flex flex-col justify-end min-h-[400px] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
            <img src="/assets/hero.png" alt="Volunteer" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="relative z-20">
              <h3 className="text-4xl font-black leading-tight mb-4">Extend a Hand, <br />Change a Life</h3>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl transition-all">
                Explore More <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-5xl font-black text-primary-dark mb-6 leading-tight">
              Compassion Turns <br /> Struggles Into Strength
            </h2>
            <p className="text-slate-500 text-lg mb-8 max-w-lg font-medium">
              Every day, countless families face hunger, lack of clean water, and no safe shelter. With your support, we turn their struggles into stories of resilience and hope.
            </p>
            <button className="bg-primary px-8 py-3 rounded-xl font-bold text-black border-2 border-primary hover:bg-transparent transition-all">
              Learn More
            </button>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="donatly-card group hover:bg-primary transition-colors duration-500">
               <div className="bg-primary-dark group-hover:bg-white text-white group-hover:text-primary-dark w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  <Heart size={24} />
               </div>
               <h4 className="text-xl font-bold mb-3">Feed the Hungry</h4>
               <p className="text-slate-500 group-hover:text-primary-dark/80">Your donation provides daily meals to children and families, ensuring no one goes to bed hungry.</p>
            </div>
            <div className="donatly-card group hover:bg-primary transition-colors duration-500">
               <div className="bg-primary-dark group-hover:bg-white text-white group-hover:text-primary-dark w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                  <GraduationCap size={24} />
               </div>
               <h4 className="text-xl font-bold mb-3">Education Support</h4>
               <p className="text-slate-500 group-hover:text-primary-dark/80">Help children attend school and continue their studies by providing books, tuition fees, and learning resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="bg-primary py-24 px-6 rounded-[4rem]">
        <div className="max-w-7xl mx-auto text-center">
           <h3 className="text-2xl font-bold text-primary-dark mb-4">Together, We Build Hope and Create Impact.</h3>
           <p className="text-primary-dark/70 mb-12 max-w-xl mx-auto">Every act of kindness has the power to change lives, bring dignity, and shape a brighter tomorrow.</p>
           <div className="text-8xl md:text-9xl font-black text-primary-dark mb-12 tracking-tighter">421,530+</div>
           <button className="bg-primary-dark text-white px-10 py-4 rounded-full font-bold hover:bg-primary-dark/90 transition-all">
              Join Us Today →
           </button>
           <p className="text-primary-dark/50 mt-6 text-sm font-medium">Compassionate hearts already making a difference</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-primary-dark mb-6">Building Brighter Futures for All</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">For years, we've worked hand in hand with communities to bring hope, opportunity, and dignity. Here are some of the ways your support has made an impact.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <div className="bg-surface w-16 h-16 rounded-3xl flex items-center justify-center mb-6">
                  {cat.icon}
                </div>
                <h4 className="text-2xl font-bold text-primary-dark">{cat.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{cat.desc}</p>
                <Link to={cat.link} className="inline-block text-primary-dark font-black underline underline-offset-4 hover:text-primary transition-colors">
                  Read More...
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
             <button className="bg-primary px-10 py-4 rounded-full font-black text-primary-dark hover:bg-primary-dark hover:text-white transition-all">
                Explore All Feature
             </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-surface rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-16">
              <h2 className="text-5xl font-black text-primary-dark leading-tight">
                Your Support Creates <br /> Real Stories of Change
              </h2>
              <div className="flex gap-4">
                 <button className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white transition-all">
                    <ChevronRight className="rotate-180" size={20} />
                 </button>
                 <button className="w-12 h-12 rounded-full bg-primary-dark text-white flex items-center justify-center hover:bg-primary transition-all">
                    <ChevronRight size={20} />
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-primary-dark donatly-card text-white relative h-[500px] flex flex-col justify-between">
                 <div className="text-primary text-6xl font-serif">“</div>
                 <p className="text-xl font-medium leading-relaxed opacity-90">
                    "Donating here feels truly different. I can actually see where my contribution goes and how it touches lives. Knowing that even a small part of my income can provide food, medicine, or education for those in need gives me so much purpose."
                 </p>
                 <div className="flex items-center gap-4 mt-8">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                       <UserCircle2 size={32} />
                    </div>
                    <div>
                       <div className="font-bold">Amina Rahel</div>
                       <div className="text-sm opacity-60">Manager</div>
                    </div>
                 </div>
              </div>

              <div className="donatly-card p-0 overflow-hidden relative group h-[500px]">
                 <img src="/assets/impact.png" alt="Jhonathan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black p-4 rounded-full cursor-pointer hover:scale-110 transition-all">
                    <Play fill="currentColor" size={24} />
                 </div>
                 <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl flex items-center justify-between">
                       <div>
                          <div className="font-bold text-black">Jhonatan</div>
                          <div className="text-sm text-slate-500">Donor</div>
                       </div>
                       <UserCircle2 className="text-slate-300" size={32} />
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50 donatly-card relative h-[500px] flex flex-col justify-between border-none">
                 <div className="text-primary-dark text-6xl font-serif">”</div>
                 <p className="text-xl font-medium leading-relaxed text-slate-700 italic">
                    "I never thought that a few clicks online could mean food and shelter for a struggling family. This platform makes giving so simple, transparent, and meaningful. Every update reminds me that my donation is not just money; it's a lifeline."
                 </p>
                 <div className="flex items-center gap-4 mt-8">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                       <UserCircle2 className="text-primary" size={32} />
                    </div>
                    <div>
                       <div className="font-bold text-primary-dark">David Rodrigo</div>
                       <div className="text-sm text-slate-500">Manager</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-3xl font-black text-primary mb-6">
              <Heart className="fill-primary" />
              <span>Donatly</span>
            </Link>
            <p className="text-white/60 text-lg max-w-sm font-medium">
              We are on a mission to connect compassinate hearts with communities in need. Together, we can build a world where no one is left behind.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-6">Resources</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><Link to="#" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Our Impact</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xl mb-6">Contact</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li>support@donatly.org</li>
              <li>+1 (555) 000-1111</li>
              <li>123 Hope Lane, Unity City</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/10 text-center text-white/30 text-sm font-medium">
          © 2026 Donatly Organization. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
