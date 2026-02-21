import React from 'react';

interface InfoSectionProps {
    icon: React.ReactNode;
    title: string;
    items: string[];
}

const InfoSection: React.FC<InfoSectionProps> = ({ icon, title, items }) => (
    <div className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-electricBlue transition-colors group">
        <div className="text-electricBlue mb-6 group-hover:scale-110 transition-transform origin-left">{icon}</div>
        <h3 className="text-2xl font-black uppercase italic mb-6 tracking-tight">{title}</h3>
        <ul className="space-y-4">
            {items.map((item: string, i: number) => (
                <li key={i} className="flex items-start space-x-3">
                    <div className="w-1 h-1 bg-rugbyRed mt-2 rounded-full flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-400 uppercase leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default InfoSection;
