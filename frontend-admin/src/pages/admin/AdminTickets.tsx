import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Ticket as TicketIcon, Star, CheckCircle2, Hash, Euro } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Ticket } from '../../types';

const AdminTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', price: 0, features: '', recommended: false, order: 0 });
    const [loading, setLoading] = useState(false);

    const fetchTickets = () => { api.get('/tickets').then(r => setTickets(r.data || [])).catch(() => toast.error('Failed to fetch tickets')); };
    useEffect(() => { fetchTickets(); }, []);

    const resetForm = () => { 
        setForm({ title: '', price: 0, features: '', recommended: false, order: 0 }); 
        setEditId(null); 
        setShowForm(false); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        const data = { 
            ...form, 
            features: form.features.split('\n').filter(f => f.trim() !== ''), 
            price: Number(form.price) 
        };
        try {
            if (editId) { 
                await api.put(`/tickets/${editId}`, data); 
                toast.success('Ticket updated successfully'); 
            } else { 
                await api.post('/tickets', data); 
                toast.success('Ticket created successfully'); 
            }
            fetchTickets(); 
            resetForm();
        } catch (err: any) { 
            toast.error(err.message); 
        } 
        setLoading(false);
    };

    const handleEdit = (t: Ticket) => {
        setForm({ 
            title: t.title, 
            price: t.price, 
            features: (t.features || []).join('\n'), 
            recommended: t.recommended || false, 
            order: t.order || 0 
        });
        setEditId(t._id); 
        setShowForm(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this ticket?')) return;
        try { 
            await api.del(`/tickets/${id}`); 
            fetchTickets(); 
            toast.success('Ticket deleted successfully'); 
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-emerald-500">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-500">
                        <TicketIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Tickets</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage admission passes and pricing
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-6 md:mt-0 relative z-10 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                         <Plus size={16} /><span>Add Ticket</span>
                     </button>
                )}
            </div>

            {showForm ? (
                <div className="animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-80" />
                                
                                <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                        <TicketIcon size={16} className="text-emerald-500" />
                                        <span>{editId ? 'Edit Ticket Details' : 'New Ticket Configuration'}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Ticket Title</label>
                                        <input 
                                            value={form.title} 
                                            onChange={(e) => setForm({ ...form, title: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-emerald-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm" 
                                            required 
                                            placeholder="e.g. Weekend Pass" 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Price (€)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                <Euro size={16} />
                                            </div>
                                            <input 
                                                type="number" 
                                                min="0"
                                                value={form.price === 0 && form.title === '' ? '' : form.price} 
                                                onChange={(e) => setForm({ ...form, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })} 
                                                className="w-full bg-gray-900/50 border border-white/10 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none font-bold text-sm" 
                                                required 
                                                placeholder="0.00" 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Features</label>
                                        <textarea 
                                            value={form.features} 
                                            onChange={(e) => setForm({ ...form, features: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-emerald-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm min-h-[140px] leading-relaxed" 
                                            required 
                                            placeholder="Enter each feature on a new line&#10;Access to all matches&#10;Standard seating&#10;Food voucher included"
                                        />
                                        <p className="text-[10px] text-gray-500 mt-2 ml-1 italic">Enter one feature per line. Bullets will be added automatically.</p>
                                    </div>

                                    <div className="flex items-center space-x-3 bg-gray-900/50 border border-white/10 p-4 rounded-lg cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => setForm({ ...form, recommended: !form.recommended })}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.recommended ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500 text-transparent'}`}>
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <label className="text-sm font-black uppercase tracking-widest text-white cursor-pointer select-none">Mark as Recommended</label>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Display Order</label>
                                        <input 
                                            type="number"
                                            value={form.order} 
                                            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-emerald-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm" 
                                            placeholder="0" 
                                        />
                                        <p className="text-[10px] text-gray-500 mt-2 ml-1">Lower numbers appear first.</p>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6 border-t border-white/5 pt-6">
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                            <span>{loading ? 'Saving...' : editId ? 'Update Ticket' : 'Publish Ticket'}</span>
                                        </button>
                                        <button type="button" onClick={() => resetForm()} className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-white/10 text-white px-8 py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors">
                                            <X size={16} /><span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Reference / Live Preview Pane */}
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="glass-card p-4 rounded-xl border border-white/10 sticky top-4">
                                <div className="flex items-center space-x-2 mb-4 text-gray-400 pb-2 border-b border-white/5">
                                    <Hash size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Card Preview</span>
                                </div>
                                <div className="flex justify-center p-2">
                                    {/* Mockup of the actual ticket card */}
                                    <div className={`w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-gray-800 to-gray-900 border ${form.recommended ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)] transform scale-[1.02]' : 'border-white/10'} transition-all`}>
                                        {form.recommended && (
                                            <div className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-max mx-auto mb-4 flex items-center gap-1">
                                                <Star size={10} fill="currentColor" /> Recommended
                                            </div>
                                        )}
                                        <h3 className="text-xl font-black uppercase text-white text-center tracking-tight mb-2">
                                            {form.title || 'Ticket Title'}
                                        </h3>
                                        <div className="text-center mb-6">
                                            <span className="text-4xl font-black italic text-emerald-400">€{form.price || '0'}</span>
                                        </div>
                                        <div className="w-full h-px bg-white/10 mb-6" />
                                        <ul className="space-y-3 mb-8">
                                            {(form.features ? form.features.split('\n').filter(f => f.trim() !== '') : ['Sample feature 1', 'Sample feature 2', 'Sample feature 3']).map((f, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-gray-300">
                                                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="leading-snug">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className={`w-full py-3 rounded-lg font-black uppercase text-xs tracking-widest text-center ${form.recommended ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white border border-white/20'}`}>
                                            Get Ticket
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-gray-600 mt-4 text-center uppercase tracking-widest">
                                    Shows exactly how it will appear to users
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {tickets.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {tickets.sort((a, b) => (a.order || 0) - (b.order || 0)).map((t) => (
                                <div key={t._id} className={`glass-card rounded-2xl relative group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${t.recommended ? 'border-emerald-500/50 shadow-[0_10px_30px_rgba(16,185,129,0.1)]' : 'border-white/5'}`}>
                                    {t.recommended && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 border border-emerald-400">
                                            <Star size={10} fill="currentColor" /> Populer
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-3 right-3 flex space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                        <button onClick={() => handleEdit(t)} className="text-gray-400 hover:text-white hover:bg-emerald-600 p-1.5 rounded transition-colors tooltip-trigger relative">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={(e) => handleDelete(t._id, e)} className="text-gray-400 hover:text-white hover:bg-red-600 p-1.5 rounded transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-1 mt-2">
                                        <div className="text-center mb-6">
                                            <h3 className={`text-lg font-black uppercase tracking-widest mb-2 ${t.recommended ? 'text-white' : 'text-gray-200'}`}>{t.title}</h3>
                                            <p className={`text-4xl font-black italic ${t.recommended ? 'text-emerald-400' : 'text-white'}`}>€{t.price}</p>
                                        </div>
                                        
                                        <div className="w-full h-px bg-white/10 mb-6" />
                                        
                                        <ul className="space-y-3 mb-6 flex-1">
                                            {t.features?.map((f: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-xs font-bold text-gray-400">
                                                    <CheckCircle2 size={14} className={`${t.recommended ? 'text-emerald-500' : 'text-gray-500'} shrink-0 mt-0.5`} />
                                                    <span className="leading-snug">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="pt-4 mt-auto">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                                <span>Order: {t.order || 0}</span>
                                                <span className="flex items-center gap-1">
                                                    <TicketIcon size={12} /> {t.features?.length || 0} Features
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                            <TicketIcon size={48} className="text-gray-800 mb-4" />
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                                No tickets formulated yet. <br/> <span className="text-emerald-500">Create a ticket to start selling</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminTickets;
