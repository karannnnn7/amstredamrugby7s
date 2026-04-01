import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Pencil, Settings, Link as LinkIcon, Image as ImageIcon, FileText, Hash, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SiteConfig } from '../../types';

const CATEGORIES = [
    { id: 'All', label: 'All Settings', icon: <Settings size={14} /> },
    { id: 'Links', label: 'URLs & Links', icon: <LinkIcon size={14} /> },
    { id: 'Images', label: 'Images & Media', icon: <ImageIcon size={14} /> },
    { id: 'Content', label: 'Text & Content', icon: <FileText size={14} /> },
    { id: 'Other', label: 'Other', icon: <Hash size={14} /> }
];

const COMMON_KEYS = [
    'google_maps_link', 
    'enter_team_deadlines', 
    'enter_team_fees', 
    'tickets_group_image',
    'contact_email',
    'contact_phone',
    'facebook_url',
    'instagram_url'
];

const AdminConfig = () => {
    const [configs, setConfigs] = useState<SiteConfig[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ key: '', value: '' });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    // editingKey = which row is currently being edited
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const fetchConfig = () => {
        api.get('/config').then(r => {
            if (r.data) {
                const hiddenKeys = ['photo_categories'];
                const entries = Object.entries(r.data)
                    .filter(([key]) => !hiddenKeys.includes(key) && !key.startsWith('btn_'))
                    .map(([key, value]) => ({ key, value }));
                setConfigs(entries as SiteConfig[]);
            }
        }).catch(() => toast.error('Failed to fetch config details'));
    };

    useEffect(() => { fetchConfig(); }, []);

    const handleUpsert = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        try {
            await api.post('/config', form);
            fetchConfig();
            setForm({ key: '', value: '' });
            setShowForm(false);
            toast.success('Configuration saved successfully');
        } catch (err: any) { 
            toast.error(err.message); 
        }
        setLoading(false);
    };

    const handleDelete = async (key: string) => {
        if (!confirm(`Are you sure you want to delete the configuration key "${key}"?`)) return;
        try {
            await api.del(`/config/${key}`);
            fetchConfig();
            toast.success('Configuration deleted');
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const startEdit = (cfg: SiteConfig) => {
        setEditingKey(cfg.key);
        setEditValue(typeof cfg.value === 'string' ? cfg.value : JSON.stringify(cfg.value, null, 2));
    };

    const cancelEdit = () => {
        setEditingKey(null);
        setEditValue('');
    };

    const saveEdit = async (key: string) => {
        const isJson = editValue.trim().startsWith('[') || editValue.trim().startsWith('{');
        if (isJson) {
            try { 
                JSON.parse(editValue); 
            } catch {
                toast.error('Invalid JSON format provided in the value.');
                return;
            }
        }
        try {
            await api.post('/config', { key, value: editValue });
            fetchConfig();
            toast.success('Configuration updated successfully');
            cancelEdit();
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const getCategory = (key: string) => {
        const k = key.toLowerCase();
        if (k.includes('url') || k.includes('link') || k.includes('social')) return 'Links';
        if (k.includes('img') || k.includes('image') || k.includes('photo') || k.includes('logo')) return 'Images';
        if (k.includes('text') || k.includes('desc') || k.includes('content') || k.includes('info') || k.includes('fee') || k.includes('deadline') || k.includes('email') || k.includes('phone')) return 'Content';
        return 'Other';
    };

    const filteredConfigs = activeTab === 'All' ? configs : configs.filter(c => getCategory(c.key) === activeTab);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-sky-">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-/20 flex items-center justify-center border border-sky-/30 text-sky-">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Site Configuration</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage global website key-value settings
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => setShowForm(true)} className="mt-6 md:mt-0 relative z-10 bg-sky- hover:bg-sky- text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]">
                         <Plus size={16} /><span>Add Setting</span>
                     </button>
                )}
            </div>

            {showForm && (
                <div className="animate-slide-in">
                    <form onSubmit={handleUpsert} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-6">
                        <div className="absolute top-0 left-0 w-1 h-full bg-sky- opacity-80" />
                        
                        <div className="w-full md:flex-1 pl-4 md:pl-0">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Configuration Key</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <Key size={16} />
                                </div>
                                <input 
                                    value={form.key} 
                                    onChange={(e) => setForm({ ...form, key: e.target.value })} 
                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-sky- rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none font-bold text-sm" 
                                    placeholder="e.g. contact_email" 
                                    required 
                                />
                            </div>
                        </div>
                        <div className="w-full md:flex-1 pl-4 md:pl-0">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Assigned Value</label>
                            <input 
                                value={form.value} 
                                onChange={(e) => setForm({ ...form, value: e.target.value })} 
                                className="w-full bg-gray-900/50 border border-white/10 focus:border-sky- rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-sm" 
                                placeholder="Enter value..."
                                required 
                            />
                        </div>
                        <div className="w-full md:w-auto flex space-x-3 pl-4 md:pl-0">
                            <button type="submit" disabled={loading} className="flex-1 md:w-auto bg-sky- hover:bg-sky- text-white px-8 py-3 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                <span>Save</span>
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setForm({ key: '', value: '' }); }} className="md:w-auto bg-gray-800 hover:bg-gray-700 border border-white/10 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </form>

                    {/* Quick Keys Section */}
                    <div className="mt-4 glass-card p-4 rounded-xl border border-white/5 flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mr-2 flex items-center gap-1"><Hash size={12}/> Common Keys:</span>
                        {COMMON_KEYS.map(k => (
                            <button
                                key={k} 
                                type="button"
                                onClick={() => { setForm({ ...form, key: k }); }}
                                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-sky-/20 hover:text-sky- border border-white/5 hover:border-sky-/30 text-[10px] font-bold text-gray-400 transition-colors uppercase tracking-widest"
                            >
                                {k}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="flex overflow-x-auto pb-2 scrollbar-none space-x-2 animate-slide-in">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center space-x-2 ${
                                activeTab === cat.id 
                                    ? 'bg-sky- text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                                    : 'glass-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat.icon}
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                {filteredConfigs.length > 0 ? (
                    <div className="space-y-3 animate-fade-up animate-delay-100">
                        {filteredConfigs.map((cfg) => {
                            const isEditing = editingKey === cfg.key;
                            const isJson = typeof cfg.value === 'string' && (cfg.value.startsWith('[') || cfg.value.startsWith('{'));

                            return (
                                <div key={cfg.key} className={`glass-card rounded-xl border transition-all duration-300 ${isEditing ? 'border-sky- bg-sky-/5 shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                                    <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        
                                        {/* Key label */}
                                        <div className="flex items-center space-x-3 min-w-[250px] shrink-0">
                                            <div className="w-8 h-8 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-500">
                                                <Key size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black tracking-widest text-sky- uppercase">{cfg.key}</span>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{getCategory(cfg.key)}</span>
                                            </div>
                                        </div>

                                        {/* Value Display / Edit */}
                                        <div className="flex-1 w-full bg-gray-900/30 rounded-lg border border-white/5 p-3 min-h-[48px] flex items-center relative overflow-hidden group">
                                            {isEditing ? (
                                                <div className="w-full relative z-10">
                                                    {isJson ? (
                                                        <textarea
                                                            className="bg-gray-900 text-gray-200 font-mono text-sm px-4 py-3 border border-sky-/50 rounded-lg outline-none w-full min-h-[8rem] resize-y"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <input
                                                            className="bg-gray-900 text-white font-bold text-sm px-4 py-3 border border-sky-/50 rounded-lg outline-none w-full"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            autoFocus
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={`text-gray-300 text-sm font-bold break-all w-full select-all ${isJson ? 'font-mono text-xs text-sky-' : ''}`}>
                                                    {typeof cfg.value === 'string' ? cfg.value : JSON.stringify(cfg.value)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center w-full lg:w-auto justify-end mt-2 lg:mt-0">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => saveEdit(cfg.key)}
                                                        className="flex items-center space-x-1.5 bg-sky- hover:bg-sky- text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors shadow-[0_0_10px_rgba(14,165,233,0.4)]"
                                                    >
                                                        <Save size={14} /><span>Save</span>
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 transition-colors"
                                                    >
                                                        <X size={14} /><span>Cancel</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(cfg)}
                                                        className="text-gray-400 hover:text-white hover:bg-sky- p-2.5 rounded-lg transition-all border border-transparent hover:border-sky-"
                                                        title="Edit Config"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cfg.key)}
                                                        className="text-gray-400 hover:text-white hover:bg-red-600 p-2.5 rounded-lg transition-all border border-transparent hover:border-red-500"
                                                        title="Delete Config"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                        <Settings size={48} className="text-gray-800 mb-4" />
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                            No configurations found for the selected category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminConfig;
