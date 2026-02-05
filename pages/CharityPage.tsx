
import React from 'react';
import { Heart, Globe, Users, Gift } from 'lucide-react';
import Button from '../components/Button';

const CharityPage = () => {
  return (
    <div className="bg-deepNavy min-h-screen pb-24">
       <section className="relative h-[50vh] flex items-center justify-center">
         <div className="absolute inset-0 bg-rugbyRed/20 mix-blend-multiply z-10" />
         <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" />
         <div className="relative z-20 text-center px-4">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter italic mb-4">Support <span className="text-rugbyRed">SNSG</span></h1>
            <p className="text-xl font-black uppercase tracking-widest bg-black/40 inline-block px-4 py-2">Rugby For All, Forever.</p>
         </div>
       </section>

       <div className="max-w-7xl mx-auto px-4 mt-24">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div>
                <h2 className="text-5xl font-black uppercase italic mb-8 italic">The SNSG <span className="text-rugbyRed">Foundation</span></h2>
                <p className="text-xl text-gray-400 font-bold leading-relaxed mb-10">
                   The Amsterdam Rugby 7s is proud to partner with SNSG (Support Netherlands Sports Group), 
                   a foundation dedicated to providing opportunities for youth from underprivileged backgrounds 
                   to find their place in sports.
                </p>
                
                <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="border-l-4 border-rugbyRed pl-6">
                      <h4 className="text-4xl font-black italic mb-1">€150k+</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Raised in 2024</p>
                   </div>
                   <div className="border-l-4 border-electricBlue pl-6">
                      <h4 className="text-4xl font-black italic mb-1">5,000+</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-500">Kids Impacted</p>
                   </div>
                </div>

                <Button variant="primary">Donate to SNSG</Button>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Globe size={32} />, title: "Inclusivity", desc: "Breaking barriers for all athletes." },
                  { icon: <Users size={32} />, title: "Coaching", desc: "Training for local youth mentors." },
                  { icon: <Gift size={32} />, title: "Equipment", desc: "Supplying gear to developing clubs." },
                  { icon: <Heart size={32} />, title: "Wellbeing", desc: "Sport as a mental health tool." }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 p-8 border border-white/10 hover:bg-rugbyRed/10 transition-all flex flex-col items-center text-center">
                    <div className="text-rugbyRed mb-4">{item.icon}</div>
                    <h4 className="text-lg font-black uppercase italic mb-2 leading-none">{item.title}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default CharityPage;
