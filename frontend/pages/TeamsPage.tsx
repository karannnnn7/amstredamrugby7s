import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Button from '../components/Button';
import { useConfig } from '../context/ConfigContext';
import api from '../services/api';

interface TeamPackage {
  _id: string;
  name: string;
  country: string; // Used as description based on latest AdminTeams setup
  color: string;
  btnTextKey: string;
  btnLinkKey: string;
  defaultBtnText: string;
  price?: string;
}

const DefaultPackages: TeamPackage[] = [
  {
    _id: "default-1",
    name: "7s Men / Women Team Package",
    country: "Team up for the Amsterdam 7s Men / Women Elite Pier or Social Shields 7s competition! This team package includes access to the event for 16 people (e.g. 13 player, 3 staff), lunch on match days, a match ball, a team photo, and an unforgettable weekend!",
    color: "bg-blue-600",
    btnTextKey: "btn_pkg_7s_text",
    btnLinkKey: "btn_pkg_7s_link",
    defaultBtnText: "Enter a 7s team",
    price: "€640,-"
  },
  {
    _id: "default-2",
    name: "10s Vets Men Team Package",
    country: "Register your team for the Men or Women 10s veterans competition. (age 35+) This team package includes access to the event for 18 people. (e.g. 15 players, 3 staff) lunch on matchdays, a match ball, a team photo, and an unforgettable weekend!",
    color: "bg-red-600",
    btnTextKey: "btn_pkg_10s_text",
    btnLinkKey: "btn_pkg_10s_link",
    defaultBtnText: "Enter a 10s team",
    price: "€720,-"
  },
  {
    _id: "default-3",
    name: "Team tent",
    country: "Get your team a personal spot at the tournament grounds. Customize it with branded items (no stickers). This space is convenient during competition days for storing your belongings, taking a moment, dealing with minor injuries, etc. \n\n*only to use during the day. Bringing your tents onto the premises is not allowed.",
    color: "bg-green-600",
    btnTextKey: "btn_pkg_tent_text",
    btnLinkKey: "btn_pkg_tent_link",
    defaultBtnText: "Rent a team tent",
    price: "€350,-"
  }
];

const TeamsPage = () => {
  const { getBtnText, getBtnLink } = useConfig();
  const [packages, setPackages] = useState<TeamPackage[]>([]);

  useEffect(() => {
    api.get('/teams').then(r => {
      if (r.data && r.data.length > 0) {
        const mappedPackages = r.data.map((t: any) => {
          let btnTextKey = "btn_pkg_7s_text";
          let btnLinkKey = "btn_pkg_7s_link";
          let defaultBtnText = "Enter a 7s team";

          if (t.name === '10s Vets Men Team Package') {
            btnTextKey = "btn_pkg_10s_text";
            btnLinkKey = "btn_pkg_10s_link";
            defaultBtnText = "Enter a 10s team";
          } else if (t.name === 'Team tent') {
            btnTextKey = "btn_pkg_tent_text";
            btnLinkKey = "btn_pkg_tent_link";
            defaultBtnText = "Rent a team tent";
          }

          return {
            _id: t._id,
            name: t.name,
            country: t.country,
            color: t.color || 'bg-blue-600',
            price: t.price || undefined,
            btnTextKey,
            btnLinkKey,
            defaultBtnText
          };
        });
        setPackages(mappedPackages);
      } else {
        setPackages(DefaultPackages);
      }
    }).catch(() => {
      setPackages(DefaultPackages);
    });
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen pb-24">
      <section className="bg-white text-deepNavy pt-32 pb-16 px-4 skew-divider mb-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-4">
            Registered <br /> <span className="text-rugbyRed">Squads</span>
          </h1>
          <p className="text-lg font-bold text-gray-500 max-w-xl">Meet the warriors competing in this year's tournament.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg._id} className="group relative bg-[#0a192f] border border-white/5 overflow-hidden flex flex-col hover:border-rugbyRed/50 transition-colors duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent transform rotate-45 translate-x-16 -translate-y-16" />

              <div className="p-8 flex flex-col flex-grow relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 ${pkg.color} flex items-center justify-center shadow-lg transform -skew-x-12`}>
                    <Shield className="text-white transform skew-x-12" size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white leading-tight">{pkg.name}</h3>
                  </div>
                </div>

                {pkg.price && (
                  <div className="mb-6">
                    <span className="text-2xl font-black text-rugbyRed tracking-tighter">{pkg.price}</span>
                  </div>
                )}

                <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8 flex-grow whitespace-pre-line">{pkg.country}</p>

                <Link to={getBtnLink(pkg.btnLinkKey, '#')} target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
                  <Button variant="primary" className="w-full py-3 text-sm font-black uppercase tracking-widest truncate shadow-lg hover:shadow-xl transform skew-x-[-10deg]">
                    <span className="block transform skew-x-[10deg]">{getBtnText(pkg.btnTextKey, pkg.defaultBtnText)}</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
