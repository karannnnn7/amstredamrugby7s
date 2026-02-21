
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Sponsor } from '../../types';

const AdminSponsors = () => {
    // ... logic ...
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', subName: '', role: '', type: 'sub-sponsors' });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSponsors = () => { api.get('/sponsors').then(r => setSponsors(r.data || [])).catch(() => toast.error('Failed to fetch sponsors')); };
    useEffect(() => { fetchSponsors(); }, []);

    const resetForm = () => { setForm({ name: '', subName: '', role: '', type: 'sub-sponsors' }); setFile(null); setEditId(null); setShowForm(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        const fd = new FormData();
        fd.append('name', form.name); fd.append('subName', form.subName); fd.append('role', form.role); fd.append('type', form.type);
        if (file) fd.append('img', file);
        try {
            if (editId) { await api.upload(`/sponsors/${editId}`, fd, 'PUT'); toast.success('Sponsor updated'); }
            else { await api.upload('/sponsors', fd); toast.success('Sponsor created'); }
            fetchSponsors(); resetForm();
        } catch (err: any) { toast.error(err.message); } setLoading(false);
    };

    const handleEdit = (s: Sponsor) => {
        setForm({ name: s.name || '', subName: s.subName || '', role: s.role || '', type: s.type || 'sub-sponsors' });
        setEditId(s._id); setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete sponsor?')) return;
        try { await api.del(`/sponsors/${id}`); fetchSponsors(); toast.success('Sponsor deleted'); } catch (err: any) { toast.error(err.message); }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">Sponsors</h1>

                </div>
                {!showForm && (
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2">
                        <Plus size={16} /><span>Add Sponsor</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"><option value="official-sponsors">Official</option><option value="sub-sponsors">Sub Sponsor</option></select></div>
                            {form.type === 'official-sponsors' && (
                                <>
                                    <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Sub Name</label><input value={form.subName} onChange={(e) => setForm({ ...form, subName: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" /></div>
                                    <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Role</label><input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" /></div>
                                    <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Logo</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-gray-300 text-sm" /></div>
                                </>
                            )}
                            <div className="flex flex-col md:flex-row items-end md:col-span-2 gap-4">
                                <button type="submit" disabled={loading} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 flex items-center justify-center"><Save size={14} className="inline mr-2" />{loading ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={() => { resetForm(); }} className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 font-bold uppercase text-xs flex items-center justify-center space-x-2">
                                    <X size={14} /><span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-gray-800 border border-white/10 p-4 sticky top-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Page Preview</p>
                            <img
                                src="/assets/admin-previews/sponsors-page.webp"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                alt="Sponsors Preview"
                                className="w-full h-auto object-cover border border-white/5"
                            />
                            <p className="text-[10px] text-gray-600 mt-2 text-center">Ref: sponsors-page.webp</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {sponsors.map((s) => (
                    <div key={s._id} className="bg-gray-800 border border-white/5 p-4 group relative">
                        {s.img && <img src={s.img} className="w-full h-24 object-contain bg-white/5 mb-3 p-2" alt="" />}
                        <h3 className="text-sm font-black uppercase text-white">{s.name}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed">{s.type}</span>
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(s)} className="text-gray-400 hover:text-white bg-black/50 p-1 rounded"><Edit2 size={12} /></button>
                            <button onClick={() => handleDelete(s._id)} className="text-gray-400 hover:text-red-500 bg-black/50 p-1 rounded"><Trash2 size={12} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {sponsors.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No sponsors yet</p>}
        </div>
    );
};

export default AdminSponsors;
