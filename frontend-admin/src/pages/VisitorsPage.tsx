
import React, { useState, useEffect } from 'react';
import { MapPin, Utensils, Music, Info, Train, ParkingCircle, Bike } from 'lucide-react';
import api from '../services/api';

import InfoSection from '../components/InfoSection';

const VisitorsPage = () => {
  const [mapsLink, setMapsLink] = useState('');
  const [heroContent, setHeroContent] = useState({ heading: "Visit the\nFest", subheading: "Everything you need to know for May 16-18." });

  useEffect(() => {
    api.get('/config/google_maps_link').then(r => {
      if (r.data?.value) setMapsLink(r.data.value);
    }).catch(() => { });

    api.get('/content/page/visitors/hero').then(r => {
      if (r.data) {
        setHeroContent({
          heading: r.data.heading || "Visit the\nFest",
          subheading: r.data.subheading || "Everything you need to know for May 16-18."
        });
      }
    }).catch(() => { });
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-deepNavy via-transparent to-deepNavy" />
        <div className="relative z-10 text-center">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase italic tracking-tighter leading-none mb-4">
            {heroContent.heading.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? <span className="text-electricBlue">{line}</span> : line}
                {i < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h1>
          <p className="text-xl font-bold uppercase tracking-widest text-white/60">{heroContent.subheading}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          <InfoSection
            icon={<MapPin size={40} />}
            title="The Venue"
            items={[
              "National Rugby Center, Amsterdam",
              "Address: Bok de Korverweg 6, 1067 HR",
              "Open from 09:00 AM daily",
              "Cashless venue (Card only)",
              "Multi-pitch facility (6 fields)"
            ]}
          />
          <InfoSection
            icon={<Utensils size={40} />}
            title="Food & Drink"
            items={[
              "European Street Food Market",
              "Heineken Beer Gardens",
              "Artisanal Coffee & Juices",
              "Vegan & Gluten-free options",
              "Hydration stations across venue"
            ]}
          />
          <InfoSection
            icon={<Music size={40} />}
            title="Entertainment"
            items={[
              "Main Stage: Top EU DJs",
              "Fan Village: Games & Merch",
              "Player Meet & Greets",
              "Elite Final Showdown (Sun)",
              "Massive After-party Nightly"
            ]}
          />
        </div>

        <section className="mt-20 bg-white text-deepNavy p-12 skew-x-[-2deg]">
          <div className="skew-x-[2deg] flex flex-col md:row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-black italic uppercase mb-6 leading-tight">Getting <span className="text-rugbyRed">Here</span></h2>
              <p className="text-lg font-bold text-gray-600 mb-8">Amsterdam is one of the world's most accessible cities. We encourage green travel methods!</p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-deepNavy p-3 text-white"><Train /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm">Public Transport</h4>
                    <p className="text-xs font-bold text-gray-400">Tram 13 or Bus 21 from Central Station</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-deepNavy p-3 text-white"><Bike /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm">Cycling</h4>
                    <p className="text-xs font-bold text-gray-400">Large guarded bike parking available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-deepNavy p-3 text-white"><ParkingCircle /></div>
                  <div>
                    <h4 className="font-black uppercase text-sm">Car Parking</h4>
                    <p className="text-xs font-bold text-gray-400">Pre-book parking pass for Sloterdijk P+R</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full h-[400px] bg-gray-200 rounded-sm overflow-hidden relative border-8 border-deepNavy flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=800" className="w-full h-full object-contain grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                {mapsLink ? (
                  <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="bg-rugbyRed text-white px-8 py-4 font-black uppercase text-xl animate-bounce hover:bg-red-700 transition-colors">
                    MAP VIEW
                  </a>
                ) : (
                  <div className="bg-rugbyRed text-white px-8 py-4 font-black uppercase text-xl animate-bounce">MAP VIEW</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisitorsPage;
