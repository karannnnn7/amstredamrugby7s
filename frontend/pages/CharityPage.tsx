
import React from 'react';
import { Heart, Globe, Users, Gift } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useConfig } from '../context/ConfigContext';

const CharityPage = () => {
   const { getBtnText, getBtnLink } = useConfig();
   const [heroContent, setHeroContent] = React.useState({ heading: "Support\nSNSG", subheading: "Rugby For All, Forever." });
   const [contentSections, setContentSections] = React.useState<any[]>([]);

   React.useEffect(() => {
      api.get('/content/page/charity').then(r => {
         if (r.data && Array.isArray(r.data)) {
            setContentSections(r.data);
            const hero = r.data.find(s => s.section === 'hero');
            if (hero) {
               setHeroContent({
                  heading: hero.heading || "Support\nSNSG",
                  subheading: hero.subheading || "Rugby For All, Forever."
               });
            }
         }
      }).catch(() => { });
   }, []);

   return (
      <div className="bg-deepNavy min-h-screen pb-24">
         <section className="relative h-[50vh] flex items-center justify-center">
            <div className="absolute inset-0 bg-rugbyRed/20 mix-blend-multiply z-10" />
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-20 text-center px-4">
               <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter italic mb-4">
                  {heroContent.heading.split('\n').map((line, i, arr) => (
                     <React.Fragment key={i}>
                        {i === arr.length - 1 ? <span className="text-rugbyRed">{line}</span> : line}
                        {i < arr.length - 1 && ' '}
                     </React.Fragment>
                  ))}
               </h1>
               <p className="text-xl font-black uppercase tracking-widest bg-black/40 inline-block px-4 py-2">{heroContent.subheading}</p>
            </div>
         </section>

         <div className="max-w-7xl mx-auto px-4 mt-24">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div>
                  {(() => {
                     const intro = contentSections.find(s => s.section === 'snsg-intro') || {
                        heading: "The SNSG",
                        subheading: "Foundation",
                        body: "The Amsterdam Rugby 7s is proud to partner with SNSG (Support Netherlands Sports Group), a foundation dedicated to providing opportunities for youth from underprivileged backgrounds to find their place in sports."
                     };
                     return (
                        <>
                           <h2 className="text-5xl font-black uppercase italic mb-8 italic">
                              {intro.heading} {intro.subheading && <span className="text-rugbyRed">{intro.subheading}</span>}
                           </h2>
                           <p className="text-xl text-gray-400 font-bold leading-relaxed mb-10 whitespace-pre-wrap">
                              {intro.body}
                           </p>
                        </>
                     );
                  })()}

                  <div className="grid grid-cols-2 gap-8 mb-10">
                     {(() => {
                        const stat1 = contentSections.find(s => s.section === 'snsg-stat-1') || { heading: "€150k+", subheading: "Raised in 2024" };
                        const stat2 = contentSections.find(s => s.section === 'snsg-stat-2') || { heading: "5,000+", subheading: "Kids Impacted" };
                        return (
                           <>
                              {stat1.heading && (
                                 <div className="border-l-4 border-rugbyRed pl-6">
                                    <h4 className="text-4xl font-black italic mb-1">{stat1.heading}</h4>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">{stat1.subheading}</p>
                                 </div>
                              )}
                              {stat2.heading && (
                                 <div className="border-l-4 border-electricBlue pl-6">
                                    <h4 className="text-4xl font-black italic mb-1">{stat2.heading}</h4>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">{stat2.subheading}</p>
                                 </div>
                              )}
                           </>
                        );
                     })()}
                  </div>

                  <Link to={getBtnLink('btn_charity_donate_link', '#')} target="_blank" rel="noopener noreferrer">
                     <Button variant="primary">{getBtnText('btn_charity_donate_text', 'Donate to SNSG')}</Button>
                  </Link>
               </div>

               <div className="grid grid-cols-2 gap-4 items-start">
                  {(() => {
                     const defaultCards = [
                        { icon: <Globe size={32} />, title: "Inclusivity", desc: "Breaking barriers for all athletes.", section: 'snsg-card-1' },
                        { icon: <Users size={32} />, title: "Coaching", desc: "Training for local youth mentors.", section: 'snsg-card-2' },
                        { icon: <Gift size={32} />, title: "Equipment", desc: "Supplying gear to developing clubs.", section: 'snsg-card-3' },
                        { icon: <Heart size={32} />, title: "Wellbeing", desc: "Sport as a mental health tool.", section: 'snsg-card-4' }
                     ];
                     
                     // Try to match sections from DB, otherwise fall back to empty placeholder logic or default data if no DB record found
                     const cardsToRender = defaultCards.map(defCard => {
                        const found = contentSections.find(s => s.section === defCard.section);
                        if (found) {
                           return { ...defCard, title: found.heading || defCard.title, desc: found.subheading || defCard.desc, isActive: found.isActive !== false };
                        }
                        return { ...defCard, isActive: true };
                     }).filter(c => c.isActive && c.title); // only show if active and has a title

                     return cardsToRender.map((item, i) => (
                        <div key={i} className="bg-white/5 p-8 border border-white/10 hover:bg-rugbyRed/10 transition-all flex flex-col items-center text-center">
                           <div className="text-rugbyRed mb-4">{item.icon}</div>
                           <h4 className="text-lg font-black uppercase italic mb-2 leading-none">{item.title}</h4>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-tight">{item.desc}</p>
                        </div>
                     ));
                  })()}
               </div>
            </div>
         </div>
      </div>
   );
};

export default CharityPage;
