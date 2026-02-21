import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

interface TicketCardProps {
    title: string;
    price: string;
    features: string[];
    recommended?: boolean;
}

const TicketCard: React.FC<TicketCardProps> = ({ title, price, features, recommended = false }) => (
    <div className={`relative flex flex-col p-10 rounded-sm overflow-hidden transition-all duration-300 ${recommended ? 'bg-rugbyRed scale-105 z-10 shadow-2xl skew-x-[-2deg]' : 'bg-white text-deepNavy skew-x-[-2deg]'}`}>
        <div className="skew-x-[2deg]">
            {recommended && (
                <div className="absolute top-0 right-0 bg-white text-rugbyRed px-6 py-2 text-xs font-black uppercase tracking-widest transform rotate-45 translate-x-8 translate-y-6">
                    POPULAR
                </div>
            )}
            <h3 className={`text-4xl font-black uppercase italic mb-2 ${recommended ? 'text-white' : 'text-deepNavy'}`}>{title}</h3>
            <div className="flex items-baseline mb-8">
                <span className="text-xl font-black italic mr-1">€</span>
                <span className="text-7xl font-black italic leading-none">{price}</span>
                <span className="text-sm font-black uppercase ml-2 opacity-60">/ Total</span>
            </div>

            <ul className="space-y-5 mb-12 flex-grow">
                {features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start space-x-3">
                        <Check size={20} className={`mt-0.5 flex-shrink-0 ${recommended ? 'text-white' : 'text-rugbyRed'}`} />
                        <span className={`text-base font-bold uppercase ${recommended ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                    </li>
                ))}
            </ul>

            <Button variant={recommended ? 'outline' : 'primary'} className="w-full text-lg py-5">
                Book Now
            </Button>
        </div>
    </div>
);

export default TicketCard;
