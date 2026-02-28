import { useState, useEffect } from 'react';
import { Save, ExternalLink, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface ButtonConfig {
    label: string;
    textKey: string;
    linkKey: string;
    defaultText: string;
    defaultLink: string;
}

const BUTTONS: ButtonConfig[] = [
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

const AdminButtons = () => {
    const [localValues, setLocalValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

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
        }).catch(() => toast.error('Failed to fetch config'));
    };

    useEffect(() => { fetchConfig(); }, []);

    const handleSave = async (textKey: string, linkKey: string, textValue: string, linkValue: string) => {
        setLoading(true);
        try {
            await Promise.all([
                api.post('/config', { key: textKey, value: textValue }),
                api.post('/config', { key: linkKey, value: linkValue })
            ]);
            toast.success('Button config saved');
            fetchConfig();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save');
        }
        setLoading(false);
    };

    if (!initialLoaded) return <div className="p-8 text-white font-bold">Loading configs...</div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black italic uppercase text-white">Button Config</h1>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Manage dynamic text and links for buttons</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {BUTTONS.map((btn) => {
                    const currentText = localValues[btn.textKey] || '';
                    const currentLink = localValues[btn.linkKey] || '';

                    return (
                        <div key={btn.textKey} className="bg-gray-800 border border-white/5 p-5 hover:border-white/10 flex flex-col">
                            <h3 className="text-sm font-black uppercase text-rugbyRed mb-4 border-b border-white/10 pb-2">{btn.label}</h3>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                        <Type size={12} /> Button Text
                                    </label>
                                    <input
                                        className="w-full bg-gray-900 border border-white/10 text-white px-3 py-2 text-sm font-bold focus:border-rugbyRed outline-none transition-colors"
                                        value={currentText}
                                        onChange={(e) => setLocalValues({ ...localValues, [btn.textKey]: e.target.value })}
                                        id={btn.textKey}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                        <ExternalLink size={12} /> Button Link
                                    </label>
                                    <input
                                        className="w-full bg-gray-900 border border-white/10 text-white px-3 py-2 text-sm font-bold focus:border-rugbyRed outline-none transition-colors"
                                        value={currentLink}
                                        onChange={(e) => setLocalValues({ ...localValues, [btn.linkKey]: e.target.value })}
                                        id={btn.linkKey}
                                    />
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => handleSave(btn.textKey, btn.linkKey, currentText, currentLink)}
                                    disabled={loading}
                                    className="bg-white/10 hover:bg-rugbyRed text-white px-4 py-2 text-xs font-bold uppercase transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={14} /> Save Changes
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminButtons;
