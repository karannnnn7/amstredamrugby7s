
import React from 'react';
import { TreeDeciduous, Recycle, Zap, Droplets, Leaf } from 'lucide-react';
import api from '../services/api';

const SustainabilityPage = () => {
  const [heroContent, setHeroContent] = React.useState({ heading: "Green\nRugby", subheading: "Our commitment to a zero-impact festival by 2030." });
  const [heroImg, setHeroImg] = React.useState('/assets/sustainability.jpg');

  const [introLabel, setIntroLabel] = React.useState({
    label: "Sustainable Impact",
    heading: "Playing for the Future",
    body: "Rugby is a game of community and respect. We extend that respect to our planet. The Amsterdam Rugby 7s is leading the way in sustainable sporting events with innovative waste management and green logistics."
  });

  const [stats, setStats] = React.useState([
    { id: 'stat-recycled', heading: "92%", subheading: "Waste Recycled 2024" },
    { id: 'stat-plastics', heading: "0%", subheading: "Single Use Plastics" }
  ]);

  const [cards, setCards] = React.useState([
    { id: 'card-circular', icon: <Recycle />, title: "Circular Economy", desc: "All festival materials are compostable or recyclable." },
    { id: 'card-power', icon: <Zap />, title: "Renewable Power", desc: "100% of the venue power comes from Dutch wind farms." },
    { id: 'card-water', icon: <Droplets />, title: "Water Neutral", desc: "Advanced filtration systems reduce water consumption." },
    { id: 'card-carbon', icon: <Leaf />, title: "Carbon Offset", desc: "We plant 1 tree for every 10 tickets sold." }
  ]);

  React.useEffect(() => {
    api.get('/content/page/sustainability').then(r => {
      if (r.data) {
        const hero = r.data.find((c: any) => c.section === 'hero');
        if (hero) {
          setHeroContent({
            heading: hero.heading || "Green\nRugby",
            subheading: hero.subheading || "Our commitment to a zero-impact festival by 2030."
          });
        }
        
        const intro = r.data.find((c: any) => c.section === 'intro-label');
        if (intro) {
          setIntroLabel({
            label: intro.subheading || introLabel.label,
            heading: intro.heading || introLabel.heading,
            body: intro.body || introLabel.body
          });
        }
        
        setStats(prev => prev.map(s => {
          const content = r.data.find((c: any) => c.section === s.id);
          return content ? { ...s, heading: content.heading || s.heading, subheading: content.subheading || s.subheading } : s;
        }));

        setCards(prev => prev.map(crd => {
          const content = r.data.find((c: any) => c.section === crd.id);
          return content ? { ...crd, title: content.heading || crd.title, desc: content.subheading || crd.desc } : crd;
        }));
      }
    }).catch(() => { });

    api.get('/images?type=sustainability&limit=1').then(r => {
      if (r.data && r.data.length > 0) {
        setHeroImg(r.data[0].img);
      }
    }).catch(() => { });
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen pb-24">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-green-900/40 z-10" />
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-6xl md:text-9xl font-black italic uppercase italic tracking-tighter leading-none mb-6">
            {heroContent.heading.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-white opacity-40">{line}</span> : line}
                {i < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest">{heroContent.subheading}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-green-400 font-black uppercase tracking-[0.3em] mb-4 block">{introLabel.label}</span>
            <h2 className="text-5xl font-black uppercase italic mb-8">{introLabel.heading.split(' ').slice(0, -1).join(' ')} <span className="text-green-500">{introLabel.heading.split(' ').slice(-1).join(' ')}</span></h2>
            <p className="text-lg text-gray-400 font-bold leading-relaxed mb-8">
              {introLabel.body}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {stats.map(s => (
                <div key={s.id} className="bg-white/5 p-6 border-t-2 border-green-500">
                  <h4 className="text-3xl font-black italic text-green-500">{s.heading}</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">{s.subheading}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-green-500/10 skew-x-[-10deg] absolute inset-0 -translate-x-4 translate-y-4" />
            <img src={heroImg} className="relative z-10 w-full aspect-square object-cover skew-x-[-10deg]" alt="Playing for the Future" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {cards.map((item, i) => (
            <div key={i} className="bg-white/5 p-8 border border-white/10 hover:border-green-500 transition-colors">
              <div className="text-green-500 mb-6">{item.icon}</div>
              <h3 className="text-xl font-black uppercase italic mb-4">{item.title}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;
