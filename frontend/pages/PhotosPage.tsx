
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

const PhotosPage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [activeType, setActiveType] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 25;

  // Fallback images if nothing is found (only used on initial load if empty and no categories)
  const [useFallback, setUseFallback] = useState(false);
  const fallbackImages = [
    { img: "https://images.unsplash.com/photo-1551240111-20980590a204?q=80&w=800", type: "2024 Highlights" },
    { img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800", type: "2024 Highlights" },
    { img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800", type: "2024 Highlights" },
    { img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800", type: "2023 Archive" },
    { img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800", type: "2023 Archive" },
    { img: "https://images.unsplash.com/photo-1514525253344-f85653b7419b?q=80&w=800", type: "2023 Archive" },
  ];

  const fetchCategories = () => {
    api.get('/config').then(r => {
      if (r.data && r.data.photo_categories) {
        try {
          const parsed = JSON.parse(r.data.photo_categories);
          if (Array.isArray(parsed)) setCategories(parsed);
        } catch (e) { console.error(e); }
      }
    }).catch(() => { });
  };

  const fetchImages = (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;

    let url = `/images?page=${currentPage}&limit=${limit}`;
    if (activeType === 'all') {
      // Exclude system types
      url += '&exclude_type=slider,social,festival,news';
    } else {
      url += `&type=${encodeURIComponent(activeType)}`;
    }

    api.get(url).then(r => {
      const newImages = r.data || [];
      if (reset) {
        setImages(newImages);
        // If no images at all and no categories, trigger fallback
        if (newImages.length === 0 && categories.length === 0 && activeType === 'all') {
          // Only use fallback if we really have nothing
          // But if we have categories, we should just show empty state
        }
      } else {
        setImages(prev => [...prev, ...newImages]);
      }

      setHasMore(newImages.length === limit);
      if (!reset) setLoading(false);
      else setLoading(false);

    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // When tab changes, reset and fetch
  useEffect(() => {
    setPage(1);
    setImages([]);
    fetchImages(true);
  }, [activeType]);

  // Handle "Show More"
  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    // Fetch happens via separate effect or direct call? 
    // State update is async, so direct call with explicit page is safer or useEffect dependency.
    // Let's use direct call logic in a useEffect dependent on page?
    // No, easier to just call fetchImages with specific logic, but activeType is dependency.
    // Better: split fetchImages to take page argument.
  };

  // UseEffect for page change implies we need to avoid double fetch on mount/tab change.
  // Simplified: 
  // Tab change -> setPage(1) -> matches ID 1 -> fetch
  // Show More -> setPage(p+1) -> ID changes -> fetch

  useEffect(() => {
    if (page > 1) {
      fetchImages(false);
    }
  }, [page]);

  const [heroContent, setHeroContent] = useState({ heading: "Action\nVault", subheading: "Capturing the intensity, the sweat, and the celebration." });

  useEffect(() => {
    api.get('/content/page/photos/hero').then(r => {
      if (r.data) {
        setHeroContent({
          heading: r.data.heading || "Action\nVault",
          subheading: r.data.subheading || "Capturing the intensity, the sweat, and the celebration."
        });
      }
    }).catch(() => { });
  }, []);

  return (
    <div className="bg-deepNavy min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none tracking-tighter mb-4">
              {heroContent.heading.split('\n').map((line, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="text-rugbyRed italic">{line}</span> : line}
                  {i < arr.length - 1 && ' '}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-xl font-bold text-gray-400">{heroContent.subheading}</p>
          </div>
          <div className="flex space-x-4 flex-wrap gap-2">
            <button
              onClick={() => setActiveType('all')}
              className={`px-6 py-2 font-black uppercase text-xs skew-x-[-10deg] ${activeType === 'all' ? 'bg-rugbyRed' : 'bg-white/10'}`}
            >
              <span className="block skew-x-[10deg]">All</span>
            </button>
            {categories.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-6 py-2 font-black uppercase text-xs skew-x-[-10deg] ${activeType === t ? 'bg-rugbyRed' : 'bg-white/10'}`}
              >
                <span className="block skew-x-[10deg]">{t}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && images.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl font-bold uppercase">Loading photos...</div>
        ) : (
          <>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((item, i) => (
                <div key={i} className="relative group overflow-hidden bg-black rounded-sm skew-x-[-2deg] flex items-center justify-center min-h-[300px]">
                  <img src={item.img} className="w-full h-auto max-h-[500px] object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-rugbyRed/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white font-black uppercase italic text-2xl skew-x-[2deg]">VIEW</span>
                  </div>
                </div>
              ))}
              {images.length === 0 && !loading && (
                <div className="col-span-full text-center text-gray-500 py-12 font-bold uppercase">No photos found in this category</div>
              )}
            </div>

            {hasMore && images.length > 0 && (
              <div className="mt-16 text-center">
                <button
                  onClick={handleShowMore}
                  disabled={loading}
                  className="bg-white/10 hover:bg-rugbyRed text-white px-8 py-4 font-black uppercase text-sm tracking-widest transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Show More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PhotosPage;
