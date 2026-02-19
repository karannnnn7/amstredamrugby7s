
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import api from '../../services/api';

const AdminRules = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', category: 'match-format', rules: '', order: 0 });
    const [loading, setLoading] = useState(false);

    const fetchRules = () => { api.get('/rules').then(r => setRules(r.data || [])).catch(() => { }); };
    useEffect(() => { fetchRules(); }, []);

    const resetForm = () => { setForm({ title: '', category: 'match-format', rules: '', order: 0 }); setEditId(null); setShowForm(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        const data = { ...form, rules: form.rules.split('\n').filter(Boolean) };
        try {
            if (editId) { await api.put(`/rules/${editId}`, data); }
            else { await api.post('/rules', data); }
            fetchRules(); resetForm();
        } catch (err: any) { alert(err.message); } setLoading(false);
    };

    const handleEdit = (r: any) => {
        setForm({ title: r.title, category: r.category || 'match-format', rules: (r.rules || []).join('\n'), order: r.order || 0 });
        setEditId(r._id); setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete rule section?')) return;
        try { await api.del(`/rules/${id}`); fetchRules(); } catch (err: any) { alert(err.message); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div><h1 className="text-3xl font-black italic uppercase text-white">Rules</h1></div>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center space-x-2">
                    {showForm ? <><X size={16} /><span>Cancel</span></> : <><Plus size={16} /><span>Add Rule Section</span></>}
                </button>
            </div>

            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/10 p-6 grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"><option value="match-format">Match Format</option><option value="scoring">Scoring</option><option value="discipline">Discipline</option><option value="eligibility">Eligibility</option></select></div>
                            <div className="col-span-2"><label className="text-xs font-black uppercase text-gray-400 block mb-2">Rules (one per line)</label><textarea value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} rows={5} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" /></div>
                            <div className="flex items-end"><button type="submit" disabled={loading} className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50"><Save size={14} className="inline mr-2" />{loading ? 'Saving...' : editId ? 'Update' : 'Create'}</button></div>
                        </form>
                    </div>
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-gray-800 border border-white/10 p-4 sticky top-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Section Preview</label>
                            <img
                                src="/assets/admin-previews/rules-list.png"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                alt="Rules Page Preview"
                                className="w-full h-auto object-cover border border-white/5 opacity-75 hover:opacity-100 transition-opacity"
                            />
                            <p className="text-[10px] text-gray-600 mt-2 text-center">Ref: rules-list.png</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {rules.map((r) => (
                    <div key={r._id} className="bg-gray-800 border border-white/5 p-4 hover:border-white/10 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed bg-rugbyRed/10 px-2 py-1">{r.category}</span>
                                <span className="font-bold text-white">{r.title}</span>
                                <span className="text-xs text-gray-500">{r.rules?.length || 0} rules</span>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
                                <button onClick={() => handleEdit(r)} className="text-gray-500 hover:text-white p-2"><Edit2 size={14} /></button>
                                <button onClick={() => handleDelete(r._id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {rules.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No rules yet</p>}
        </div>
    );
};

export default AdminRules;
