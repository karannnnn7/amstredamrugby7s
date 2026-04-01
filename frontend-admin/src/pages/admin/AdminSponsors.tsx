import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Award, UploadCloud, Users, Filter, Hash, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Sponsor } from '../../types';

const AdminSponsors = () => {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [form, setForm] = useState({ name: '', subName: '', role: '', type: 'sub-sponsors' });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSponsors = () => { api.get('/sponsors').then(r => setSponsors(r.data || [])).catch(() => toast.error('Failed to fetch sponsors')); };
    useEffect(() => { fetchSponsors(); }, []);

    const resetForm = () => { 
        setForm({ name: '', subName: '', role: '', type: 'sub-sponsors' }); 
        setFile(null); 
        setPreviewUrl(null);
        setEditId(null); 
        setShowForm(false); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoading(true);
        const fd = new FormData();
        fd.append('name', form.name); 
        fd.append('subName', form.subName); 
        fd.append('role', form.role); 
        fd.append('type', form.type);
        if (file) fd.append('img', file);
        
        try {
            if (editId) { 
                await api.upload(`/sponsors/${editId}`, fd, 'PUT'); 
                toast.success('Sponsor updated successfully'); 
            } else { 
                await api.upload('/sponsors', fd); 
                toast.success('Sponsor created successfully'); 
            }
            fetchSponsors(); 
            resetForm();
        } catch (err: any) { 
            toast.error(err.message); 
        } 
        setLoading(false);
    };

    const handleEdit = (s: Sponsor) => {
        setForm({ name: s.name || '', subName: s.subName || '', role: s.role || '', type: s.type || 'sub-sponsors' });
        setEditId(s._id); 
        setPreviewUrl(s.img || null);
        setShowForm(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this sponsor?')) return;
        try { 
            await api.del(`/sponsors/${id}`); 
            fetchSponsors(); 
            toast.success('Sponsor deleted successfully'); 
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const filteredSponsors = sponsors.filter(s => activeTab === 'all' || s.type === activeTab);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Context Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-sky-">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-/20 flex items-center justify-center border border-sky-/30 text-sky-">
                        <Award size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Sponsors</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage event partners and supporting brands
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-6 md:mt-0 relative z-10 bg-sky- hover:bg-sky- text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]">
                         <Plus size={16} /><span>Add Sponsor</span>
                     </button>
                )}
            </div>

            {showForm ? (
                <div className="animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 order-2 lg:order-1">
                            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-sky-" />
                                
                                <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                        <Award size={16} className="text-sky-" />
                                        <span>{editId ? 'Edit Sponsor Profile' : 'New Sponsor Profile'}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Sponsor Name</label>
                                        <input 
                                            value={form.name} 
                                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-sky- rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm" 
                                            placeholder="Brand Name" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Sponsorship Tier</label>
                                        <select 
                                            value={form.type} 
                                            onChange={(e) => setForm({ ...form, type: e.target.value })} 
                                            className="w-full bg-gray-900/50 border border-white/10 focus:border-sky- rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-sm appearance-none"
                                        >
                                            <option value="official-sponsors">Official/Main Partner</option>
                                            <option value="sub-sponsors">Supporting Sponsor</option>
                                        </select>
                                    </div>

                                    {form.type === 'official-sponsors' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Subtitle / Tagline</label>
                                                <input 
                                                    value={form.subName} 
                                                    onChange={(e) => setForm({ ...form, subName: e.target.value })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-sky- rounded-lg px-4 py-3 text-white transition-all outline-none text-sm" 
                                                    placeholder="Supporting text..." 
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Sponsor Role</label>
                                                <input 
                                                    value={form.role} 
                                                    onChange={(e) => setForm({ ...form, role: e.target.value })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-sky- rounded-lg px-4 py-3 text-white transition-all outline-none text-sm" 
                                                    placeholder="e.g. Official Beverage Partner" 
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="md:col-span-2 mt-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Brand Logo {(form.type === 'official-sponsors') && '(Required for Official)'}</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleFileChange} 
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            />
                                            <div className="bg-gray-900/50 border-2 border-dashed border-white/10 group-hover:border-sky-/50 rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[140px]">
                                                {previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="max-h-[100px] object-contain" />
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform hidden md:flex">
                                                            <UploadCloud className="text-gray-400" size={20} />
                                                        </div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest"><span className="text-sky-">Click to upload</span> or drag and drop</p>
                                                        <p className="text-[10px] text-gray-500 mt-1">SVG, PNG, JPG (Transparent preferred)</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-6">
                                        <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 bg-sky- hover:bg-sky- text-white px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                            <span>{loading ? 'Saving...' : editId ? 'Update Sponsor' : 'Publish Sponsor'}</span>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest">UI Placement Reference</span>
                                </div>
                                <div className="bg-black/50 rounded-lg overflow-hidden border border-white/5 aspect-video flex items-center justify-center relative">
                                    {form.type === 'official-sponsors' ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-800 to-black">
                                            <Star className="text-sky- mb-2" size={24} />
                                            <p className="text-[10px] text-gray-400 uppercase font-black text-center mb-1">Official Sponsor Slot</p>
                                            <div className="w-20 h-10 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-900 font-bold">LOGO</div>
                                            <p className="text-[8px] text-gray-500 mt-2 text-center">Large prominent banner section on Sponsors Page</p>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-800 to-black">
                                            <Users className="text-gray-400 mb-2" size={24} />
                                            <p className="text-[10px] text-gray-400 uppercase font-black text-center mb-1">Sub Sponsor Grid</p>
                                            <div className="flex gap-2 justify-center">
                                                <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] text-gray-900 font-bold">LOGO</div>
                                                <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] text-gray-900 font-bold">LOGO</div>
                                                <div className="w-10 h-6 bg-white border border-gray-200 rounded flex items-center justify-center text-[6px] text-gray-900 font-bold">LOGO</div>
                                            </div>
                                            <p className="text-[8px] text-gray-500 mt-2 text-center">Footer ribbon and supporting page grid</p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-[9px] font-bold text-gray-600 mt-3 text-center uppercase tracking-widest break-all">
                                    Preview rendered natively
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filter Tabs */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel px-4 py-3 rounded-xl">
                        <div className="flex items-center space-x-2 text-sm">
                            <Filter size={16} className="text-gray-500" />
                            <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Filter View:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {[
                                { id: 'all', label: 'All Partners' },
                                { id: 'official-sponsors', label: 'Official' },
                                { id: 'sub-sponsors', label: 'Sub Sponsors' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all flex-grow sm:flex-grow-0 text-center ${
                                        activeTab === tab.id 
                                        ? 'bg-sky-/20 text-sky- border border-sky-/50 shadow-[0_0_10px_rgba(14,165,233,0.2)]'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Grid */}
                    {filteredSponsors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSponsors.map((s) => (
                                <div key={s._id} className="glass-card rounded-xl border border-white/5 p-5 group relative hover:border-sky-/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(14,165,233,0.1)] flex flex-col h-full">
                                    <div className="absolute top-3 right-3 flex space-x-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={() => handleEdit(s)} className="text-gray-300 hover:text-white bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg hover:bg-sky- border border-white/10 transition-colors">
                                            <Edit2 size={12} />
                                        </button>
                                        <button onClick={(e) => handleDelete(s._id, e)} className="text-gray-300 hover:text-white bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg hover:bg-red-600 border border-white/10 transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col h-full">
                                        <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg mb-4 p-4 aspect-video flex-shrink-0 flex items-center justify-center transition-colors relative overflow-hidden">
                                            {s.img ? (
                                                <img src={s.img} className="max-w-full max-h-full object-contain filter drop-shadow-lg" alt={s.name} />
                                            ) : (
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">No Logo</p>
                                            )}
                                            
                                            <div className="absolute top-2 left-2 flex gap-1">
                                                {s.type === 'official-sponsors' ? (
                                                    <span className="bg-sky-/20 text-sky- border border-sky-/20 text-[8px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                                                        <Star size={8} /> Official
                                                    </span>
                                                ) : (
                                                    <span className="bg-white/10 text-gray-300 border border-white/10 text-[8px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest backdrop-blur-md">
                                                        Sub
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <h3 className="text-sm font-black uppercase text-white tracking-widest mb-0.5 truncate">{s.name}</h3>
                                            
                                            {(s.subName || s.role) ? (
                                                <div className="text-[10px] text-gray-400 mt-2 space-y-1">
                                                    {s.role && <p className="font-bold text-sky-/80 truncate border-l-2 border-sky-/50 pl-2">{s.role}</p>}
                                                    {s.subName && <p className="truncate opacity-80 pl-2">{s.subName}</p>}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-gray-600 mt-2 italic pl-2">No additional details</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                            <Award size={48} className="text-gray-800 mb-4" />
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                                No sponsors found in <br/> <span className="text-sky-">{activeTab.replace('-', ' ')}</span> View
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSponsors;
