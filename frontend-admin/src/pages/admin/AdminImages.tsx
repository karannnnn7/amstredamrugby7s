import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, UploadCloud, FolderEdit, Filter, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Image } from '../../types';

const AdminImages = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [type, setType] = useState('slider');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    // Category management state
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [showCatForm, setShowCatForm] = useState(false);

    const fetchImages = () => {
        api.get('/images').then(r => setImages(r.data || [])).catch(() => toast.error('Failed to fetch images'));
    };

    const fetchCategories = () => {
        api.get('/config').then(r => {
            if (r.data && r.data.photo_categories) {
                try {
                    const parsed = JSON.parse(r.data.photo_categories);
                    if (Array.isArray(parsed)) setCategories(parsed);
                } catch (e) { console.error("Failed to parse categories", e); }
            }
        }).catch(() => { });
    };

    useEffect(() => {
        fetchImages();
        fetchCategories();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        const fd = new FormData();
        fd.append('img', file);
        fd.append('type', type);
        try {
            await api.upload('/images', fd);
            fetchImages();
            setShowForm(false);
            setFile(null);
            toast.success('Image uploaded successfully');
        } catch (err: any) { toast.error(err.message); }
        setLoading(false);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this image?')) return;
        try { await api.del(`/images/${id}`); fetchImages(); toast.success('Image deleted'); } catch (err: any) { toast.error(err.message); }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory) return;
        const updatedCats = [...categories, newCategory];
        try {
            await api.post('/config', { key: 'photo_categories', value: JSON.stringify(updatedCats) });
            setCategories(updatedCats);
            setNewCategory('');
            setShowCatForm(false);
            toast.success('Category added');
        } catch (err: any) { toast.error(err.message); }
    };

    const handleDeleteCategory = async (cat: string) => {
        if (!confirm(`Delete category "${cat}"? This will delete ALL images in this category!`)) return;
        try {
            await api.del(`/images/type/${cat}`);
            const updatedCats = categories.filter(c => c !== cat);
            await api.post('/config', { key: 'photo_categories', value: JSON.stringify(updatedCats) });

            setCategories(updatedCats);
            fetchImages();
            toast.success('Category and images deleted');
        } catch (err: any) { toast.error(err.message); }
    };

    // Derived unique types for tabs, including user custom categories + system ones used
    const allTypes = ['All', ...Array.from(new Set(['slider', 'festival', 'social', 'news', 'recycle', 'sustainability', ...categories]))];
    const filteredImages = activeTab === 'All' ? images : images.filter(img => img.type === activeTab);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-electricBlue">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-electricBlue/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-electricBlue/20 flex items-center justify-center border border-electricBlue/30 text-electricBlue">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Images & Galleries</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage imagery for sliders, page backgrounds, and photo galleries.
                        </p>
                    </div>
                </div>
                <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
                    <button onClick={() => setShowCatForm(!showCatForm)} className="glass-card hover:bg-white/5 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors">
                        <FolderEdit size={16} /><span>Manage Categories</span>
                    </button>
                    <button onClick={() => setShowForm(!showForm)} className="bg-electricBlue hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(31,106,225,0.4)] hover:shadow-[0_0_25px_rgba(31,106,225,0.6)]">
                        {showForm ? <X size={16} /> : <Plus size={16} />}
                        <span>{showForm ? 'Cancel Upload' : 'Upload Image'}</span>
                    </button>
                </div>
            </div>

            {/* Category Management Form */}
            {showCatForm && (
                <div className="glass-card p-6 rounded-xl border border-white/10 animate-slide-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                    <div className="flex items-center space-x-2 mb-6 text-yellow-500">
                        <FolderEdit size={18} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Photo Categories</h3>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center bg-gray-900/80 border border-white/10 px-3 py-1.5 rounded-lg group">
                                <span className="text-xs font-bold text-white mr-2 uppercase tracking-wide">{cat}</span>
                                <button onClick={() => handleDeleteCategory(cat)} className="text-gray-500 hover:text-rugbyRed transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && <span className="text-xs font-bold uppercase tracking-widest text-gray-500 py-1.5">No custom categories</span>}
                    </div>

                    <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row items-end gap-4">
                        <div className="w-full md:flex-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">New Category Name</label>
                            <input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full bg-gray-900/50 border border-white/10 focus:border-yellow-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase"
                                placeholder="E.G. 2025 HIGHLIGHTS"
                            />
                        </div>
                        <button type="submit" disabled={!newCategory} className="w-full md:w-auto bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-bold uppercase text-xs tracking-widest disabled:opacity-50 transition-colors border border-white/5">
                            Add Category
                        </button>
                    </form>
                </div>
            )}

            {/* Upload Form */}
            {showForm && (
                <form onSubmit={handleUpload} className="glass-card p-8 rounded-xl border border-white/10 relative overflow-hidden animate-slide-in">
                     <div className="absolute top-0 left-0 w-1 h-full bg-electricBlue" />
                    <div className="flex items-center space-x-2 mb-6 text-electricBlue">
                        <UploadCloud size={20} />
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Upload New Image</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Destination Type</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value)} 
                                className="w-full bg-gray-900/50 border border-white/10 focus:border-electricBlue rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm appearance-none"
                            >
                                <optgroup label="System Pages">
                                    <option value="slider">Home Slider</option>
                                    <option value="festival">Festival Section</option>
                                    <option value="social">Social Gallery</option>
                                    <option value="news">News Header</option>
                                    <option value="recycle">Recycle Page</option>
                                    <option value="sustainability">Sustainability Page</option>
                                </optgroup>
                                {categories.length > 0 && (
                                    <optgroup label="Custom Categories">
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Select File</label>
                            <div className="relative">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                                    className="w-full bg-gray-900/50 border border-white/10 hover:border-white/30 rounded-lg px-4 py-2.5 text-white transition-all outline-none file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full lg:w-auto bg-electricBlue hover:bg-blue-600 text-white px-10 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(31,106,225,0.4)] flex items-center justify-center space-x-2">
                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        <span>{loading ? 'Uploading...' : 'Confirm Upload'}</span>
                    </button>
                </form>
            )}

            {/* Content Filters & Grid */}
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-2 w-full">
                        <Filter size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                        {allTypes.map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                                    activeTab === t 
                                    ? 'bg-electricBlue text-white shadow-[0_0_10px_rgba(31,106,225,0.3)]' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    
                    <div className="hidden lg:flex items-center space-x-2 text-gray-500 ml-4 pl-4 border-l border-white/10 shrink-0">
                        <LayoutGrid size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">{filteredImages.length} items</span>
                    </div>
                </div>

                {/* Grid */}
                {filteredImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredImages.map((img) => (
                            <div key={img._id} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-electricBlue/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
                                <div className="aspect-square overflow-hidden bg-black/50">
                                    <img 
                                        src={img.img} 
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                                        alt={img.type} 
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-electricBlue bg-electricBlue/10 border border-electricBlue/20 px-2 py-1 rounded truncate max-w-[120px]">
                                            {img.type}
                                        </span>
                                        <button 
                                            onClick={(e) => handleDelete(img._id, e)} 
                                            className="w-8 h-8 rounded-lg bg-rugbyRed/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_4px_10px_rgba(225,6,0,0.4)] hover:scale-110"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                        <ImageIcon size={48} className="text-gray-700 mb-4" />
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No images found for "{activeTab}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminImages;
