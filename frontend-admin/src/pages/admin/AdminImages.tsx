
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Image } from '../../types';

const AdminImages = () => {
    const [images, setImages] = useState<Image[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [type, setType] = useState('slider');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

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
            toast.success('Image uploaded');
        } catch (err: any) { toast.error(err.message); }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this image?')) return;
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
        if (!confirm(`Are you absolutely sure you want to delete "${cat}" and all its photos?`)) return;

        try {
            // 1. Delete all images of this type
            await api.del(`/images/type/${cat}`);

            // 2. Remove from config
            const updatedCats = categories.filter(c => c !== cat);
            await api.post('/config', { key: 'photo_categories', value: JSON.stringify(updatedCats) });

            setCategories(updatedCats);
            fetchImages(); // Refresh images list
            toast.success('Category and images deleted');
        } catch (err: any) { toast.error(err.message); }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">Images</h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Manage all site images</p>

                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                    <button onClick={() => setShowCatForm(!showCatForm)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto">
                        <span>Manage Categories</span>
                    </button>
                    <button onClick={() => setShowForm(!showForm)} className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors w-full sm:w-auto">
                        <Plus size={16} /><span>{showForm ? 'Cancel' : 'Upload Image'}</span>
                    </button>
                </div>
            </div>

            {/* Category Management */}
            {showCatForm && (
                <div className="bg-gray-800 border border-white/10 p-6 mb-8">
                    <h3 className="text-sm font-black uppercase text-gray-400 mb-4">Photo Categories</h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center bg-gray-700 px-3 py-1 rounded">
                                <span className="text-xs font-bold text-white mr-2">{cat}</span>
                                <button onClick={() => handleDeleteCategory(cat)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                            </div>
                        ))}
                        {categories.length === 0 && <span className="text-gray-500 text-xs italic">No custom categories</span>}
                    </div>

                    <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-2">
                        <div className="w-full md:flex-1">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">New Category Name</label>
                            <input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"
                                placeholder="e.g. 2025 Highlights"
                            />
                        </div>
                        <button type="submit" disabled={!newCategory} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 h-[42px]">
                            Add Category
                        </button>
                    </form>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleUpload} className="bg-gray-800 border border-white/10 p-6 mb-8 space-y-4">
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold">
                            <optgroup label="System">
                                <option value="slider">Home Slider</option>
                                <option value="festival">Festival Section</option>
                                <option value="social">Social Gallery</option>
                                <option value="news">News</option>
                            </optgroup>
                            {categories.length > 0 && (
                                <optgroup label="Photo Categories">
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Image File</label>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-gray-300 text-sm" required />
                    </div>
                    <button type="submit" disabled={loading} className="bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img) => (
                    <div key={img._id} className="relative group bg-gray-800 border border-white/5">
                        <img src={img.img} className="w-full h-40 object-cover" alt="" />
                        <div className="p-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed bg-rugbyRed/10 px-2 py-1 truncate block">{img.type}</span>
                        </div>
                        <button onClick={() => handleDelete(img._id)} className="absolute top-2 right-2 bg-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={14} className="text-white" />
                        </button>
                    </div>
                ))}
            </div>
            {images.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No images uploaded yet</p>}
        </div>
    );
};

export default AdminImages;
