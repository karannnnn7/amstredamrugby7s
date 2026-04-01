import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Shield, Users, Tag, List, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Team } from '../../types';

const AdminTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '7s Men / Women Team Package', country: '', price: '€640,-', color: 'bg-blue-600' });
    const [loading, setLoading] = useState(false);

    const fetchTeams = () => { api.get('/teams').then(r => setTeams(r.data || [])).catch(() => toast.error('Failed to fetch teams')); };
    useEffect(() => { fetchTeams(); }, []);

    const resetForm = () => { 
        setForm({ name: '7s Men / Women Team Package', country: '', price: '€640,-', color: 'bg-blue-600' }); 
        setEditId(null); 
        setShowForm(false); 
    };

    const handleNameChange = (newName: string) => {
        let defaultDesc = '';
        let color = 'bg-blue-600';
        let defaultPrice = '€640,-';

        if (newName === '7s Men / Women Team Package') {
            defaultDesc = "Team up for the Amsterdam 7s Men / Women Elite Pier or Social Shields 7s competition! This team package includes access to the event for 16 people (e.g. 13 player, 3 staff), lunch on match days, a match ball, a team photo, and an unforgettable weekend!";
            color = 'bg-blue-600';
            defaultPrice = '€640,-';
        } else if (newName === '10s Vets Men Team Package') {
            defaultDesc = "Register your team for the Men or Women 10s veterans competition. (age 35+) This team package includes access to the event for 18 people. (e.g. 15 players, 3 staff) lunch on matchdays, a match ball, a team photo, and an unforgettable weekend!";
            color = 'bg-red-600';
            defaultPrice = '€720,-';
        } else if (newName === 'Team tent') {
            defaultDesc = "Get your team a personal spot at the tournament grounds. Customize it with branded items (no stickers). This space is convenient during competition days for storing your belongings, taking a moment, dealing with minor injuries, etc. \n\n*only to use during the day. Bringing your tents onto the premises is not allowed.";
            color = 'bg-green-600';
            defaultPrice = '€350,-';
        }
        setForm({ ...form, name: newName, country: defaultDesc, price: defaultPrice, color });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        try {
            if (editId) { 
                await api.put(`/teams/${editId}`, form); 
                toast.success('Team package updated successfully'); 
            } else { 
                await api.post('/teams', form); 
                toast.success('Team package created successfully'); 
            }
            fetchTeams(); 
            resetForm();
        } catch (err: any) { 
            toast.error(err.message); 
        } 
        setLoading(false);
    };

    const handleEdit = (t: Team) => {
        setForm({ name: t.name, country: t.country || '', price: (t as any).price || '', color: t.color || 'bg-gray-600' });
        setEditId(t._id); 
        setShowForm(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this team package?')) return;
        try { 
            await api.del(`/teams/${id}`); 
            fetchTeams(); 
            toast.success('Team package deleted successfully'); 
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    // Helper mapped colors string for bg colors
    const getBorderColor = (colorClass: string) => {
        if (colorClass.includes('blue')) return 'border-blue-500';
        if (colorClass.includes('red')) return 'border-red-500';
        if (colorClass.includes('green')) return 'border-green-500';
        return 'border-gray-500';
    };
    
    const getTextColor = (colorClass: string) => {
        if (colorClass.includes('blue')) return 'text-blue-400';
        if (colorClass.includes('red')) return 'text-red-400';
        if (colorClass.includes('green')) return 'text-green-400';
        return 'text-gray-400';
    };

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-blue-500">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-500">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Team Packages</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage registration packages and options
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-6 md:mt-0 relative z-10 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]">
                         <Plus size={16} /><span>Add Package</span>
                     </button>
                )}
            </div>

            {showForm ? (
                <div className="animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${form.color.replace('bg-', 'bg-')} opacity-80`} />
                                
                                <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                        <Tag size={16} className={getTextColor(form.color)} />
                                        <span>{editId ? 'Edit Package Details' : 'New Package Configuration'}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Package / Tier Name</label>
                                        <div className="relative">
                                            <select 
                                                value={form.name} 
                                                onChange={(e) => handleNameChange(e.target.value)} 
                                                className="w-full bg-gray-900/50 border border-white/10 focus:border-blue-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm appearance-none"
                                                required
                                            >
                                                <option value="7s Men / Women Team Package">7s Men / Women Team Package</option>
                                                <option value="10s Vets Men Team Package">10s Vets Men Team Package</option>
                                                <option value="Team tent">Team tent</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                <List size={16} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-2 ml-1">Selecting a preset name automatically populates the default description and price.</p>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Price String</label>
                                        <input 
                                            value={form.price} 
                                            onChange={(e) => setForm({ ...form, price: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-blue-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm" 
                                            required 
                                            placeholder="e.g. €640,-" 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Theme Color</label>
                                        <div className="flex gap-2 bg-gray-900/50 border border-white/10 rounded-lg p-2.5">
                                            {[
                                                { bg: 'bg-blue-600', border: 'border-blue-400' },
                                                { bg: 'bg-red-600', border: 'border-red-400' },
                                                { bg: 'bg-green-600', border: 'border-green-400' },
                                                { bg: 'bg-yellow-600', border: 'border-yellow-400' },
                                                { bg: 'bg-purple-600', border: 'border-purple-400' },
                                            ].map(color => (
                                                <button
                                                    key={color.bg}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, color: color.bg })}
                                                    className={`w-8 h-8 rounded-full ${color.bg} border-2 transition-all ${form.color === color.bg ? `${color.border} scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]` : 'border-transparent opacity-50 hover:opacity-100 hover:scale-110'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1 flex justify-between items-center">
                                            <span>Description Details</span>
                                            <span className="text-[8px] text-gray-600 lowercase bg-white/5 px-2 py-0.5 rounded">stored in 'country' field</span>
                                        </label>
                                        <textarea 
                                            value={form.country} 
                                            onChange={(e) => setForm({ ...form, country: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-blue-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm min-h-[160px] leading-relaxed" 
                                            required 
                                            placeholder="Enter package inclusions, limits, and details..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                            <span>{loading ? 'Saving...' : editId ? 'Update Package' : 'Publish Package'}</span>
                                        </button>
                                        <button type="button" onClick={() => resetForm()} className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-white/10 text-white px-8 py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors">
                                            <X size={16} /><span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Reference Pane */}
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="glass-card p-4 rounded-xl border border-white/10 sticky top-4">
                                <div className="flex items-center space-x-2 mb-4 text-gray-400 pb-2 border-b border-white/5">
                                    <Hash size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Pricing Card Preview</span>
                                </div>
                                <div className="bg-black/50 rounded-lg overflow-hidden border border-white/5 flex flex-col items-center p-4">
                                    <div className={`w-full ${form.color.replace('bg-', 'bg-') || 'bg-blue-600'} h-2 rounded-t-lg -mx-4 -mt-4 mb-4 opacity-80`} />
                                    <Shield className={getTextColor(form.color)} size={32} />
                                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest mt-3 text-center">{form.name}</h4>
                                    <p className="text-xl font-black text-white mt-2 mb-4">{form.price || '€...'}</p>
                                    <div className="w-full h-px bg-white/10 mb-4" />
                                    <div className="text-[8px] text-gray-400 text-center line-clamp-4 leading-relaxed px-2">
                                        {form.country || 'Package description will appear here...'}
                                    </div>
                                    <div className={`w-full py-1.5 mt-4 text-[8px] font-black uppercase tracking-widest text-center text-white ${form.color} rounded`}>
                                        Select Package
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-gray-600 mt-4 text-center uppercase tracking-widest">
                                    Rendered exactly like website
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {teams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((t) => (
                                <div key={t._id} className="glass-card rounded-xl border border-white/5 relative group hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden shadow-lg">
                                    {/* Color Header Bar */}
                                    <div className={`h-1.5 w-full ${t.color || 'bg-gray-600'}`} />
                                    
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-10 h-10 rounded-lg ${t.color?.replace('bg-', 'bg-').replace('600', '500/20') || 'bg-gray-500/20'} border ${getBorderColor(t.color || '')} border-opacity-30 flex items-center justify-center`}>
                                                <Shield className={getTextColor(t.color || '')} size={20} />
                                            </div>
                                            <div className="flex space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(t)} className="text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-lg hover:bg-blue-600 transition-colors tooltip-trigger relative">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={(e) => handleDelete(t._id, e)} className="text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-lg hover:bg-red-600 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-white leading-tight mb-2">{t.name}</h3>
                                            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-md">
                                                <span className="text-lg font-black text-white">{(t as any).price || 'N/A'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <div className="w-full h-px bg-white/5 mb-4" />
                                            <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-3">
                                                {t.country || 'No description available for this package.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                            <Users size={48} className="text-gray-800 mb-4" />
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                                No team packages configured. <br/> <span className="text-blue-500">Add a package to start</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminTeams;
