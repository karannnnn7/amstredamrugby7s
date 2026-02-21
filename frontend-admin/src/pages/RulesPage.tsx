
import React from 'react';
import { BookOpen, Shield, Clock, FileText } from 'lucide-react';
import api from '../services/api';

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
  const [heroContent, setHeroContent] = React.useState({ heading: "Tournament\nDirectives", subheading: "Official regulations for the Amsterdam Rugby 7s 2025 event. Adherence is mandatory for all participating units." });
  const [rules, setRules] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Fetch hero content
    api.get('/content/page/rules/hero').then(r => {
      if (r.data) {
        setHeroContent({
          heading: r.data.heading || "Tournament\nDirectives",
          subheading: r.data.subheading || "Official regulations for the Amsterdam Rugby 7s 2025 event. Adherence is mandatory for all participating units."
        });
      }
    }).catch(() => { });

    // Fetch dynamic rules
    api.get('/rules').then(r => {
      if (Array.isArray(r.data)) {
        setRules(r.data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)));
      }
    }).catch(err => console.error("Failed to fetch rules:", err));
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-16">
          <span className="text-rugbyRed font-black uppercase tracking-[0.3em] mb-4 block">Fair Play & Competition</span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none tracking-tighter mb-8">
            {heroContent.heading.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-white opacity-20">{line}</span> : line}
                {i < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl font-bold text-gray-400 max-w-2xl">{heroContent.subheading}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            {rules.length > 0 ? (
              rules.map((rule) => (
                <RuleCard
                  key={rule._id}
                  title={rule.title}
                  rules={rule.rules || []}
                />
              ))
            ) : (
              // Fallback/Loading state or keep hardcoded as initial state if preferred, 
              // but user wants dynamic. Let's just show a message if empty or nothing.
              <p className="col-span-2 text-gray-500 font-bold italic">Loading rules...</p>
            )}
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
