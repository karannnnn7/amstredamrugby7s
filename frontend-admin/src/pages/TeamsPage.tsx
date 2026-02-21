
import React, { useState, useEffect } from 'react';
import { Search, Filter, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const TeamsPage = () => {
  const [filter, setFilter] = useState('ALL');
  const [teams, setTeams] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const categories = ['ALL', 'ELITE MEN', 'ELITE WOMEN', 'SOCIAL', 'VETS'];

  // Fallback data
  const fallbackTeams = [
    { name: "SAMURAI RFC", country: "INTERNATIONAL", category: "ELITE MEN", logo: "SR", color: "bg-red-600" },
    { name: "NETHERLANDS 7S", country: "NETHERLANDS", category: "ELITE WOMEN", logo: "NL", color: "bg-orange-500" },
    { name: "LONDON SCOTTISH", country: "UK", category: "ELITE MEN", logo: "LS", color: "bg-blue-800" },
    { name: "PARIS FROGIES", country: "FRANCE", category: "SOCIAL", logo: "PF", color: "bg-blue-600" },
    { name: "AMSTERDAM AC", country: "NETHERLANDS", category: "VETS", logo: "AC", color: "bg-black" },
    { name: "FIJI BABAS", country: "FIJI", category: "ELITE MEN", logo: "FB", color: "bg-cyan-500" },
    { name: "SOUTH AFRICA AS", country: "SOUTH AFRICA", category: "ELITE WOMEN", logo: "SA", color: "bg-green-700" },
    { name: "GERMAN EAGLES", country: "GERMANY", category: "SOCIAL", logo: "GE", color: "bg-yellow-500" },
    { name: "DUBLIN KNIGHTS", country: "IRELAND", category: "VETS", logo: "DK", color: "bg-green-600" },
    { name: "NZ MAORI", country: "NEW ZEALAND", category: "ELITE MEN", logo: "NZ", color: "bg-zinc-900" },
    { name: "IBERIAN LIONS", country: "SPAIN", category: "ELITE MEN", logo: "IL", color: "bg-red-700" },
    { name: "SCANDI RAIDERS", country: "DENMARK", category: "SOCIAL", logo: "SR", color: "bg-red-500" },
  ];

  useEffect(() => {
    setLoading(true);
    api.get('/teams').then(r => {
      if (r.data?.length) {
        setTeams(r.data.map((t: any) => ({
          name: t.name,
          country: t.country,
          category: t.category,
          logo: t.logo || t.name?.substring(0, 2),
          color: t.color || 'bg-gray-600',
        })));
      } else {
        setTeams(fallbackTeams);
      }
    }).catch(() => {
      setTeams(fallbackTeams);
    }).finally(() => setLoading(false));
  }, []);

  const filteredTeams = filter === 'ALL' ? teams : teams.filter(t => t.category === filter);
  const totalPages = Math.ceil(filteredTeams.length / limit);
  const paginatedTeams = filteredTeams.slice((page - 1) * limit, page * limit);

  // Reset page when filter changes
  useEffect(() => { setPage(1); }, [filter]);

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
                className={`px-4 py-2 font-black uppercase text-[10px] tracking-widest skew-x-[-10deg] transition-all border-2 ${filter === c ? 'bg-rugbyRed border-rugbyRed text-white' : 'border-deepNavy/10 hover:border-rugbyRed'
                  }`}
              >
                <span className="block skew-x-[10deg]">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 text-xl font-bold uppercase">Loading teams...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedTeams.map((team, i) => (
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{team.category}</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-white/10 p-3 disabled:opacity-30 hover:bg-rugbyRed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 font-black text-sm ${page === p ? 'bg-rugbyRed' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-white/10 p-3 disabled:opacity-30 hover:bg-rugbyRed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div className="text-center mt-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
              Showing {paginatedTeams.length} of {filteredTeams.length} teams
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;
