
import React from 'react';

const PhotosPage = () => {
  const images = [
    "https://images.unsplash.com/photo-1551240111-20980590a204?q=80&w=800",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800",
    "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800",
    "https://images.unsplash.com/photo-1514525253344-f85653b7419b?q=80&w=800",
    "https://images.unsplash.com/photo-1563299796-17596ed6b017?q=80&w=800",
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800",
    "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800"
  ];

  return (
    <div className="bg-deepNavy min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none tracking-tighter mb-4">
              Action <span className="text-rugbyRed italic">Vault</span>
            </h1>
            <p className="text-xl font-bold text-gray-400">Capturing the intensity, the sweat, and the celebration.</p>
          </div>
          <div className="flex space-x-4">
             <button className="bg-rugbyRed px-6 py-2 font-black uppercase text-xs skew-x-[-10deg]"><span className="block skew-x-[10deg]">2024 Highlights</span></button>
             <button className="bg-white/10 px-6 py-2 font-black uppercase text-xs skew-x-[-10deg]"><span className="block skew-x-[10deg]">2023 Archive</span></button>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <div key={i} className="relative group overflow-hidden bg-black rounded-sm skew-x-[-2deg]">
              <img src={img} className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-rugbyRed/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-white font-black uppercase italic text-2xl skew-x-[2deg]">VIEW</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotosPage;
