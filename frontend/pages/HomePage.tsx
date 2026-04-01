
import React, { useState, useEffect } from 'react';
import { Trophy, ArrowRight, Play, Users, MapPin, Zap, Award, Star, Globe, TrendingUp, Newspaper, Instagram, ShieldCheck, Flame, Truck } from 'lucide-react';
import Loader from "../components/Loader";
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useConfig } from '../context/ConfigContext';

import { Image, NewsItem, Sponsor } from '../types';

const Countdown = ({ targetDateStr }: { targetDateStr?: string }) => {
  const [targetDate, setTargetDate] = useState<Date>(new Date('2025-05-16T09:00:00'));
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (targetDateStr) {
      try {
        // Extract start date (e.g., "March 13" from "March 13-14")
        const startDatePart = targetDateStr.split('-')[0].trim();
        // Append current year if not present (simple heuristic)
        const currentYear = new Date().getFullYear();
        let parsedDate = new Date(`${startDatePart}, ${currentYear} 09:00:00`);

        // If invalid, fallback
        if (isNaN(parsedDate.getTime())) {
          // Try fetching explicit config as backup
          api.get('/config/countdown_target').then(r => {
            if (r.data?.value) setTargetDate(new Date(r.data.value));
          }).catch(() => { });
        } else {
          setTargetDate(parsedDate);
        }
      } catch (e) { console.error("Date parse error", e); }
    } else {
      // Default fetch if no prop provided (legacy behavior)
      api.get('/config/countdown_target').then(r => {
        if (r.data?.value) setTargetDate(new Date(r.data.value));
      }).catch(() => { });
    }
  }, [targetDateStr]);

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

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
  const [heroActionImages, setHeroActionImages] = useState([
    '/assets/hero-scroll/scrum.webp',
    '/assets/hero-scroll/dive.webp',
    '/assets/hero-scroll/team.webp',
    '/assets/hero-scroll/scrum.webp',
    '/assets/hero-scroll/dive.webp',
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get('/images?type=slider').then(r => {
      if (r.data?.length) setHeroActionImages(r.data.map((i: Image) => i.img));
    }).catch(() => { });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroActionImages.length);
    }, 2000); // 2 seconds per slide as requested
    return () => clearInterval(interval);
  }, [heroActionImages.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
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

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={40} className="text-rugbyRed" />,
  Globe: <Globe size={40} className="text-electricBlue" />,
  Zap: <Zap size={40} className="text-rugbyRed" />,
  Trophy: <Trophy size={40} className="text-electricBlue" />,
  Star: <Star size={40} className="text-rugbyRed" />,
  Award: <Award size={40} className="text-rugbyRed" />,
  TrendingUp: <TrendingUp size={40} className="text-rugbyRed" />
};

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { getBtnText, getBtnLink } = useConfig();
  const [news, setNews] = useState<NewsItem[]>([
    { _id: '1', title: "2025 Elite Pools Announced", date: "24 APR", category: "Tournament", excerpt: "", img: "/assets/partners/T1.webp" },
    { _id: '2', title: "New Headliner for Saturday Stage", date: "20 APR", category: "Festival", excerpt: "", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600" },
    { _id: '3', title: "Early Bird Tickets Sold Out", date: "15 APR", category: "Tickets", excerpt: "", img: "/assets/partners/T3.webp" },
  ]);

  const [officialSponsors, setOfficialSponsors] = useState<Sponsor[]>([
    { _id: '1', type: 'official-sponsors', name: 'NIKE', subName: 'Technical Partner', img: '/assets/partners/partner1.webp' },
    { _id: '2', type: 'official-sponsors', name: 'HEINEKEN', subName: 'Official Beverage', img: '/assets/partners/partner2.webp' },
    { _id: '3', type: 'official-sponsors', name: 'RED BULL', subName: 'Energy Partner', img: '/assets/partners/partner3.webp' },
    { _id: '4', type: 'official-sponsors', name: 'DHL', subName: 'Logistics Partner', img: '/assets/partners/partner4.webp' },
    { _id: '5', type: 'official-sponsors', name: 'GILBERT', subName: 'Match Ball Supplier', img: '/assets/partners/partner5.webp' },
    { _id: '6', type: 'official-sponsors', name: 'VODAFONE', subName: 'Connectivity Partner', img: '/assets/partners/partner6.webp' },
  ]);

  const [subSponsors, setSubSponsors] = useState<Sponsor[]>([
    { _id: 's1', type: 'sub-sponsors', name: 'GATORADE' }, { _id: 's2', type: 'sub-sponsors', name: 'MONSTER ENERGY' }, { _id: 's3', type: 'sub-sponsors', name: 'CANTERBURY' }, { _id: 's4', type: 'sub-sponsors', name: 'EMIRATES' }, { _id: 's5', type: 'sub-sponsors', name: 'TICKETMASTER' },
  ]);

  const [stats, setStats] = useState([
    { id: 'stat-elite-teams', val: "120", suffix: "+", label: "Elite Teams", icon: "Users" },
    { id: 'stat-global-fans', val: "40", suffix: "k", label: "Global Fans", icon: "Globe" },
    { id: 'stat-djs-acts', val: "50", suffix: "+", label: "DJs & Acts", icon: "Zap" },
    { id: 'stat-prize-pool', val: "25", prefix: "€", suffix: "k", label: "Prize Pool", icon: "Trophy" },
  ]);

  const [socialImages, setSocialImages] = useState([
    "/assets/partners/S1.webp",
    "/assets/partners/S2.webp",
    "/assets/partners/S3.webp",
    "/assets/partners/S4.webp",
    "/assets/partners/S5.webp",
    "/assets/partners/S6.webp",
  ]);

  const [festivalImg1, setFestivalImg1] = useState("https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800");
  const [festivalImg2, setFestivalImg2] = useState("/assets/partners/music-stage.webp");
  const [festivalDesc, setFestivalDesc] = useState("Step away from the pitch and enter a world of immersive music, artisanal street food, and interactive fan experiences.");
  const [festivalFeatures, setFestivalFeatures] = useState([
    { id: 'festival-stages', icon: <Zap className="text-rugbyRed" />, title: "3 Main Stages", text: "From deep house to rock highlights." },
    { id: 'festival-village', icon: <TrendingUp className="text-rugbyRed" />, title: "Fan Village", text: "Gaming zones and skill challenges." },
    { id: 'festival-market', icon: <Award className="text-rugbyRed" />, title: "Street Market", text: "25+ Food vendors from the EU." },
    { id: 'festival-vip', icon: <Star className="text-rugbyRed" />, title: "VIP Lounges", text: "Heated decks and open bars." }
  ]);

  const [heroContent, setHeroContent] = useState({
    heading: ["Bolder.", "Faster.", "Wilder."],
    subheading: "Join 40,000 fans for the adrenaline-fueled intersection of elite international rugby and Europe's biggest pitch-side festival."
  });

  const [eventDate, setEventDate] = useState("MAY 16-18");
  const [eventName, setEventName] = useState("Amsterdam Rugby 7s 2025");
  const [eventLocation, setEventLocation] = useState("Olympic Stadium Precinct, NL");
  
  const [countdownLabel, setCountdownLabel] = useState("Countdown to Kickoff");
  const [sponsorsSection, setSponsorsSection] = useState({ label: "Powering the Game", heading: "Official Sponsors" });
  const [newsSection, setNewsSection] = useState({ label: "Official Feed", heading: "Broadcast News" });
  const [socialSection, setSocialSection] = useState({ label: "Share your journey with the world", heading: "#AMSTERDAM7S" });
  const [festivalHeader, setFestivalHeader] = useState({ label: "More than just a game", heading: "The Rugby Festival" });

  useEffect(() => {
    setIsLoading(true);
    Promise.allSettled([
      // Hero Content
      api.get('/content/page/home/hero').then(r => {
        if (r.data) {
          const h = r.data.heading || "Bolder.\nFaster.\nWilder.";
          const lines = h.split('\n').filter((l: string) => l.trim());

          setHeroContent({
            heading: lines.length > 0 ? lines : ["Bolder.", "Faster.", "Wilder."],
            subheading: r.data.subheading || heroContent.subheading
          });
        }
      }),

      // Event Date
      api.get('/content/page/home/event-date').then(r => {
        if (r.data?.heading) setEventDate(r.data.heading);
      }),

      // Event Info (Name & Location)
      api.get('/content/page/home/event-info').then(r => {
        if (r.data?.heading) setEventName(r.data.heading);
      }),

      // News (max 3)
      api.get('/news').then(r => { if (r.data?.length) setNews(r.data.slice(0, 3)); }),

      // Official sponsors (with images)
      api.get('/sponsors?type=official-sponsors').then(r => {
        if (r.data?.length) setOfficialSponsors(r.data.map((s: Sponsor) => ({ ...s, subName: s.subName || s.role || '' })));
      }),

      // Sub sponsors (text only)
      api.get('/sponsors?type=subSponsors').then(r => {
        if (r.data?.length) setSubSponsors(r.data);
      }),

      // Stats
      api.get('/content/page/home').then(r => {
        if (r.data) {
          setStats(prevStats => prevStats.map(s => {
            const content = r.data.find((c: any) => c.section === s.id);
            return content ? { ...s, val: content.heading } : s;
          }));
        }
      }),

      // Social images
      api.get('/images?type=social').then(r => {
        if (r.data?.length) setSocialImages(r.data.map((i: Image) => i.img));
      }),

      // Festival section
      api.get('/images?type=festival').then(r => {
        if (r.data?.length >= 1) setFestivalImg1(r.data[0].img);
        if (r.data?.length >= 2) setFestivalImg2(r.data[1].img);
      }),

      // Festival Content & new dynamic text
      api.get('/content/page/home').then(r => {
        if (r.data) {
          // Description
          const desc = r.data.find((c: any) => c.section === 'festival-intro');
          if (desc?.body) setFestivalDesc(desc.body);

          // Features
          setFestivalFeatures(prev => prev.map(f => {
            const content = r.data.find((c: any) => c.section === f.id);
            return content ? { ...f, title: content.heading || f.title, text: content.subheading || f.text } : f;
          }));
          
          const countdown = r.data.find((c: any) => c.section === 'countdown-label');
          if (countdown?.heading) setCountdownLabel(countdown.heading);

          const sponsors = r.data.find((c: any) => c.section === 'sponsors-section');
          if (sponsors) setSponsorsSection({ label: sponsors.subheading || "Powering the Game", heading: sponsors.heading || "Official Sponsors" });

          const newsText = r.data.find((c: any) => c.section === 'news-section');
          if (newsText) setNewsSection({ label: newsText.subheading || "Official Feed", heading: newsText.heading || "Broadcast News" });

          const social = r.data.find((c: any) => c.section === 'social-section');
          if (social) setSocialSection({ label: social.subheading || "Share your journey with the world", heading: social.heading || "#AMSTERDAM7S" });

          const festHead = r.data.find((c: any) => c.section === 'festival-header');
          if (festHead) setFestivalHeader({ label: festHead.subheading || "More than just a game", heading: festHead.heading || "The Rugby Festival" });
        }
      })
    ]).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className="bg-deepNavy overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-black pb-8 md:pb-12">
        <HeroCarousel />

        {/* Hero Container */}
        <div className="relative z-20 w-full flex-grow flex flex-col pt-40 pb-16 min-h-[100vh]">
          {/* Main Hero Content */}
          <div className="max-w-7xl mx-auto px-4 w-full flex-grow flex flex-col justify-center">
            <div className="max-w-4xl drop-shadow-2xl">
              <div className="flex items-center space-x-2 text-xl sm:text-2xl text-rugbyRed font-black uppercase tracking-[0.3em] mb-4 animate-pulse">
                <Zap size={24} fill="currentColor" />
                <span>{eventName}</span>
              </div>
              <h1 className="text-[5rem] sm:text-[8rem] md:text-[11rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-8 transform -rotate-2">
                {heroContent.heading.map((line: string, i: number) => {
                  const isLast = i === heroContent.heading.length - 1;
                  if (isLoading) return <Loader />;

                  return (
                    <React.Fragment key={i}>
                      {isLast ? <span className="text-rugbyRed">{line}</span> : line}
                      {!isLast && <br />}
                    </React.Fragment>
                  );
                })}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-gray-100 max-w-2xl mb-12 leading-tight">
                {heroContent.subheading}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to={getBtnLink('btn_home_tickets_link', '/tickets')} target="_blank" rel="noopener noreferrer"><Button variant="primary" className="text-lg px-12">{getBtnText('btn_home_tickets_text', 'Buy Tickets Now')}</Button></Link>
              </div>
            </div>
          </div>

          {/* Footer / Countdown */}
          <div className="w-full mt-8 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
            <div className="order-2 md:order-1">
              <p className="font-black uppercase text-[10px] md:text-xs tracking-widest text-white/60 mb-3 drop-shadow-md">{countdownLabel}</p>
              <Countdown targetDateStr={eventDate} />
            </div>
            <div className="flex items-center space-x-6 order-1 md:order-2 drop-shadow-lg">
              <div className="flex flex-col items-center md:items-end">
                <span className="text-3xl md:text-3xl lg:text-4xl font-black italic text-white">{eventDate}</span>
                <span className="text-xs md:text-sm font-black text-rugbyRed uppercase tracking-widest bg-black/40 px-2 py-0.5">{eventLocation}</span>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-white rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm hover:bg-white hover:text-deepNavy transition-all cursor-pointer group shadow-2xl">
                <Link to="/home">
                  <Play fill="currentColor" size={24} className="ml-1 group-hover:scale-125 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Statistics Section - The Heritage */}
      <section className="py-32 bg-white text-deepNavy relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="group cursor-default">
                <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform">{iconMap[stat.icon] || <Trophy size={40} className="text-electricBlue" />}</div>
                <div className="text-7xl font-black italic tracking-tighter mb-2">{(stat.prefix || '') + stat.val + (stat.suffix || '')}</div>
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
            <span className="text-rugbyRed font-black uppercase tracking-[0.4em] mb-4 block">{sponsorsSection.label}</span>
            <h2 className="text-5xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-[0.8] mb-8">
              {sponsorsSection.heading.split(' ')[0]} <span className="text-white/40">{sponsorsSection.heading.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          <div className={officialSponsors.length > 4 ? "mask-gradient-to-r from-transparent via-black to-transparent overflow-hidden" : "overflow-hidden"}>
            <div className={officialSponsors.length > 4 ? "flex whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] w-max" : "flex flex-wrap justify-center gap-8 py-8"}>
              {(officialSponsors.length > 4 ? [...officialSponsors, ...officialSponsors] : officialSponsors).map((partner, i) => (
                <div
                  key={i}
                  className={`group relative bg-white/5 border border-white/10 p-8 skew-x-[-10deg] transition-all duration-500 cursor-default aspect-square ${officialSponsors.length > 4 ? 'inline-block w-64 mx-4' : 'w-64'}`}
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
                      {partner.subName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Sponsors */}
          <div className={`mt-24 py-10 border-y border-white/10 ${subSponsors.length > 4 ? 'overflow-hidden relative' : ''}`}>
            {subSponsors.length > 4 ? (
              <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="flex items-center space-x-16 px-8">
                    {subSponsors.map((s, si) => (
                      <React.Fragment key={si}>
                        <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">{s.name}</span>
                        <div className="w-2 h-2 bg-rugbyRed rotate-45" />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-16 px-8">
                {subSponsors.map((s, si) => (
                  <div key={si} className="flex items-center gap-16">
                    <span className="text-xl font-black italic uppercase text-white/30 hover:text-white transition-colors cursor-default">{s.name}</span>
                    {si < subSponsors.length - 1 && <div className="w-2 h-2 bg-rugbyRed rotate-45" />}
                  </div>
                ))}
              </div>
            )}
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
              <span className="text-rugbyRed font-black uppercase tracking-[0.4em] mb-4 block">{newsSection.label}</span>
              <h2 className="text-5xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-[0.8]">
                {newsSection.heading.split(' ')[0]} <span className="text-white/20">{newsSection.heading.split(' ').slice(1).join(' ')}</span>
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
            <h2 className="text-4xl md:text-6xl font-black italic uppercase mb-4">{socialSection.heading}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest">{socialSection.label}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {socialImages.map((src, i) => (
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
                <img src={festivalImg1} className="w-full h-80 object-cover skew-y-[-2deg] shadow-2xl" alt="Festival action" />
                <div className="bg-rugbyRed p-8 shadow-xl">
                  <h4 className="text-4xl font-black italic uppercase leading-none">NO<br />LIMITS</h4>
                </div>
              </div>
              <div className="space-y-4 pt-16">
                <img src={festivalImg2} className="w-full h-96 object-cover skew-y-[2deg] shadow-2xl" alt="Music stage" />
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2">
            <span className="text-electricBlue font-black uppercase tracking-[0.3em] mb-4 block">{festivalHeader.label}</span>
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-10">
              {festivalHeader.heading.split(' ').slice(0, -1).join(' ')} <span className="text-rugbyRed italic">{festivalHeader.heading.split(' ').slice(-1).join(' ')}</span>
            </h2>
            <div className="space-y-8 text-xl text-gray-300 leading-relaxed font-bold">
              <p>{festivalDesc}</p>
              <div className="grid sm:grid-cols-2 gap-8">
                {festivalFeatures.map((item, i) => (
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
              <Link to="/visitors" target="_blank" rel="noopener noreferrer"><Button variant="secondary" className="px-10 py-5">Explore the Full Experience</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
