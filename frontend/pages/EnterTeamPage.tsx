
import React, { useState, useEffect } from 'react';
import { Trophy, ChevronRight, Zap, Target, Medal } from 'lucide-react';
import Button from '../components/Button';
import api from '../services/api';

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
  const [heroTitle, setHeroTitle] = useState("Enter Your Battle-Unit");
  const [heroSub, setHeroSub] = useState("Professional, Social, or Legendary.");
  const [heroImg, setHeroImg] = useState("https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2000");

  const [steps, setSteps] = useState([
    { num: "01", title: "Choose Category", desc: "Select the tournament type that fits your squad's skill level and competitive drive." },
    { num: "02", title: "Team Details", desc: "Provide roster info, club history, and team colors for the official tournament program." },
    { num: "03", title: "Secure Deposit", desc: "Confirm your spot with a registration deposit. Early birds get custom kit discounts." },
    { num: "04", title: "Final Confirmation", desc: "Receive your tournament packet, match schedules, and logistical details." },
  ]);

  const [features, setFeatures] = useState([
    { title: "Elite Standard", desc: "Top tier international 7s format for professional clubs." },
    { title: "High Speed", desc: "Fast-paced tournament with short breaks." },
    { title: "Cash Prizes", desc: "Over €25,000 in prize pools for Elite categories." },
    { title: "Live Streaming", desc: "All Elite matches broadcast live globally." },
  ]);

  const [deadlines, setDeadlines] = useState([
    { label: "Early Bird", date: "Feb 28" },
    { label: "Standard", date: "Apr 15" },
    { label: "Final Call", date: "May 01" },
  ]);

  const [fees, setFees] = useState([
    { label: "Elite 7s", price: "€500" },
    { label: "Social 7s", price: "€350" },
    { label: "Vets 10s", price: "€400" },
  ]);

  const featureIcons = [<Target />, <Zap />, <Medal />, <Trophy />];

  useEffect(() => {
    // Hero content
    api.get('/content/page/enter-team/hero').then(r => {
      if (r.data) {
        const c = r.data;
        if (c.heading) setHeroTitle(c.heading);
        if (c.subheading) setHeroSub(c.subheading);
        if (c.ctaLink) setHeroImg(c.ctaLink);
      }
    }).catch(() => { });

    // Steps
    api.get('/content/page/enter-team/steps').then(r => {
      if (r.data) {
        const c = r.data;
        if (c.bodyItems?.length) {
          setSteps(c.bodyItems.map((desc: string, i: number) => ({
            num: String(i + 1).padStart(2, '0'),
            title: desc.split(':')[0] || `Step ${i + 1}`,
            desc: desc.includes(':') ? desc.split(':').slice(1).join(':').trim() : desc,
          })));
        }
      }
    }).catch(() => { });

    // Features
    api.get('/content/page/enter-team/features').then(r => {
      if (r.data) {
        const c = r.data;
        if (c.bodyItems?.length) {
          setFeatures(c.bodyItems.map((item: string) => ({
            title: item.split(':')[0] || item,
            desc: item.includes(':') ? item.split(':').slice(1).join(':').trim() : item,
          })));
        }
      }
    }).catch(() => { });

    // Deadlines
    api.get('/config/enter_team_deadlines').then(r => {
      if (r.data?.value && Array.isArray(r.data.value)) setDeadlines(r.data.value);
    }).catch(() => { });

    // Fees
    api.get('/config/enter_team_fees').then(r => {
      if (r.data?.value && Array.isArray(r.data.value)) setFees(r.data.value);
    }).catch(() => { });
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen pb-24">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            className="w-full h-full object-cover grayscale opacity-40"
            alt="Rugby pitch"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deepNavy via-deepNavy/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-[0.8] mb-6">
            {heroTitle.split(' ').slice(0, -1).join(' ')} <br /> <span className="text-rugbyRed">{heroTitle.split(' ').slice(-1)[0]}</span>
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest text-white/60">{heroSub}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white text-deepNavy p-10 skew-x-[-2deg]">
              <div className="skew-x-[2deg]">
                <h2 className="text-4xl font-black italic uppercase mb-8 border-b-4 border-rugbyRed inline-block">Registration Steps</h2>
                <div className="space-y-0 text-left mt-8">
                  {steps.map((s, i) => (
                    <Step key={i} num={s.num} title={s.title} desc={s.desc} />
                  ))}
                </div>
                <div className="mt-12">
                  <Button variant="primary" className="w-full md:w-auto">Start Registration Now</Button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all flex flex-col items-start">
                  <div className="text-rugbyRed mb-4">{featureIcons[i % featureIcons.length]}</div>
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
                  {deadlines.map((d, i) => (
                    <div key={i} className="flex justify-between border-b border-white/20 pb-2">
                      <span>{d.label}</span>
                      <span className="text-white/60 italic">{d.date}</span>
                    </div>
                  ))}
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
                  {fees.map((f, i) => (
                    <li key={i} className="flex justify-between"><span>{f.label}</span><span>{f.price}</span></li>
                  ))}
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
