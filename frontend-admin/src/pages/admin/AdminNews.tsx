import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Newspaper, Image as ImageIcon, LayoutList, Calendar, MapPin, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { NewsItem } from '../../types';

const CATEGORIES = ['All', 'Tournament', 'Tickets', 'Festival', 'Community'];

const AdminNews = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: '', excerpt: '', category: 'Tournament', date: '' });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fetchNews = () => { 
        api.get('/news').then(r => setNews(r.data || [])).catch(() => toast.error('Failed to fetch news articles')); 
    };
    
    useEffect(() => { 
        fetchNews(); 
    }, []);

    const resetForm = () => { 
        setForm({ title: '', excerpt: '', category: 'Tournament', date: '' }); 
        setFile(null); 
        setPreviewUrl(null);
        setEditId(null); 
        setShowForm(false); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        const fd = new FormData();
        fd.append('title', form.title); 
        fd.append('excerpt', form.excerpt); 
        fd.append('category', form.category); 
        fd.append('date', form.date);
        if (file) fd.append('img', file);
        
        try {
            if (editId) { 
                await api.upload(`/news/${editId}`, fd, 'PUT'); 
                toast.success('News article updated successfully'); 
            } else { 
                await api.upload('/news', fd); 
                toast.success('News article published successfully'); 
            }
            fetchNews(); 
            resetForm();
        } catch (err: any) { 
            toast.error(err.message); 
        } 
        setLoading(false);
    };

    const handleEdit = (n: NewsItem) => {
        setForm({ 
            title: n.title, 
            excerpt: n.excerpt || '', 
            category: n.category || 'Tournament', 
            date: n.date || '' 
        });
        setPreviewUrl(n.img || null);
        setEditId(n._id); 
        setShowForm(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this news article?')) return;
        try { 
            await api.del(`/news/${id}`); 
            fetchNews(); 
            toast.success('News article deleted successfully'); 
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const filteredNews = activeTab === 'All' ? news : news.filter(n => n.category === activeTab);

    // Get color based on category
    const getCategoryColor = (cat: string) => {
        switch(cat) {
            case 'Tournament': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'Tickets': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Festival': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Community': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-orange-500">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 text-orange-500">
                        <Newspaper size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">News Updates</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage tournament announcements and articles
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-6 md:mt-0 relative z-10 bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]">
                         <Plus size={16} /><span>Compose Article</span>
                     </button>
                )}
            </div>

            {showForm ? (
                <div className="animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-80" />
                                
                                <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                        <Newspaper size={16} className="text-orange-500" />
                                        <span>{editId ? 'Edit Article Details' : 'Compose New Article'}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Headline</label>
                                        <input 
                                            value={form.title} 
                                            onChange={(e) => setForm({ ...form, title: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-lg" 
                                            required 
                                            placeholder="Enter attention-grabbing headline..." 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Category</label>
                                        <select 
                                            value={form.category} 
                                            onChange={(e) => setForm({ ...form, category: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm appearance-none"
                                        >
                                            <option>Tournament</option>
                                            <option>Tickets</option>
                                            <option>Festival</option>
                                            <option>Community</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Publish Date</label>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="relative w-full sm:w-1/3 shrink-0">
                                                <input 
                                                    type="date"
                                                    onChange={(e) => {
                                                        const d = new Date(e.target.value);
                                                        if(!isNaN(d.getTime())) {
                                                            const m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                                                            setForm({ ...form, date: `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` });
                                                        }
                                                    }}
                                                    className="w-full h-full bg-gray-900/50 border border-white/10 focus:border-orange-500 rounded-lg px-3 py-3 text-white transition-all outline-none text-sm font-bold [color-scheme:dark]" 
                                                />
                                            </div>
                                            <div className="relative flex-1">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                    <Calendar size={16} />
                                                </div>
                                                <input 
                                                    value={form.date} 
                                                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 border-dashed focus:border-orange-500 rounded-lg pl-10 pr-4 py-3 text-white transition-all outline-none text-sm font-bold" 
                                                    placeholder="e.g. October 12, 2025" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Article Excerpt</label>
                                        <textarea 
                                            value={form.excerpt} 
                                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })} 
                                            rows={4} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-orange-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm leading-relaxed" 
                                            required 
                                            placeholder="Enter a brief summary or the first paragraph of the article..."
                                        />
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Cover Image</label>
                                        <div className="flex items-start space-x-4">
                                            <label className="flex-1 cursor-pointer">
                                                <div className="w-full bg-gray-900/50 border-2 border-dashed border-white/10 hover:border-orange-500/50 rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center group">
                                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-colors">
                                                        <ImageIcon size={24} className="text-gray-400 group-hover:text-orange-500" />
                                                    </div>
                                                    <p className="text-sm font-bold text-white mb-1">Click to browse or drag image here</p>
                                                    <p className="text-xs text-gray-500">Supports JPG, PNG, WebP (Max 5MB)</p>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                                </div>
                                            </label>
                                            
                                            {previewUrl && (
                                                <div className="w-40 h-40 shrink-0 rounded-xl border border-white/10 overflow-hidden relative group">
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Preview</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6 border-t border-white/5 pt-6">
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                            <span>{loading ? 'Publishing...' : editId ? 'Update Article' : 'Publish Article'}</span>
                                        </button>
                                        <button type="button" onClick={() => resetForm()} className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-white/10 text-white px-8 py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors">
                                            <X size={16} /><span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* Reference / Structural Preview Pane */}
                        <div className="lg:col-span-1 order-1 lg:order-2">
                            <div className="glass-card p-4 rounded-xl border border-white/10 sticky top-4">
                                <div className="flex items-center space-x-2 mb-4 text-gray-400 pb-2 border-b border-white/5">
                                    <Hash size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Layout Reference</span>
                                </div>
                                <div className="text-center">
                                    <img
                                        src="/assets/admin-previews/news.webp"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                        alt="News Section Preview"
                                        className="w-full h-auto object-cover border border-white/5 rounded-lg shadow-lg"
                                    />
                                    <div className="hidden py-8 bg-gray-900 border border-white/5 rounded-lg border-dashed">
                                        <ImageIcon size={24} className="text-gray-600 mx-auto mb-2" />
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Preview unavailable</p>
                                    </div>
                                </div>
                                <p className="text-[9px] font-bold text-gray-600 mt-4 text-center uppercase tracking-widest">
                                    Used in homepage news slider
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filter Tabs */}
                    <div className="flex overflow-x-auto pb-2 scrollbar-none space-x-2 animate-slide-in">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeTab === cat 
                                        ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                                        : 'glass-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {filteredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-up animate-delay-100">
                            {filteredNews.map((n) => (
                                <div key={n._id} className="glass-card rounded-2xl relative group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border border-white/5 overflow-hidden shadow-lg">
                                    {/* Image Section - Large Thumbnail */}
                                    <div className="h-48 w-full relative overflow-hidden bg-gray-900">
                                        {n.img ? (
                                            <img src={n.img} alt={n.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon size={32} className="text-gray-800" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                                        
                                        {/* Colored category badge */}
                                        <div className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border backdrop-blur-md ${getCategoryColor(n.category || '')}`}>
                                            {n.category}
                                        </div>

                                        <div className="absolute top-3 right-3 flex space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/50 backdrop-blur-md rounded-lg p-1 border border-white/10">
                                            <button onClick={() => handleEdit(n)} className="text-gray-300 hover:text-white hover:bg-orange-500 p-1.5 rounded transition-colors tooltip-trigger relative">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={(e) => handleDelete(n._id, e)} className="text-gray-300 hover:text-white hover:bg-red-600 p-1.5 rounded transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-6 flex flex-col flex-1 relative z-10">
                                        <h3 className="text-lg font-black uppercase text-white leading-tight mb-3 line-clamp-2" title={n.title}>{n.title}</h3>
                                        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-6 flex-1">
                                            {n.excerpt || 'No excerpt provided for this article.'}
                                        </p>
                                        
                                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-auto border-t border-white/5 pt-4">
                                            <Calendar size={12} />
                                            <span>{n.date || 'No Date'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                            <Newspaper size={48} className="text-gray-800 mb-4" />
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                                No articles found in this category. <br/> <span className="text-orange-500">Compose one to keep users updated</span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminNews;
