
import React from 'react';
import { Trophy, ChevronRight, Zap, Target, Medal } from 'lucide-react';
import Button from '../components/Button';

const Step = ({ num, title, desc }: any) => (
  <div className="flex items-start space-x-6 relative pb-12 last:pb-0">
    <div className="absolute left-[31px] top-[60px] w-0.5 h-[calc(100%-60px)] bg-white/10" />
    <div className="w-16 h-16 bg-white/5 border border-white/20 skew-x-[-10deg] flex-shrink-0 flex items-center justify-center group-hover:bg-rugbyRed transition-all">
      <span className="text-2xl font-black italic skew-x-[10deg]">{num}</span>
    </div>
    <div className="pt-2">
      <h3 className="text-xl font-black uppercase italic mb-2 tracking-wide">{title}</h3>
      <p className="text-gray-400 font-bold leading-relaxed">{desc}</p>
    </div>
  </div>
);

const EnterTeamPage = () => {
  return (
    <div className="bg-deepNavy min-h-screen pb-24">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2000" 
            className="w-full h-full object-cover grayscale opacity-40" 
            alt="Rugby pitch" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepNavy via-deepNavy/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-[0.8] mb-6">
            Enter Your <br /> <span className="text-rugbyRed">Battle-Unit</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest text-white/60">Professional, Social, or Legendary.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white text-deepNavy p-10 skew-x-[-2deg]">
              <div className="skew-x-[2deg]">
                <h2 className="text-4xl font-black italic uppercase mb-8 border-b-4 border-rugbyRed inline-block">Registration Steps</h2>
                <div className="space-y-0 text-left mt-8">
                  <Step num="01" title="Choose Category" desc="Select the tournament type that fits your squad's skill level and competitive drive." />
                  <Step num="02" title="Team Details" desc="Provide roster info, club history, and team colors for the official tournament program." />
                  <Step num="03" title="Secure Deposit" desc="Confirm your spot with a registration deposit. Early birds get custom kit discounts." />
                  <Step num="04" title="Final Confirmation" desc="Receive your tournament packet, match schedules, and logistical details." />
                </div>
                <div className="mt-12">
                  <Button variant="primary" className="w-full md:w-auto">Start Registration Now</Button>
                </div>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <Target />, title: "Elite Standard", desc: "Top tier international 7s format for professional clubs." },
                { icon: <Zap />, title: "High Speed", desc: "Fast-paced tournament with short breaks." },
                { icon: <Medal />, title: "Cash Prizes", desc: "Over €25,000 in prize pools for Elite categories." },
                { icon: <Trophy />, title: "Live Streaming", desc: "All Elite matches broadcast live globally." }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all flex flex-col items-start">
                  <div className="text-rugbyRed mb-4">{item.icon}</div>
                  <h4 className="text-lg font-black uppercase italic mb-2">{item.title}</h4>
                  <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-rugbyRed p-10 skew-x-[-4deg] text-white">
              <div className="skew-x-[4deg]">
                <h3 className="text-3xl font-black italic uppercase mb-4">Deadlines</h3>
                <div className="space-y-4 font-bold uppercase tracking-wider text-sm">
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span>Early Bird</span>
                    <span className="text-white/60 italic">Feb 28</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span>Standard</span>
                    <span className="text-white/60 italic">Apr 15</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span>Final Call</span>
                    <span className="text-white/60 italic">May 01</span>
                  </div>
                </div>
                <p className="mt-8 text-xs font-black uppercase leading-relaxed opacity-80 italic">
                  * Spots are limited and typically fill before the final call deadline.
                </p>
              </div>
            </div>

            <div className="bg-electricBlue p-10 skew-x-[-4deg] text-white">
              <div className="skew-x-[4deg]">
                <h3 className="text-3xl font-black italic uppercase mb-4">Entry Fees</h3>
                <ul className="space-y-4 font-black uppercase text-sm">
                  <li className="flex justify-between"><span>Elite 7s</span><span>€500</span></li>
                  <li className="flex justify-between"><span>Social 7s</span><span>€350</span></li>
                  <li className="flex justify-between"><span>Vets 10s</span><span>€400</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterTeamPage;
