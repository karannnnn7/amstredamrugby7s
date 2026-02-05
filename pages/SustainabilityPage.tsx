
import React from 'react';
import { TreeDeciduous, Recycle, Zap, Droplets, Leaf } from 'lucide-react';

const SustainabilityPage = () => {
  return (
    <div className="bg-deepNavy min-h-screen pb-24">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-green-900/40 z-10" />
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-6xl md:text-9xl font-black italic uppercase italic tracking-tighter leading-none mb-6">
            Green <span className="text-white opacity-40">Rugby</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest">Our commitment to a zero-impact festival by 2030.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="text-green-400 font-black uppercase tracking-[0.3em] mb-4 block">Sustainable Impact</span>
            <h2 className="text-5xl font-black uppercase italic mb-8">Playing for the <span className="text-green-500">Future</span></h2>
            <p className="text-lg text-gray-400 font-bold leading-relaxed mb-8">
              Rugby is a game of community and respect. We extend that respect to our planet. 
              The Amsterdam Rugby 7s is leading the way in sustainable sporting events with 
              innovative waste management and green logistics.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-6 border-t-2 border-green-500">
                  <h4 className="text-3xl font-black italic text-green-500">92%</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Waste Recycled 2024</p>
               </div>
               <div className="bg-white/5 p-6 border-t-2 border-green-500">
                  <h4 className="text-3xl font-black italic text-green-500">0%</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Single Use Plastics</p>
               </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-green-500/10 skew-x-[-10deg] absolute inset-0 -translate-x-4 translate-y-4" />
            <img src="https://images.unsplash.com/photo-1542601906970-1419d000a920?q=80&w=800" className="relative z-10 w-full aspect-square object-cover skew-x-[-10deg]" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: <Recycle />, title: "Circular Economy", desc: "All festival materials are compostable or recyclable." },
            { icon: <Zap />, title: "Renewable Power", desc: "100% of the venue power comes from Dutch wind farms." },
            { icon: <Droplets />, title: "Water Neutral", desc: "Advanced filtration systems reduce water consumption." },
            { icon: <Leaf />, title: "Carbon Offset", desc: "We plant 1 tree for every 10 tickets sold." }
          ].map((item, i) => (
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
