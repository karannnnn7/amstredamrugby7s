
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Trophy, Ticket, Users, Info, Calendar, Camera,
  Heart, Mail, TreeDeciduous, MapPin, Facebook, Instagram, Twitter,
  Zap, Star, Flame, Truck, Globe, Award, RefreshCw
} from 'lucide-react';
import HomePage from './pages/HomePage';
import TicketsPage from './pages/TicketsPage';
import EnterTeamPage from './pages/EnterTeamPage';
import TeamsPage from './pages/TeamsPage';
import VisitorsPage from './pages/VisitorsPage';
import RulesPage from './pages/RulesPage';
import SustainabilityPage from './pages/SustainabilityPage';
import RecyclePage from './pages/RecyclePage';
import PhotosPage from './pages/PhotosPage';
import CharityPage from './pages/CharityPage';
import ContactPage from './pages/ContactPage';
import BackToTop from './components/BackToTop';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Info size={18} /> },
    { name: 'Tickets', path: '/tickets', icon: <Ticket size={18} /> },
    { name: 'Enter Team', path: '/enter-team', icon: <Trophy size={18} /> },
    { name: 'Teams', path: '/teams', icon: <Users size={18} /> },
    { name: 'Visitors', path: '/visitors', icon: <MapPin size={18} /> },
    { name: 'Rules', path: '/rules', icon: <Calendar size={18} /> },
    {
      name: 'More', path: '#', sub: [
        { name: 'Recycle System', path: '/recycle', icon: <RefreshCw size={16} /> },
        { name: 'Sustainability', path: '/sustainability', icon: <TreeDeciduous size={16} /> },
        { name: 'Photos', path: '/photos', icon: <Camera size={16} /> },
        { name: 'Charity', path: '/charity', icon: <Heart size={16} /> },
        { name: 'Contact', path: '/contact', icon: <Mail size={16} /> },
      ]
    },
  ];

  return (
    <nav className="fixed w-full z-50 bg-deepNavy/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-28">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logo.png" alt="Amsterdam Rugby 7s Logo" className="h-20 w-auto object-contain skew-x-[-12deg]" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.sub ? (
                <div key={link.name} className="relative group">
                  <button className="text-sm font-bold uppercase tracking-wider hover:text-rugbyRed transition-colors">
                    {link.name}
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-deepNavy border border-white/10 rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {link.sub.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="block px-4 py-3 text-xs font-bold uppercase hover:bg-rugbyRed transition-colors border-b border-white/5 last:border-0"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors ${location.pathname === link.path ? 'text-rugbyRed' : 'hover:text-rugbyRed'
                    }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <Link to="/tickets" className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-black uppercase tracking-widest skew-x-[-12deg] transition-all hover:scale-105 active:scale-95">
              <span className="block skew-x-[12deg]">Buy Tickets</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-deepNavy border-t border-white/10 p-4 space-y-4 h-screen overflow-y-auto">
          {navLinks.map((link) => (
            link.sub ? (
              <div key={link.name} className="space-y-2">
                <p className="text-xs font-black text-white/40 uppercase pl-2">{link.name}</p>
                {link.sub.map((sub) => (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 font-bold uppercase hover:bg-white/5 rounded"
                  >
                    {sub.icon}
                    <span>{sub.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 p-3 font-bold uppercase hover:bg-white/5 rounded"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            )
          ))}
          <Link to="/tickets" onClick={() => setIsOpen(false)} className="block w-full text-center bg-rugbyRed p-4 font-black uppercase tracking-widest">
            Buy Tickets
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const sponsors = [
    { name: 'NIKE', img: '/assets/partners/partner1.png' },
    { name: 'HEINEKEN', img: '/assets/partners/partner2.png' },
    { name: 'RED BULL', img: '/assets/partners/partner3.png' },
    { name: 'DHL', img: '/assets/partners/partner4.png' },
    { name: 'GILBERT', img: '/assets/partners/partner5.png' },
    { name: 'VODAFONE', img: '/assets/partners/partner6.png' },
  ];

  return (
    <footer className="bg-black text-white pt-20 pb-10 overflow-hidden relative border-t-4 border-rugbyRed">
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
        <h2 className="text-[15rem] font-black leading-none select-none tracking-tighter transform rotate-12 -translate-y-20">RUGBY</h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-500">Official Tournament Partners</h3>
            <div className="h-px bg-white/10 flex-grow mx-8 hidden md:block"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 skew-x-[-10deg] group transition-all duration-300"
              >
                <div className="skew-x-[10deg] flex flex-col items-center gap-3 w-full">
                  <div className="group-hover:scale-110 transition-transform duration-300 h-20 flex items-center justify-center">
                    <img
                      src={sponsor.img}
                      alt={sponsor.name}
                      className="max-h-full w-auto object-contain transition-all duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-black tracking-tighter italic transition-opacity">
                    {sponsor.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/assets/logo.png" alt="Amsterdam Rugby 7s Logo" className="h-30 w-auto object-contain skew-x-[-12deg]" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The premier European rugby 7s festival. Join us in Amsterdam for 3 days of elite rugby and world-class entertainment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-rugbyRed hover:scale-110 active:scale-95 transition-all duration-300 border border-white/5">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-electricBlue hover:scale-110 active:scale-95 transition-all duration-300 border border-white/5">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all duration-300 border border-white/5">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-black uppercase mb-6 tracking-wider">Tournament</h4>
            <ul className="space-y-3 text-sm font-bold text-gray-400 uppercase">
              <li><Link to="/enter-team" className="hover:text-white">Men's Elite</Link></li>
              <li><Link to="/enter-team" className="hover:text-white">Women's Elite</Link></li>
              <li><Link to="/enter-team" className="hover:text-white">Social 7s</Link></li>
              <li><Link to="/enter-team" className="hover:text-white">Veterans 10s</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black uppercase mb-6 tracking-wider">Join Us</h4>
            <ul className="space-y-3 text-sm font-bold text-gray-400 uppercase">
              <li><Link to="/tickets" className="hover:text-white">Buy Tickets</Link></li>
              <li><Link to="/visitors" className="hover:text-white">Venue Info</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/photos" className="hover:text-white">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black uppercase mb-6 tracking-wider">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Stay updated with the latest news and early bird ticket releases.</p>
            <form className="flex">
              <input type="email" placeholder="YOUR EMAIL" className="bg-white/5 border border-white/10 px-4 py-3 flex-grow focus:outline-none focus:border-rugbyRed transition-colors" />
              <button className="bg-rugbyRed px-4 py-3 font-bold uppercase transition-colors hover:bg-red-700">Go</button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center text-xs text-gray-500 uppercase tracking-widest font-bold">
          <p>© 2025 AMSTERDAM RUGBY 7S. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/enter-team" element={<EnterTeamPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/visitors" element={<VisitorsPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />
            <Route path="/recycle" element={<RecyclePage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/charity" element={<CharityPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </HashRouter>
  );
};

export default App;
