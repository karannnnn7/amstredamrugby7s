import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Scale, ListOrdered, ChevronDown, ChevronUp, Hash, ShieldAlert, Award, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Rule } from '../../types';

const CATEGORIES = [
    { id: 'All', label: 'All Rules' },
    { id: 'match-format', label: 'Match Format' },
    { id: 'scoring', label: 'Scoring' },
    { id: 'discipline', label: 'Discipline' },
    { id: 'eligibility', label: 'Eligibility' }
];

const AdminRules = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', category: 'match-format', rules: '', order: 0 });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

    const fetchRules = () => { 
        api.get('/rules').then(r => setRules(r.data || [])).catch(() => toast.error('Failed to fetch rules')); 
    };
    
    useEffect(() => { 
        fetchRules(); 
    }, []);

    const resetForm = () => { 
        setForm({ title: '', category: 'match-format', rules: '', order: 0 }); 
        setEditId(null); 
        setShowForm(false); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        const data = { ...form, rules: form.rules.split('\n').filter(Boolean) };
        try {
            if (editId) { 
                await api.put(`/rules/${editId}`, data); 
                toast.success('Rule section updated'); 
            } else { 
                await api.post('/rules', data); 
                toast.success('Rule section created'); 
            }
            fetchRules(); 
            resetForm();
        } catch (err: any) { 
            toast.error(err.message); 
        } 
        setLoading(false);
    };

    const handleEdit = (r: Rule, e: React.MouseEvent) => {
        e.stopPropagation();
        setForm({ 
            title: r.title, 
            category: r.category || 'match-format', 
            rules: (r.rules || []).join('\n'), 
            order: r.order || 0 
        });
        setEditId(r._id); 
        setShowForm(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this rule section?')) return;
        try { 
            await api.del(`/rules/${id}`); 
            fetchRules(); 
            toast.success('Rule section deleted'); 
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedRules);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRules(newExpanded);
    };

    const filteredRules = activeTab === 'All' ? rules : rules.filter(r => r.category === activeTab);
    
    // Sort rules by order
    const sortedRules = [...filteredRules].sort((a, b) => (a.order || 0) - (b.order || 0));

    const getCategoryIcon = (category: string) => {
        switch(category) {
            case 'match-format': return <ListOrdered size={16} className="text-blue-400" />;
            case 'scoring': return <Award size={16} className="text-emerald-400" />;
            case 'discipline': return <ShieldAlert size={16} className="text-red-400" />;
            case 'eligibility': return <FileText size={16} className="text-purple-400" />;
            default: return <Scale size={16} className="text-gray-400" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch(category) {
            case 'match-format': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'scoring': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'discipline': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'eligibility': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getCategoryLabel = (category: string) => {
        return CATEGORIES.find(c => c.id === category)?.label || category;
    };

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-cyan-500">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 text-cyan-500">
                        <Scale size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Tournament Rules</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage match formats, discipline, scoring, and eligibility
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-6 md:mt-0 relative z-10 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                         <Plus size={16} /><span>Add Rule Section</span>
                     </button>
                )}
            </div>

            {showForm ? (
                <div className="animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 opacity-80" />
                                
                                <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                        <Scale size={16} className="text-cyan-500" />
                                        <span>{editId ? 'Edit Rule Section' : 'Create New Rule Section'}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Section Title</label>
                                        <input 
                                            value={form.title} 
                                            onChange={(e) => setForm({ ...form, title: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-cyan-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-sm" 
                                            required 
                                            placeholder="e.g. Yellow Cards & Red Cards" 
                                        />
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Category</label>
                                        <select 
                                            value={form.category} 
                                            onChange={(e) => setForm({ ...form, category: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-cyan-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-xs appearance-none"
                                        >
                                            <option value="match-format">Match Format</option>
                                            <option value="scoring">Scoring</option>
                                            <option value="discipline">Discipline</option>
                                            <option value="eligibility">Eligibility</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-1 border border-white/5 rounded-xl p-4 bg-gray-900/30">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Display Order</label>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center text-gray-400">
                                                <Hash size={16} />
                                            </div>
                                            <input 
                                                type="number" 
                                                value={form.order} 
                                                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} 
                                                className="flex-1 bg-transparent border-none text-white outline-none font-black text-xl" 
                                                placeholder="0" 
                                            />
                                        </div>
                                        <p className="text-[9px] text-gray-500 mt-2 uppercase font-bold tracking-widest">Lower number appears first</p>
                                    </div>

                                    <div className="md:col-span-2 mt-2">
                                        <div className="flex items-center justify-between mb-2 ml-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">Rule Points</label>
                                            <span className="text-[9px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20 uppercase tracking-widest">1 line = 1 bullet point</span>
                                        </div>
                                        <textarea 
                                            value={form.rules} 
                                            onChange={(e) => setForm({ ...form, rules: e.target.value })} 
                                            rows={8} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-cyan-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm leading-relaxed" 
                                            required 
                                            placeholder="Enter rules here...&#10;Press Enter for a new point.&#10;Keep points clear and concise."
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4 border-t border-white/5 pt-6">
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                            <span>{loading ? 'Saving Area...' : editId ? 'Update Section' : 'Save New Section'}</span>
                                        </button>
                                        <button type="button" onClick={() => resetForm()} className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-white/10 text-white px-8 py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors">
                                            <X size={16} /><span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Reference Preview */}
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="glass-card p-4 rounded-xl border border-white/10 sticky top-4">
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <Hash size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Layout Reference</span>
                                    </div>
                                </div>
                                <div className="text-center bg-gray-900/50 rounded-lg p-2">
                                    <img
                                        src="/assets/admin-previews/rules-list.webp"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                        alt="Rules Preview"
                                        className="w-full h-auto object-cover rounded shadow-lg opacity-80"
                                    />
                                    <div className="hidden py-8">
                                        <Scale size={24} className="text-gray-600 mx-auto mb-2" />
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Preview unavailable</p>
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-gray-600 mt-3 text-center uppercase tracking-widest">
                                    Displayed on the main rules page
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Category Filter Tabs */}
                    <div className="flex overflow-x-auto pb-2 scrollbar-none space-x-2 animate-slide-in">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === cat.id 
                                        ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                                        : 'glass-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {sortedRules.length > 0 ? (
                        <div className="space-y-3 animate-fade-up animate-delay-100">
                            {sortedRules.map((r, index) => {
                                const isExpanded = expandedRules.has(r._id);
                                return (
                                    <div key={r._id} className={`glass-card rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-cyan-500/50' : 'border-white/5 hover:border-white/20'}`}>
                                        {/* Header / Clickable Area */}
                                        <div 
                                            className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition-colors ${isExpanded ? 'bg-cyan-500/5' : 'hover:bg-white/5'}`}
                                            onClick={() => toggleExpand(r._id)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-900 border border-white/10 items-center justify-center text-xs font-black text-gray-500">
                                                    {r.order}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center space-x-3 mb-1">
                                                        <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getCategoryColor(r.category || 'match-format')}`}>
                                                            {getCategoryIcon(r.category || 'match-format')}
                                                            <span>{getCategoryLabel(r.category || 'match-format')}</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-900 px-2 py-0.5 rounded border border-white/5">
                                                            {r.rules?.length || 0} POINTS
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-black uppercase text-white tracking-widest">{r.title}</h3>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0 space-x-2">
                                                <div className="flex space-x-1">
                                                    <button onClick={(e) => handleEdit(r, e)} className="text-gray-400 hover:text-white hover:bg-cyan-600 p-2 rounded-lg transition-all border border-transparent hover:border-cyan-500 relative tooltip-trigger">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={(e) => handleDelete(r._id, e)} className="text-gray-400 hover:text-white hover:bg-red-600 p-2 rounded-lg transition-all border border-transparent hover:border-red-500">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="p-2 text-gray-500 bg-gray-900 rounded-lg border border-white/5 ml-4">
                                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Content Area */}
                                        <div 
                                            className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-white/5' : 'grid-rows-[0fr] opacity-0'}`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="p-5 sm:pl-20 sm:pr-8 bg-black/20">
                                                    {r.rules && r.rules.length > 0 ? (
                                                        <ul className="space-y-3">
                                                            {r.rules.map((ruleText, idx) => (
                                                                <li key={idx} className="flex items-start space-x-3 text-sm text-gray-300">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                                                                    <span className="leading-relaxed">{ruleText}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-xs text-gray-500 italic uppercase">No detailed points specified for this rule section.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                            <Scale size={48} className="text-gray-800 mb-4" />
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                                No rules configured for ({getCategoryLabel(activeTab)}). <br/> <span className="text-cyan-500">Add a new section above.</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminRules;
