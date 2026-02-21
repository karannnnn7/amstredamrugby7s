
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { NewsItem } from '../../types';

const AdminNews = () => {
    // ... logic ...
    const [news, setNews] = useState<NewsItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', excerpt: '', category: 'Tournament', date: '' });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchNews = () => { api.get('/news').then(r => setNews(r.data || [])).catch(() => toast.error('Failed to fetch news')); };
    useEffect(() => { fetchNews(); }, []);

    const resetForm = () => { setForm({ title: '', excerpt: '', category: 'Tournament', date: '' }); setFile(null); setEditId(null); setShowForm(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true);
        const fd = new FormData();
        fd.append('title', form.title); fd.append('excerpt', form.excerpt); fd.append('category', form.category); fd.append('date', form.date);
        if (file) fd.append('img', file);
        try {
            if (editId) { await api.upload(`/news/${editId}`, fd, 'PUT'); toast.success('News article updated'); }
            else { await api.upload('/news', fd); toast.success('News article created'); }
            fetchNews(); resetForm();
        } catch (err: any) { toast.error(err.message); } setLoading(false);
    };

    const handleEdit = (n: NewsItem) => {
        setForm({ title: n.title, excerpt: n.excerpt || '', category: n.category || 'Tournament', date: n.date || '' });
        setEditId(n._id); setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete news item?')) return;
        try { await api.del(`/news/${id}`); fetchNews(); toast.success('News article deleted'); } catch (err: any) { toast.error(err.message); }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">News</h1>

                </div>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2">
                    {showForm ? <><X size={16} /><span>Cancel</span></> : <><Plus size={16} /><span>Add News</span></>}
                </button>
            </div>

            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" required /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"><option>Tournament</option><option>Tickets</option><option>Festival</option><option>Community</option></select></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Date</label><input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" placeholder="March 2025" /></div>
                            <div><label className="text-xs font-black uppercase text-gray-400 block mb-2">Image</label><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-gray-300 text-sm" /></div>
                            <div className="md:col-span-2"><label className="text-xs font-black uppercase text-gray-400 block mb-2">Excerpt</label><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" /></div>
                            <div className="md:col-span-2"><button type="submit" disabled={loading} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 flex items-center justify-center"><Save size={14} className="inline mr-2" />{loading ? 'Saving...' : editId ? 'Update' : 'Create'}</button></div>
                        </form>
                    </div>
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-gray-800 border border-white/10 p-4 sticky top-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Section Preview</label>
                            <img
                                src="/assets/admin-previews/news.webp"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                alt="News Section Preview"
                                className="w-full h-auto object-cover border border-white/5 opacity-75 hover:opacity-100 transition-opacity"
                            />
                            <p className="text-[10px] text-gray-600 mt-2 text-center">Ref: news.webp</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {news.map((n) => (
                    <div key={n._id} className="bg-gray-800 border border-white/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-white/10 group gap-4">
                        <div className="flex items-center space-x-4 w-full">
                            {n.img && <img src={n.img} className="w-16 h-12 object-cover" alt="" />}
                            <div className="flex-1">
                                <span className="font-bold text-white block">{n.title}</span>
                                <div className="flex space-x-3 mt-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed">{n.category}</span>
                                    <span className="text-[10px] font-bold text-gray-500">{n.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2 w-full md:w-auto justify-end">
                            <button onClick={() => handleEdit(n)} className="text-gray-500 hover:text-white p-2 bg-white/5 rounded md:bg-transparent"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(n._id)} className="text-gray-500 hover:text-red-500 p-2 bg-white/5 rounded md:bg-transparent"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {news.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No news yet</p>}
        </div>
    );
};

export default AdminNews;
