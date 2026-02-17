
import React from 'react';
import { Ticket, Star, Zap, Users, Check, ShieldCheck, Clock, MapPin, Music, Utensils } from 'lucide-react';
import Button from '../components/Button';

const TicketCard = ({ title, price, features, recommended = false }: any) => (
  <div className={`relative flex flex-col p-10 rounded-sm overflow-hidden transition-all duration-300 ${recommended ? 'bg-rugbyRed scale-105 z-10 shadow-2xl skew-x-[-2deg]' : 'bg-white text-deepNavy skew-x-[-2deg]'}`}>
    <div className="skew-x-[2deg]">
      {recommended && (
        <div className="absolute top-0 right-0 bg-white text-rugbyRed px-6 py-2 text-xs font-black uppercase tracking-widest transform rotate-45 translate-x-8 translate-y-6">
          POPULAR
        </div>
      )}
      <h3 className={`text-4xl font-black uppercase italic mb-2 ${recommended ? 'text-white' : 'text-deepNavy'}`}>{title}</h3>
      <div className="flex items-baseline mb-8">
        <span className="text-xl font-black italic mr-1">€</span>
        <span className="text-7xl font-black italic leading-none">{price}</span>
        <span className="text-sm font-black uppercase ml-2 opacity-60">/ Total</span>
      </div>

      <ul className="space-y-5 mb-12 flex-grow">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start space-x-3">
            <Check size={20} className={`mt-0.5 flex-shrink-0 ${recommended ? 'text-white' : 'text-rugbyRed'}`} />
            <span className={`text-base font-bold uppercase ${recommended ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
          </li>
        ))}
      </ul>

      <Button variant={recommended ? 'outline' : 'primary'} className="w-full text-lg py-5">
        Book Now
      </Button>
    </div>
  </div>
);

const TicketsPage = () => {
  return (
    <div className="bg-deepNavy min-h-screen">
      {/* Header */}
      <section className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Ticket size={1200} strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-rugbyRed font-black uppercase tracking-[0.4em] mb-4 block">Event Registration 2025</span>
          <h1 className="text-7xl md:text-[10rem] font-black italic uppercase italic tracking-tighter leading-[0.8] mb-12">
            Claim Your <span className="text-rugbyRed">Pass</span>
          </h1>
          <p className="text-2xl text-gray-300 font-bold max-w-3xl mx-auto mb-20 leading-relaxed">
            The Amsterdam Rugby 7s is more than a game—it's a massive multi-stage festival. Select your level of entry below.
          </p>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-32">
            <TicketCard
              title="Day Access"
              price="35"
              features={[
                "Single Day Entry (Fri/Sat/Sun)",
                "Full Access to 6 Pitches",
                "Festival Fan Village Entry",
                "Live DJ Sets & Entertainment",
                "Digital Match Guide"
              ]}
            />
            <TicketCard
              title="Weekend Fest"
              recommended={true}
              price="85"
              features={[
                "Full 3-Day Event Pass",
                "Official Tournament T-Shirt",
                "2 Complimentary Heineken Tokens",
                "Priority Fast-Track Entry",
                "Official Poster (A3 Limited)",
                "Elite Finals Reserved Seating"
              ]}
            />
            <TicketCard
              title="Lounge VIP"
              price="195"
              features={[
                "Heated VIP Deck Access",
                "Open Bar & Premium Buffet",
                "Meet & Greet with Legends",
                "Elevated Pitch-Side Views",
                "VIP Valet Parking Pass",
                "Commemorative VIP Lanyard"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 bg-white text-deepNavy relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase italic tracking-tighter leading-none mb-6">
              What's <span className="text-rugbyRed">Included?</span>
            </h2>
            <p className="text-xl font-bold text-gray-500 uppercase">Every ticket unlocks the full tournament spirit.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { icon: <Users />, title: "Elite Rugby", text: "Witness 120+ teams from 4 continents." },
              { icon: <Music />, title: "Multi-Stage", text: "Full music festival setup across 3 stages." },
              { icon: <Utensils />, title: "Gastro Yard", text: "Street food market with global flavors." },
              { icon: <Star />, title: "Showstoppers", text: "Grand Finals show and trophy ceremony." },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-24 h-24 bg-rugbyRed/5 border-2 border-rugbyRed/10 rounded-full flex items-center justify-center mx-auto mb-8 text-rugbyRed group-hover:bg-rugbyRed group-hover:text-white transition-all duration-300">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 40 })}
                </div>
                <h4 className="text-2xl font-black uppercase italic mb-4 italic">{item.title}</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison & Map Section */}
      <section className="py-32 bg-black border-y border-white/10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-5xl font-black italic uppercase leading-tight mb-10 text-white">Group & Club <br /><span className="text-rugbyRed">Discounts</span></h2>
            <p className="text-xl text-gray-400 font-bold mb-12 leading-relaxed italic">Bringing a squad of 10 or more? Unlock massive savings for your rugby club, corporate group, or large social circle.</p>

            <div className="space-y-8">
              {[
                { icon: <ShieldCheck />, title: "Club Bulk Pass", desc: "15% discount for verified amateur clubs." },
                { icon: <Clock />, title: "Early Bird Extension", desc: "Locked-in pricing for large group bookings." },
                { icon: <MapPin />, title: "Reserved Area", desc: "Private group zones available upon request." }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-6 bg-white/5 p-8 border-l-4 border-rugbyRed">
                  <div className="text-rugbyRed">{React.cloneElement(item.icon as React.ReactElement, { size: 32 })}</div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-lg text-white">{item.title}</h4>
                    <p className="text-sm font-bold text-gray-500 uppercase italic">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Button variant="outline" className="px-12 py-5">Request Group Quote</Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-rugbyRed transform rotate-3 z-0" />
            <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200" className="relative z-10 w-full h-[600px] object-cover skew-y-[-2deg] shadow-2xl" alt="Stadium view" />
            <div className="absolute -bottom-10 -left-10 bg-white p-12 hidden md:block skew-x-[-10deg] shadow-2xl">
              <div className="skew-x-[10deg] text-deepNavy">
                <span className="block text-4xl font-black italic leading-none mb-2">BE THERE.</span>
                <span className="block text-sm font-black uppercase tracking-widest opacity-60">MAY 16-18, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketsPage;
