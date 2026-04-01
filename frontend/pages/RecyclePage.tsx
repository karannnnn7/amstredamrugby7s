
import React from 'react';
import { RefreshCw, Trash2, Leaf, Award, ArrowRight, Zap, Recycle, Beer } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useConfig } from '../context/ConfigContext';

const Step = ({ num, title, desc, icon }: any) => (
  <div className="bg-white/5 border border-white/10 p-10 skew-x-[-4deg] group hover:bg-rugbyRed/20 hover:border-rugbyRed transition-all duration-500">
    <div className="skew-x-[4deg]">
      <div className="flex justify-between items-start mb-8">
        <div className="text-rugbyRed group-hover:scale-125 transition-transform duration-500">{icon}</div>
        <span className="text-4xl font-black italic text-white/10 group-hover:text-rugbyRed/40 transition-colors">{num}</span>
      </div>
      <h3 className="text-2xl font-black uppercase italic mb-4">{title}</h3>
      <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed">{desc}</p>
    </div>
  </div>
);

const RecyclePage = () => {
  const { getBtnText, getBtnLink } = useConfig();
  const [heroContent, setHeroContent] = React.useState({ heading: "The\nSystem", subheading: "Redefining \"Full-Time\" — where the game ends, the cycle begins. 100% Waste Diversion by 2030." });
  const [heroImg, setHeroImg] = React.useState('/assets/recycle.jpg');

  const [cycleHeader, setCycleHeader] = React.useState({ label: "Engineered Sustainability", heading: "Pitch to Plant" });
  const [steps, setSteps] = React.useState([
    { id: 'step-01', num: "01", icon: <Trash2 size={40} />, title: "Smart Sorting", desc: "AI-powered sorting bins across the venue automatically segregate organics, plastics, and metals." },
    { id: 'step-02', num: "02", icon: <Recycle size={40} />, title: "On-Site Bio", desc: "Organic waste is processed into fertilizer for the local Amsterdam parks via our mobile digesters." },
    { id: 'step-03', num: "03", icon: <Leaf size={40} />, title: "Green Logistics", desc: "Recyclables are transported via zero-emission electric barges through the Amsterdam canals." },
    { id: 'step-04', num: "04", icon: <RefreshCw size={40} />, title: "Re-Entry", desc: "Plastics are repurposed into tournament seating and equipment for next year's event." }
  ]);

  const [rewardsHeader, setRewardsHeader] = React.useState({ label: "Play Your Part", heading: "Recycle \nGet Rewarded.", body: "Our \"Green Token\" system turns fan action into festival perks. Every cup returned is a step closer to a free round or exclusive merch." });
  const [rewards, setRewards] = React.useState([
    { id: 'reward-01', icon: <Beer />, title: "Statiegeld System", desc: "Return your reusable cup and get €1.50 back instantly or donate it to SNSG." },
    { id: 'reward-02', icon: <Award />, title: "Clean Squad Rewards", desc: "Fans seen actively cleaning their area get VIP stage access upgrades." },
    { id: 'reward-03', icon: <Zap />, title: "Token Boost", desc: "Scan your bin-deposit to earn digital tokens for the official app store." }
  ]);

  const [crewSection, setCrewSection] = React.useState({
    heading: "The Innovation Crew",
    items: ['RECYCLING HUB', 'GREEN POWER', 'ECO BARGE', 'CLEAN CITY']
  });

  React.useEffect(() => {
    api.get('/content/page/recycle').then(r => {
      if (r.data) {
        const hero = r.data.find((c: any) => c.section === 'hero');
        if (hero) {
          setHeroContent({
            heading: hero.heading || "The\nSystem",
            subheading: hero.subheading || "Redefining \"Full-Time\" — where the game ends, the cycle begins. 100% Waste Diversion by 2030."
          });
        }
        
        const cycleHead = r.data.find((c: any) => c.section === 'cycle-header');
        if (cycleHead) setCycleHeader({ label: cycleHead.subheading || cycleHeader.label, heading: cycleHead.heading || cycleHeader.heading });
        
        setSteps(prev => prev.map(s => {
          const content = r.data.find((c: any) => c.section === s.id);
          return content ? { ...s, title: content.heading || s.title, desc: content.subheading || s.desc } : s;
        }));

        const rwHead = r.data.find((c: any) => c.section === 'rewards-header');
        if (rwHead) setRewardsHeader({ label: rwHead.subheading || rewardsHeader.label, heading: rwHead.heading || rewardsHeader.heading, body: rwHead.body || rewardsHeader.body });

        setRewards(prev => prev.map(rw => {
          const content = r.data.find((c: any) => c.section === rw.id);
          return content ? { ...rw, title: content.heading || rw.title, desc: content.subheading || rw.desc } : rw;
        }));

        const crew = r.data.find((c: any) => c.section === 'crew-section');
        if (crew) setCrewSection({ heading: crew.heading || crewSection.heading, items: crew.bodyItems?.length ? crew.bodyItems : crewSection.items });
      }
    }).catch(() => { });

    api.get('/images?type=recycle&limit=1').then(r => {
      if (r.data && r.data.length > 0) {
        setHeroImg(r.data[0].img);
      }
    }).catch(() => { });
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1542601906970-1419d000a920?q=80&w=2000"
            className="w-full h-full object-cover"
            alt="Sustainability"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepNavy via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-4">
          <div className="flex items-center justify-center space-x-2 text-rugbyRed font-black uppercase tracking-[0.4em] mb-6">
            <RefreshCw size={24} className="animate-spin" style={{ animationDuration: '3s' }} />
            <span>Closed Loop Tournament</span>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            {heroContent.heading.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-rugbyRed">{line}</span> : line}
                {i < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl md:text-3xl font-bold text-gray-200 italic leading-snug max-w-3xl mx-auto">
            {heroContent.subheading}
          </p>
        </div>
      </section>

      {/* The Circular Cycle */}
      <section className="py-32 bg-white text-deepNavy relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-rugbyRed font-black uppercase tracking-[0.4em] mb-4 block">{cycleHeader.label}</span>
              <h2 className="text-6xl md:text-8xl font-black italic uppercase italic tracking-tighter leading-[0.8]">
                {cycleHeader.heading.split(' ').slice(0, -1).join(' ')} <span className="text-rugbyRed">{cycleHeader.heading.split(' ').slice(-1).join(' ')}</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map(s => (
              <Step
                key={s.id}
                num={s.num}
                icon={s.icon}
                title={s.title}
                desc={s.desc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fan Engagement: The Reward System */}
      <section className="py-32 bg-deepNavy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-rugbyRed/10 skew-x-[-15deg] transform translate-x-32" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-electricBlue font-black uppercase tracking-[0.3em] mb-4 block">{rewardsHeader.label}</span>
            <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] mb-10">
              {rewardsHeader.heading.includes('\n') ? (
                rewardsHeader.heading.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {i === arr.length - 1 ? <span className="text-white">{line}</span> : line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))
              ) : (
                <>{rewardsHeader.heading.split(' ').slice(0, -1).join(' ')} <span className="text-white">{rewardsHeader.heading.split(' ').slice(-1).join(' ')}</span></>
              )}
            </h2>
            <p className="text-xl text-gray-400 font-bold mb-12 leading-relaxed italic">
              {rewardsHeader.body}
            </p>

            <div className="space-y-6 mb-12">
              {rewards.map((item, i) => (
                <div key={i} className="flex items-start space-x-6 bg-white/5 p-8 border-l-4 border-electricBlue hover:bg-white/10 transition-all">
                  <div className="text-electricBlue">{item.icon}</div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-lg text-white">{item.title}</h4>
                    <p className="text-sm font-bold text-gray-500 uppercase italic">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to={getBtnLink('btn_recycle_app_link', '#')} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="px-12 py-5">{getBtnText('btn_recycle_app_text', 'Learn About the App')}</Button>
            </Link>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 border-2 border-electricBlue transform -rotate-3 transition-transform group-hover:rotate-0" />
            <img
              src={heroImg}
              className="relative z-10 w-full h-[600px] object-cover skew-y-[-2deg] grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl"
              alt="Stadium Cleanup"
            />
            <div className="absolute z-20 -top-10 -right-10 bg-rugbyRed p-12 skew-x-[10deg] shadow-2xl">
              <div className="skew-x-[-10deg]">
                <span className="block text-5xl font-black italic text-white leading-none mb-2">92%</span>
                <span className="block text-xs font-black uppercase tracking-widest text-white/60">DIVERTED IN 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Partners */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black italic uppercase mb-16">{crewSection.heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {crewSection.items.map((partner, i) => (
              <div key={i} className="border border-white/10 p-12 hover:bg-white/5 transition-colors group cursor-default">
                <span className="text-xl font-black italic text-white/40 group-hover:text-rugbyRed transition-colors">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecyclePage;
