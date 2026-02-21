
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SiteConfig } from '../../types';

const AdminConfig = () => {
    // ... logic ...
    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ key: '', value: '' });
    const [loading, setLoading] = useState(false);

    const fetchConfig = () => {
        // Config returns flat key-value, convert to array for display
        api.get('/config').then(r => {
            if (r.data) {
                // Filter out system managed keys that shouldn't be edited here
                const hiddenKeys = ['photo_categories'];
                const entries = Object.entries(r.data)
                    .filter(([key]) => !hiddenKeys.includes(key))
                    .map(([key, value]) => ({ key, value }));
                setConfigs(entries as SiteConfig[]);
            }
        }).catch(() => toast.error('Failed to fetch config'));
    };

    useEffect(() => { fetchConfig(); }, []);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        try {
            await api.post('/config', form);
            fetchConfig();
            setForm({ key: '', value: '' });
            setShowForm(false);
            toast.success('Config saved');
        } catch (err: any) { toast.error(err.message); } setLoading(false);
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Delete config "${key}"?`)) return;
        // Need to find the config id - use the key to delete
        try {
            // Config delete uses the ID, so we need to get it first
            await api.del(`/config/${key}`);
            fetchConfig();
            toast.success('Config deleted');
        } catch (err: any) { toast.error(err.message); }
    };

    const handleInlineEdit = async (key: string, newValue: string) => {
        try {
            await api.post('/config', { key, value: newValue });
            fetchConfig();
            toast.success('Config updated');
        } catch (err: any) { toast.error(err.message); }
    };

    const safeIso = (val: any) => {
        try {
            if (!val) return '';
            const d = new Date(val);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().slice(0, 16);
        } catch { return ''; }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">Site Config</h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Global key-value settings</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center space-x-2">
                    {showForm ? <><X size={16} /><span>Cancel</span></> : <><Plus size={16} /><span>Add Setting</span></>}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleUpsert} className="bg-gray-800 border border-white/10 p-6 mb-8 flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:flex-1">
                        <label className="text-xs font-black uppercase text-gray-400 block mb-2">Key</label>
                        <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" placeholder="e.g. contact_email" required />
                    </div>
                    <div className="w-full md:flex-1">
                        <label className="text-xs font-black uppercase text-gray-400 block mb-2">Value</label>
                        <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 whitespace-nowrap h-[42px] flex items-center justify-center">
                        <Save size={14} className="inline mr-2" />{loading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            )}

            <div className="space-y-2">
                {configs.map((cfg) => (
                    <div key={cfg.key} className="bg-gray-800 border border-white/5 p-4 flex items-center justify-between hover:border-white/10 group">
                        <div className="flex items-center space-x-6 flex-1">
                            <span className="text-xs font-black uppercase tracking-widest text-rugbyRed min-w-[160px]">{cfg.key}</span>
                            {['enter_team_deadlines', 'enter_team_fees', 'photo_categories'].includes(cfg.key) || (typeof cfg.value === 'string' && (cfg.value.startsWith('[') || cfg.value.startsWith('{'))) ? (
                                <textarea
                                    className="bg-transparent text-gray-300 font-bold outline-none flex-1 border-b border-white/10 focus:border-white/20 min-h-[4rem] text-xs font-mono"
                                    defaultValue={typeof cfg.value === 'string' ? cfg.value : JSON.stringify(cfg.value, null, 2)}
                                    onBlur={(e) => {
                                        const val = e.target.value;
                                        if (val !== cfg.value) {
                                            // Validate JSON before saving
                                            try {
                                                JSON.parse(val);
                                                handleInlineEdit(cfg.key, val);
                                            } catch (err) {
                                                toast.error('Invalid JSON format');
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <input
                                    className="bg-transparent text-gray-300 font-bold outline-none flex-1 border-b border-transparent focus:border-white/20"
                                    defaultValue={cfg.value as string}
                                    onBlur={(e) => {
                                        if (e.target.value !== cfg.value) {
                                            handleInlineEdit(cfg.key, e.target.value);
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <button onClick={() => handleDelete(cfg.key)} className="text-gray-500 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
            {configs.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No config entries yet</p>}

            <div className="mt-8 bg-white/5 border border-white/10 p-6">
                <h3 className="text-sm font-black uppercase text-gray-400 mb-4">Common Keys</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-bold text-gray-500">
                    {['google_maps_link', 'enter_team_deadlines', 'enter_team_fees', 'tickets_group_image'].map(k => (
                        <span key={k} className="bg-gray-800 px-3 py-2 cursor-pointer hover:text-white transition-colors" onClick={() => setForm({ ...form, key: k })}>
                            {k}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminConfig;
