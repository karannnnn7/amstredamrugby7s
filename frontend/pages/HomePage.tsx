
import React, { useState, useEffect } from 'react';
import { Trophy, ArrowRight, Play, Users, MapPin, Zap, Award, Star, Globe, TrendingUp, Newspaper, Instagram, ShieldCheck, Flame, Truck } from 'lucide-react';
import Button from '../frontend/components/Button';
import { Link } from 'react-router-dom';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 14, mins: 32, secs: 11 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => ({
        ...prev,
        secs: prev.secs > 0 ? prev.secs - 1 : 59,
        mins: prev.secs === 0 ? (prev.mins > 0 ? prev.mins - 1 : 59) : prev.mins
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex space-x-2 md:space-x-4 lg:space-x-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="text-center group">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white/5 border border-white/20 skew-x-[-10deg] flex items-center justify-center mb-2 group-hover:bg-rugbyRed group-hover:border-rugbyRed transition-all duration-300">
            <span className="text-xl sm:text-2xl md:text-5xl font-black skew-x-[10deg]">{String(value).padStart(2, '0')}</span>
          </div>
          <span className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{label}</span>
        </div>
      ))}
    </div>
  );
};

const HeroCarousel = () => {
  const heroActionImages = [
    '/assets/hero-scroll/scrum.jpg',
    '/assets/hero-scroll/dive.jpg',
    '/assets/hero-scroll/team.jpg',
    '/assets/hero-scroll/scrum.jpg',
    '/assets/hero-scroll/dive.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroActionImages.length);
    }, 2000); // 2 seconds per slide as requested
    return () => clearInterval(interval);
  }, [heroActionImages.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* This logic is tricky with simple CSS. Let's try a better approach below */}
      {/* Revised sliding implementation */}


      <div
        className="flex transition-transform duration-[1000ms] ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroActionImages.map((src, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={src}
              className="w-full h-full object-cover brightness-[0.6]"
              alt={`Hero ${index + 1}`}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-deepNavy/80 to-transparent mix-blend-multiply" />
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const news = [
    { title: "2025 Elite Pools Announced", date: "24 APR", category: "Tournament", img: "/assets/partners/T1.jpg" },
    { title: "New Headliner for Saturday Stage", date: "20 APR", category: "Festival", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600" },
    { title: "Early Bird Tickets Sold Out", date: "15 APR", category: "Tickets", img: "/assets/partners/T3.png" },
  ];

  const partners = [
    { name: 'NIKE', role: 'Technical Partner', img: '/assets/partners/partner1.png' },
    { name: 'HEINEKEN', role: 'Official Beverage', img: '/assets/partners/partner2.png' },
    { name: 'RED BULL', role: 'Energy Partner', img: '/assets/partners/partner3.png' },
    { name: 'DHL', role: 'Logistics Partner', img: '/assets/partners/partner4.png' },
    { name: 'GILBERT', role: 'Match Ball Supplier', img: '/assets/partners/partner5.png' },
    { name: 'VODAFONE', role: 'Connectivity Partner', img: '/assets/partners/partner6.png' },
  ];

  return (
    <div className="bg-deepNavy overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
        <HeroCarousel />

        {/* Main Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full flex-grow flex flex-col justify-center pt-32 pb-20">
          <div className="max-w-4xl drop-shadow-2xl">
            <div className="flex items-center space-x-2 text-rugbyRed font-black uppercase tracking-[0.3em] mb-4 animate-pulse">
              <Zap size={20} fill="currentColor" />
              <span>Amsterdam Rugby 7s 2025</span>
            </div>
            <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-8 transform -rotate-2">
              Bolder.<br />
              Faster.<br />
              <span className="text-rugbyRed">Wilder.</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-gray-100 max-w-2xl mb-12 leading-tight">
              Join 40,000 fans for the adrenaline-fueled intersection of elite international rugby and Europe's biggest pitch-side festival.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/tickets"><Button variant="primary" className="text-lg px-12">Buy Tickets Now</Button></Link>
              <Link to="/enter-team"><Button variant="outline" className="text-lg px-12">Enter Your Team</Button></Link>
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full pb-10">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
            <div className="order-2 md:order-1">
              <p className="font-black uppercase text-[10px] md:text-xs tracking-widest text-white/60 mb-3 drop-shadow-md">Countdown to Kickoff</p>
              <Countdown />
            </div>
            <div className="flex items-center space-x-6 order-1 md:order-2 drop-shadow-lg">
              <div className="flex flex-col items-center md:items-end">
                <span className="text-3xl md:text-4xl font-black italic text-white">MAY 16-18</span>
                <span className="text-xs md:text-sm font-black text-rugbyRed uppercase tracking-widest bg-black/40 px-2 py-0.5">Olympic Stadium Precinct, NL</span>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-white rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm hover:bg-white hover:text-deepNavy transition-all cursor-pointer group shadow-2xl">
                <Play fill="currentColor" size={24} className="ml-1 group-hover:scale-125 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - The Heritage */}
      <section className="py-32 bg-white text-deepNavy relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { val: "120+", label: "Elite Teams", icon: <Users size={40} className="text-rugbyRed" /> },
              { val: "40k", label: "Global Fans", icon: <Globe size={40} className="text-electricBlue" /> },
              { val: "50+", label: "DJs & Acts", icon: <Zap size={40} className="text-rugbyRed" /> },
              { val: "€25k", label: "Prize Pool", icon: <Trophy size={40} className="text-electricBlue" /> },
            ].map((stat, i) => (
              <div key={i} className="group cursor-default">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-7xl font-black italic tracking-tighter mb-2">{stat.val}</div>
                <div className="text-sm font-black uppercase tracking-widest text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Sponsors Section */}
      <section className="py-32 bg-deepNavy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
          <span className="text-[20rem] font-black italic -rotate-12 tracking-tighter whitespace-nowrap">GLOBAL PARTNERS</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="text-rugbyRed font-black uppercase tracking-[0.4em] mb-4 block">Powering the Game</span>
            <h2 className="text-5xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-[0.8] mb-8">
              Official <span className="text-white/40">Sponsors</span>
            </h2>
          </div>

          <div className="mask-gradient-to-r from-transparent via-black to-transparent overflow-hidden">
            <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] w-max">
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={i}
                  className="inline-block w-64 mx-4 group relative bg-white/5 border border-white/10 p-8 skew-x-[-10deg] transition-all duration-500 cursor-default aspect-square"
                >
                  <div className="skew-x-[10deg] flex flex-col items-center text-center w-full h-full justify-center">
                    <div className="mb-4 w-full flex items-center justify-center group-hover:scale-110 transition-all duration-500 h-20">
                      <img
                        src={partner.img}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain transition-all duration-500"
                      />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-tighter text-white mb-1 whitespace-normal">{partner.name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-opacity whitespace-normal">
                      {partner.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Secondary Sponsors */}
          <div className="mt-24 py-10 border-y border-white/10 overflow-hidden relative">
            <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="flex items-center space-x-16 px-8">
                  <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">GATORADE</span>
                  <div className="w-2 h-2 bg-rugbyRed rotate-45" />
                  <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">MONSTER ENERGY</span>
                  <div className="w-2 h-2 bg-rugbyRed rotate-45" />
                  <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">CANTERBURY</span>
                  <div className="w-2 h-2 bg-rugbyRed rotate-45" />
                  <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">EMIRATES</span>
                  <div className="w-2 h-2 bg-rugbyRed rotate-45" />
                  <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">TICKETMASTER</span>
                  <div className="w-2 h-2 bg-rugbyRed rotate-45" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* Latest News Grid */}
      <section className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-rugbyRed font-black uppercase tracking-[0.4em] mb-4 block">Official Feed</span>
              <h2 className="text-5xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-[0.8]">
                Broadcast <span className="text-white/20">News</span>
              </h2>
            </div>
            <Link to="/contact" className="flex items-center space-x-2 text-rugbyRed font-black uppercase tracking-widest group">
              <span>View All Updates</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item, i) => (
              <div key={i} className="group bg-white/5 border border-white/10 hover:border-rugbyRed transition-all duration-500 overflow-hidden cursor-pointer">
                <div className="relative h-64 overflow-hidden bg-deepNavy flex items-center justify-center">
                  <img src={item.img} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                  <div className="absolute top-4 left-4 bg-rugbyRed px-3 py-1 text-[10px] font-black uppercase tracking-widest z-10">{item.category}</div>
                </div>
                <div className="p-8">
                  <div className="text-rugbyRed font-black text-sm mb-2">{item.date}</div>
                  <h3 className="text-2xl font-black uppercase italic leading-tight mb-4 group-hover:text-rugbyRed transition-colors">{item.title}</h3>
                  <div className="w-12 h-1 bg-white/20 group-hover:w-full group-hover:bg-rugbyRed transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Pulse */}
      <section className="py-32 bg-deepNavy border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <Instagram size={48} className="mx-auto text-rugbyRed mb-6" />
            <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-4">#AMSTERDAM7S</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest">Share your journey with the world</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              "/assets/partners/S1.jpg",
              "/assets/partners/S2.jpg",
              "/assets/partners/S3.jpg",
              "/assets/partners/S4.jpg",
              "/assets/partners/S5.jpg",
              "/assets/partners/S6.jpg",
            ].map((src, i) => (
              <div key={i} className="aspect-square overflow-hidden group bg-black flex items-center justify-center">
                <img src={src} className="w-full h-full object-contain group-hover:scale-110 transition-all duration-700" alt="Social post" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Section - Expanded Content */}
      <section className="py-32 bg-deepNavy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-rugbyRed/5 skew-x-[-15deg] transform translate-x-32" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800" className="w-full h-80 object-cover skew-y-[-2deg] shadow-2xl" alt="Festival action" />
                <div className="bg-rugbyRed p-8 shadow-xl">
                  <h4 className="text-4xl font-black italic uppercase leading-none">NO<br />LIMITS</h4>
                </div>
              </div>
              <div className="space-y-4 pt-16">
                <img src="/assets/partners/music-stage.jpg" className="w-full h-96 object-cover skew-y-[2deg] shadow-2xl" alt="Music stage" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2">
            <span className="text-electricBlue font-black uppercase tracking-[0.3em] mb-4 block">More than just a game</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-10">
              The Rugby <span className="text-rugbyRed italic">Festival</span>
            </h2>
            <div className="space-y-8 text-xl text-gray-300 leading-relaxed font-bold">
              <p>Step away from the pitch and enter a world of immersive music, artisanal street food, and interactive fan experiences.</p>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: <Zap className="text-rugbyRed" />, title: "3 Main Stages", text: "From deep house to rock highlights." },
                  { icon: <TrendingUp className="text-rugbyRed" />, title: "Fan Village", text: "Gaming zones and skill challenges." },
                  { icon: <Award className="text-rugbyRed" />, title: "Street Market", text: "25+ Food vendors from the EU." },
                  { icon: <Star className="text-rugbyRed" />, title: "VIP Lounges", text: "Heated decks and open bars." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2 text-rugbyRed font-black uppercase text-sm italic">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12">
              <Link to="/visitors"><Button variant="secondary" className="px-10 py-5">Explore the Full Experience</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
