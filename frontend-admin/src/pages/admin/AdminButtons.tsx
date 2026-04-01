import React, { useState, useEffect, useMemo } from 'react';
import { Save, ExternalLink, Type, MousePointerClick, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface ButtonConfig {
    label: string;
    textKey: string;
    linkKey: string;
    defaultText: string;
    defaultLink: string;
    category?: string;
    name?: string;
}

const RAW_BUTTONS: ButtonConfig[] = [
    { label: 'Navbar: Buy Tickets', textKey: 'btn_nav_tickets_text', linkKey: 'btn_nav_tickets_link', defaultText: 'Buy Tickets', defaultLink: '/tickets' },
    { label: 'Home: Buy Tickets', textKey: 'btn_home_tickets_text', linkKey: 'btn_home_tickets_link', defaultText: 'Buy Tickets Now', defaultLink: '/tickets' },
    { label: 'Tickets: Buy Tickets (Cards)', textKey: 'btn_tickets_buy_text', linkKey: 'btn_tickets_buy_link', defaultText: 'Buy Tickets', defaultLink: '/tickets' },
    { label: 'Tickets: Group Quote', textKey: 'btn_tickets_quote_text', linkKey: 'btn_tickets_quote_link', defaultText: 'Request Group Quote', defaultLink: '#' },
    { label: 'Charity: Donate', textKey: 'btn_charity_donate_text', linkKey: 'btn_charity_donate_link', defaultText: 'Donate to SNSG', defaultLink: '#' },
    { label: 'Recycle: Learn App', textKey: 'btn_recycle_app_text', linkKey: 'btn_recycle_app_link', defaultText: 'Learn About the App', defaultLink: '#' },
    { label: 'Teams: 7s Package', textKey: 'btn_pkg_7s_text', linkKey: 'btn_pkg_7s_link', defaultText: 'Enter a 7s team', defaultLink: '#' },
    { label: 'Teams: 10s Package', textKey: 'btn_pkg_10s_text', linkKey: 'btn_pkg_10s_link', defaultText: 'Enter a 10s team', defaultLink: '#' },
    { label: 'Teams: Tent Package', textKey: 'btn_pkg_tent_text', linkKey: 'btn_pkg_tent_link', defaultText: 'Rent a team tent', defaultLink: '#' },
];

// Process buttons to extract category and specific name
const BUTTONS = RAW_BUTTONS.map(btn => {
    const parts = btn.label.split(':');
    return {
        ...btn,
        category: parts[0]?.trim() || 'Other',
        name: parts[1]?.trim() || btn.label
    };
});

const AdminButtons = () => {
    const [localValues, setLocalValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    const categories = useMemo(() => {
        const cats = Array.from(new Set(BUTTONS.map(b => b.category)));
        return ['All', ...cats];
    }, []);

    const fetchConfig = () => {
        api.get('/config').then(r => {
            if (r.data) {
                // Pre-fill local values state
                const newLocal: Record<string, string> = {};
                BUTTONS.forEach(btn => {
                    newLocal[btn.textKey] = r.data[btn.textKey] || btn.defaultText;
                    newLocal[btn.linkKey] = r.data[btn.linkKey] || btn.defaultLink;
                });
                setLocalValues(newLocal);
                setInitialLoaded(true);
            }
        }).catch(() => toast.error('Failed to fetch button configs'));
    };

    useEffect(() => { fetchConfig(); }, []);

    const handleSave = async (textKey: string, linkKey: string, textValue: string, linkValue: string) => {
        setLoading(prev => ({ ...prev, [textKey]: true }));
        try {
            await Promise.all([
                api.post('/config', { key: textKey, value: textValue }),
                api.post('/config', { key: linkKey, value: linkValue })
            ]);
            toast.success('Button config saved successfully');
            // We don't refetch entirely to avoid overriding user's unsubmitted typing on other cards
        } catch (err: any) {
            toast.error(err.message || 'Failed to save changes');
        }
        setLoading(prev => ({ ...prev, [textKey]: false }));
    };

    if (!initialLoaded) {
        return (
            <div className="flex items-center justify-center p-24">
                <div className="w-8 h-8 border-4 border-sky-/30 border-t-sky- rounded-full animate-spin"></div>
            </div>
        );
    }

    const filteredButtons = activeTab === 'All' ? BUTTONS : BUTTONS.filter(b => b.category === activeTab);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-sky-">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-/20 flex items-center justify-center border border-sky-/30 text-sky-">
                        <MousePointerClick size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Call to Actions</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage dynamic text and links for buttons across the site
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-none animate-slide-in">
                <div className="flex items-center text-gray-500 mr-2 shrink-0">
                    <Filter size={16} className="mr-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter:</span>
                </div>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            activeTab === cat 
                                ? 'bg-sky- text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                                : 'glass-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up animate-delay-100">
                {filteredButtons.map((btn) => {
                    const currentText = localValues[btn.textKey] || '';
                    const currentLink = localValues[btn.linkKey] || '';
                    const isSaving = loading[btn.textKey];

                    return (
                        <div key={btn.textKey} className="glass-card rounded-xl border border-white/5 hover:border-sky-/30 transition-all duration-300 flex flex-col overflow-hidden group">
                            
                            {/* Card Header */}
                            <div className="p-4 border-b border-white/5 bg-gray-900/40 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-sky-/10 text-sky- border border-sky-/20 px-2 py-0.5 rounded mr-2 inline-block">
                                        {btn.category}
                                    </span>
                                </div>
                                <h3 className="text-xs font-bold uppercase text-white tracking-widest truncate">{btn.name}</h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-5 flex-1 bg-black/20">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2 ml-1">
                                        <Type size={12} className="text-sky-" /> Display Text
                                    </label>
                                    <input
                                        className="w-full bg-gray-900/80 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-bold focus:border-sky- outline-none transition-all focus:shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                                        value={currentText}
                                        onChange={(e) => setLocalValues({ ...localValues, [btn.textKey]: e.target.value })}
                                        id={btn.textKey}
                                        placeholder={btn.defaultText}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2 ml-1">
                                        <ExternalLink size={12} className="text-sky-" /> Target URL
                                    </label>
                                    <input
                                        className="w-full bg-gray-900/80 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-bold focus:border-sky- outline-none transition-all focus:shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                                        value={currentLink}
                                        onChange={(e) => setLocalValues({ ...localValues, [btn.linkKey]: e.target.value })}
                                        id={btn.linkKey}
                                        placeholder={btn.defaultLink}
                                    />
                                </div>
                            </div>

                            {/* Live Preview & Save */}
                            <div className="p-4 border-t border-white/5 bg-gray-900/60 flex flex-col justify-between gap-4">
                                
                                <div className="text-center">
                                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 font-bold">Button Preview</p>
                                    <button 
                                        type="button" 
                                        className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 font-bold uppercase text-[10px] tracking-widest transition-colors w-full rounded shadow-md truncate pointer-events-none"
                                    >
                                        {currentText || btn.defaultText}
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleSave(btn.textKey, btn.linkKey, currentText, currentLink)}
                                    disabled={isSaving}
                                    className="w-full bg-sky- hover:bg-sky- text-white px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                                >
                                    {isSaving ? (
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save size={14} />
                                    )}
                                    <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {filteredButtons.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                    <Filter size={32} className="text-gray-800 mb-4" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        No buttons found for this category.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AdminButtons;
