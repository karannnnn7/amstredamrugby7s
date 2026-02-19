
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import api from '../../services/api';

const AdminTickets = () => {
    // ... logic ...
    const [tickets, setTickets] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', price: 0, features: '', recommended: false, order: 0 });
    const [loading, setLoading] = useState(false);

    const fetchTickets = () => { api.get('/tickets').then(r => setTickets(r.data || [])).catch(() => { }); };
    useEffect(() => { fetchTickets(); }, []);

    const resetForm = () => { setForm({ title: '', price: 0, features: '', recommended: false, order: 0 }); setEditId(null); setShowForm(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        const data = { ...form, features: form.features.split('\n').filter(Boolean), price: Number(form.price) };
        try {
            if (editId) { await api.put(`/tickets/${editId}`, data); }
            else { await api.post('/tickets', data); }
            fetchTickets(); resetForm();
        } catch (err: any) { alert(err.message); } setLoading(false);
    };

    const handleEdit = (t: any) => {
        setForm({ title: t.title, price: t.price, features: (t.features || []).join('\n'), recommended: t.recommended || false, order: t.order || 0 });
        setEditId(t._id); setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete ticket?')) return;
        try { await api.del(`/tickets/${id}`); fetchTickets(); } catch (err: any) { alert(err.message); }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">Tickets</h1>

                </div>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2">
                    {showForm ? <><X size={16} /><span>Cancel</span></> : <><Plus size={16} /><span>Add Ticket</span></>}
                </button>
            </div>

            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Price (€)</label><input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div className="md:col-span-2"><label className="text-xs font-black uppercase text-gray-400 block mb-2">Features (one per line)</label><textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" /></div>
                            <div className="flex items-center space-x-3"><input type="checkbox" checked={form.recommended} onChange={(e) => setForm({ ...form, recommended: e.target.checked })} className="w-5 h-5" /><label className="text-xs font-black uppercase text-gray-400">Recommended</label></div>
                            <div className="flex items-end justify-end"><button type="submit" disabled={loading} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 flex items-center justify-center"><Save size={14} className="inline mr-2" />{loading ? 'Saving...' : editId ? 'Update' : 'Create'}</button></div>
                        </form>
                    </div>
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-gray-800 border border-white/10 p-4 sticky top-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Section Preview</label>
                            <img
                                src="/assets/admin-previews/tickets-list.png"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                alt="Tickets Page Preview"
                                className="w-full h-auto object-cover border border-white/5 opacity-75 hover:opacity-100 transition-opacity"
                            />
                            <p className="text-[10px] text-gray-600 mt-2 text-center">Ref: tickets-list.png</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tickets.map((t) => (
                    <div key={t._id} className={`bg-gray-800 border ${t.recommended ? 'border-rugbyRed' : 'border-white/5'} p-6 group relative`}>
                        <h3 className="text-xl font-black uppercase text-white mb-2">{t.title}</h3>
                        <p className="text-3xl font-black italic text-rugbyRed mb-4">€{t.price}</p>
                        <ul className="space-y-1 mb-4">{t.features?.map((f: string, i: number) => <li key={i} className="text-xs font-bold text-gray-400">✓ {f}</li>)}</ul>
                        {t.recommended && <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed">★ Recommended</span>}
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(t)} className="text-gray-400 hover:text-white bg-black/50 p-1 rounded"><Edit2 size={12} /></button>
                            <button onClick={() => handleDelete(t._id)} className="text-gray-400 hover:text-red-500 bg-black/50 p-1 rounded"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {tickets.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No tickets yet</p>}
        </div>
    );
};

export default AdminTickets;
