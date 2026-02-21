import React from 'react';

interface StepProps {
    num: string;
    title: string;
    desc: string;
}

const Step: React.FC<StepProps> = ({ num, title, desc }) => (
    <div className="flex items-start space-x-6 relative pb-12 last:pb-0">
        <div className="absolute left-[31px] top-[60px] w-0.5 h-[calc(100%-60px)] bg-white/10" />
        <div className="w-16 h-16 bg-white/5 border border-white/20 skew-x-[-10deg] flex-shrink-0 flex items-center justify-center group-hover:bg-rugbyRed transition-all">
            <span className="text-2xl font-black italic skew-x-[10deg]">{num}</span>
        </div>
        <div className="pt-2">
            <h3 className="text-xl font-black uppercase italic mb-2 tracking-wide">{title}</h3>
            <p className="text-gray-400 font-bold leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Step;
