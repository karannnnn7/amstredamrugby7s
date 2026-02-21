
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Team } from '../../types';

const AdminTeams = () => {
    // ... logic ...
    const [teams, setTeams] = useState<Team[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', country: '', category: 'ELITE MEN', color: 'bg-gray-600' });
    const [loading, setLoading] = useState(false);

    const fetchTeams = () => { api.get('/teams').then(r => setTeams(r.data || [])).catch(() => toast.error('Failed to fetch teams')); };
    useEffect(() => { fetchTeams(); }, []);

    const resetForm = () => { setForm({ name: '', country: '', category: 'ELITE MEN', color: 'bg-gray-600' }); setEditId(null); setShowForm(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        try {
            if (editId) { await api.put(`/teams/${editId}`, form); toast.success('Team updated'); }
            else { await api.post('/teams', form); toast.success('Team created'); }
            fetchTeams(); resetForm();
        } catch (err: any) { toast.error(err.message); } setLoading(false);
    };

    const handleEdit = (t: Team) => {
        setForm({ name: t.name, country: t.country || '', category: t.category || 'ELITE MEN', color: t.color || 'bg-gray-600' });
        setEditId(t._id); setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete team?')) return;
        try { await api.del(`/teams/${id}`); fetchTeams(); toast.success('Team deleted'); } catch (err: any) { toast.error(err.message); }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">Teams</h1>

                </div>
                {!showForm && (
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center space-x-2">
                        <Plus size={16} /><span>Add Team</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/10 p-6 grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"><option>ELITE MEN</option><option>ELITE WOMEN</option><option>SOCIAL</option><option>VETS</option></select></div>
                            <div className="flex flex-col md:flex-row items-end gap-4">
                                <button type="submit" disabled={loading} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 flex items-center justify-center space-x-2"><Save size={14} className="inline mr-2" />{loading ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
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
                                src="/assets/admin-previews/teams-page.webp"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                alt="Teams Preview"
                                className="w-full h-auto object-cover border border-white/5"
                            />
                            <p className="text-[10px] text-gray-600 mt-2 text-center">Ref: teams-page.webp</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {teams.map((t) => (
                    <div key={t._id} className="bg-gray-800 border border-white/5 p-4 flex items-center justify-between hover:border-white/10">
                        <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 ${t.color || 'bg-gray-600'} flex items-center justify-center font-black text-xs`}>{t.name?.charAt(0)}</div>
                            <span className="font-bold text-white">{t.name}</span>
                            <span className="text-xs text-gray-500 font-bold">{t.country}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed bg-rugbyRed/10 px-2 py-1">{t.category}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEdit(t)} className="text-gray-500 hover:text-white p-2"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(t._id)} className="text-gray-500 hover:text-red-500 p-2"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {teams.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No teams yet</p>}
        </div>
    );
};

export default AdminTeams;
