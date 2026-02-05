
import React, { useState } from 'react';
import { Search, Filter, Shield } from 'lucide-react';

const TeamsPage = () => {
  const [filter, setFilter] = useState('ALL');
  
  const categories = ['ALL', 'ELITE MEN', 'ELITE WOMEN', 'SOCIAL', 'VETS'];
  
  const teams = [
    { name: "SAMURAI RFC", country: "INTERNATIONAL", cat: "ELITE MEN", logo: "SR", color: "bg-red-600" },
    { name: "NETHERLANDS 7S", country: "NETHERLANDS", cat: "ELITE WOMEN", logo: "NL", color: "bg-orange-500" },
    { name: "LONDON SCOTTISH", country: "UK", cat: "ELITE MEN", logo: "LS", color: "bg-blue-800" },
    { name: "PARIS FROGIES", country: "FRANCE", cat: "SOCIAL", logo: "PF", color: "bg-blue-600" },
    { name: "AMSTERDAM AC", country: "NETHERLANDS", cat: "VETS", logo: "AC", color: "bg-black" },
    { name: "FIJI BABAS", country: "FIJI", cat: "ELITE MEN", logo: "FB", color: "bg-cyan-500" },
    { name: "SOUTH AFRICA AS", country: "SOUTH AFRICA", cat: "ELITE WOMEN", logo: "SA", color: "bg-green-700" },
    { name: "GERMAN EAGLES", country: "GERMANY", cat: "SOCIAL", logo: "GE", color: "bg-yellow-500" },
    { name: "DUBLIN KNIGHTS", country: "IRELAND", cat: "VETS", logo: "DK", color: "bg-green-600" },
    { name: "NZ MAORI", country: "NEW ZEALAND", cat: "ELITE MEN", logo: "NZ", color: "bg-zinc-900" },
    { name: "IBERIAN LIONS", country: "SPAIN", cat: "ELITE MEN", logo: "IL", color: "bg-red-700" },
    { name: "SCANDI RAIDERS", country: "DENMARK", cat: "SOCIAL", logo: "SR", color: "bg-red-500" },
  ];

  const filteredTeams = filter === 'ALL' ? teams : teams.filter(t => t.cat === filter);

  return (
    <div className="bg-deepNavy min-h-screen pb-24">
      <section className="bg-white text-deepNavy pt-32 pb-16 px-4 skew-divider mb-20">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-end gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-4">
              Registered <br /> <span className="text-rugbyRed">Squads</span>
            </h1>
            <p className="text-lg font-bold text-gray-500 max-w-xl">Meet the warriors competing in this year's tournament. Filters below by category.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button 
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 font-black uppercase text-[10px] tracking-widest skew-x-[-10deg] transition-all border-2 ${
                  filter === c ? 'bg-rugbyRed border-rugbyRed text-white' : 'border-deepNavy/10 hover:border-rugbyRed'
                }`}
              >
                <span className="block skew-x-[10deg]">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeams.map((team, i) => (
            <div key={i} className="group bg-white/5 border border-white/10 p-6 skew-x-[-4deg] hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 ${team.color} opacity-20 -mr-8 -mt-8 rotate-45 transition-all group-hover:scale-150 group-hover:opacity-40`} />
              
              <div className="skew-x-[4deg] relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <div className={`w-12 h-12 ${team.color} flex items-center justify-center font-black italic text-xl border-2 border-white/20 shadow-lg`}>
                     {team.logo}
                   </div>
                   <Shield className="text-white/20 group-hover:text-rugbyRed transition-colors" />
                </div>
                
                <h3 className="text-xl font-black uppercase italic italic mb-1 leading-none">{team.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-rugbyRed mb-4">{team.country}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{team.cat}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
