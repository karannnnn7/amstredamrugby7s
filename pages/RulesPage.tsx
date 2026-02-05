
import React from 'react';
import { BookOpen, Shield, Clock, FileText } from 'lucide-react';

const RuleCard = ({ title, rules }: any) => (
  <div className="bg-white/5 border-l-4 border-rugbyRed p-8 hover:bg-white/10 transition-all">
    <h3 className="text-2xl font-black uppercase italic mb-6 text-rugbyRed">{title}</h3>
    <ul className="space-y-4">
      {rules.map((rule: string, i: number) => (
        <li key={i} className="flex items-start space-x-3">
          <span className="text-rugbyRed font-black">/</span>
          <span className="text-sm font-bold text-gray-300 uppercase leading-relaxed">{rule}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RulesPage = () => {
  return (
    <div className="bg-deepNavy min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <span className="text-rugbyRed font-black uppercase tracking-[0.3em] mb-4 block">Fair Play & Competition</span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none tracking-tighter mb-8">
            Tournament <span className="text-white opacity-20">Directives</span>
          </h1>
          <p className="text-xl font-bold text-gray-400 max-w-2xl">Official regulations for the Amsterdam Rugby 7s 2025 event. Adherence is mandatory for all participating units.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <RuleCard 
              title="Match Format" 
              rules={[
                "7-a-side matches (10-a-side for Vets)",
                "7-minute halves with 2-minute break",
                "Finals: 10-minute halves",
                "Rolling substitutions (limit 5)",
                "Golden Point overtime for knockout stages"
              ]}
            />
            <RuleCard 
              title="Scoring" 
              rules={[
                "Try: 5 Points",
                "Conversion: 2 Points",
                "Penalty/Drop Goal: 3 Points",
                "Standard World Rugby Union laws apply",
                "Quick tap penalties allowed"
              ]}
            />
            <RuleCard 
              title="Discipline" 
              rules={[
                "Yellow Card: 2-minute sin bin",
                "Red Card: Immediate disqualification",
                "Referees' decisions are final",
                "Code of conduct strictly enforced off-field",
                "Zero tolerance for match official abuse"
              ]}
            />
            <RuleCard 
              title="Eligibility" 
              rules={[
                "Players must be registered on squad list",
                "Elite: Professional/Semi-pro status",
                "Vets: Minimum age of 35 by Jan 1st",
                "Maximum 12 players per squad list",
                "Cross-squad playing is prohibited"
              ]}
            />
          </div>

          <div className="space-y-8">
            <div className="bg-white text-deepNavy p-8 skew-x-[-4deg]">
              <div className="skew-x-[4deg]">
                <h3 className="text-2xl font-black italic uppercase mb-6 flex items-center space-x-2">
                  <FileText className="text-rugbyRed" />
                  <span>Downloads</span>
                </h3>
                <div className="space-y-4">
                  {[
                    "Full Rulebook (PDF)",
                    "Safety Protocols",
                    "Insurance Waiver",
                    "Pitch Allocation Guide"
                  ].map(file => (
                    <a href="#" key={file} className="block p-4 border border-deepNavy/10 hover:bg-rugbyRed hover:text-white transition-all font-black uppercase text-xs">
                      {file}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-electricBlue text-white p-8 skew-x-[-4deg]">
              <div className="skew-x-[4deg]">
                <h3 className="text-2xl font-black italic uppercase mb-4">Official Specs</h3>
                <div className="space-y-4 text-xs font-black uppercase tracking-widest opacity-80">
                  <div className="flex justify-between">
                    <span>Balls</span>
                    <span>Gilbert Synergie</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surface</span>
                    <span>Hybrid Hybrid Grass</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical</span>
                    <span>Pitchside Advanced Life Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
