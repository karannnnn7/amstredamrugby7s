import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import api from '../../services/api';

const pages = ["home", "tickets", "enter-team", "teams", "visitors", "rules", "sustainability", "recycle", "photos", "charity"];

const sectionConfig: Record<string, { value: string; label: string; fields: string[] }[]> = {
    home: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'event-date', label: 'Event Date', fields: ['heading'] },
        { value: 'stat-elite-teams', label: 'Stat: Elite Teams', fields: ['heading'] },
        { value: 'stat-global-fans', label: 'Stat: Global Fans', fields: ['heading'] },
        { value: 'stat-djs-acts', label: 'Stat: DJs & Acts', fields: ['heading'] },
        { value: 'stat-prize-pool', label: 'Stat: Prize Pool', fields: ['heading'] },
        { value: 'festival-intro', label: 'Festival: Main Text', fields: ['body'] },
        { value: 'festival-stages', label: 'Festival: Main Stages', fields: ['heading', 'subheading'] },
        { value: 'festival-village', label: 'Festival: Fan Village', fields: ['heading', 'subheading'] },
        { value: 'festival-market', label: 'Festival: Street Market', fields: ['heading', 'subheading'] },
        { value: 'festival-vip', label: 'Festival: VIP Lounges', fields: ['heading', 'subheading'] }
    ],
    tickets: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'group-discount', label: 'Group Discount', fields: ['heading', 'body'] }
    ],
    "enter-team": [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    teams: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    visitors: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    rules: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    photos: [
        { value: 'hero', label: 'Main Content', fields: ['heading', 'subheading'] }
    ],
    sustainability: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'intro', label: 'Intro Content', fields: ['heading', 'body', 'subheading'] }
    ],
    charity: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'intro', label: 'Intro Content', fields: ['heading', 'body', 'subheading'] }
    ],
    recycle: [
        { value: 'hero', label: 'Hero Section', fields: ['heading', 'subheading'] },
        { value: 'cycle', label: 'Cycle Section', fields: ['heading'] },
        { value: 'rewards', label: 'Rewards Section', fields: ['heading', 'subheading', 'body'] }
    ]
};

const AdminContent = () => {
    const [content, setContent] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ page: 'home', section: '', heading: '', subheading: '', body: '', ctaText: '', ctaLink: '', order: 0 });
    const [loading, setLoading] = useState(false);

    const fetchContent = () => {
        api.get('/content').then(r => setContent(r.data || [])).catch(() => { });
    };

    useEffect(() => { fetchContent(); }, []);
    const resetForm = () => {
        setForm({ page: 'home', section: '', heading: '', subheading: '', body: '', ctaText: '', ctaLink: '', order: 0 });
        setEditId(null);
        setShowForm(false);
    };

    // Determine available sections and visible fields
    const availableSections = sectionConfig[form.page] || [];
    const currentSectionConfig = availableSections.find(s => s.value === form.section);
    // If no config found (rare/custom), show all fields. Otherwise use strict fields.
    const visibleFields = currentSectionConfig ? currentSectionConfig.fields : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await api.put(`/content/${editId}`, form);
            } else {
                await api.post('/content', form);
            }
            fetchContent();
            resetForm();
        } catch (err: any) { alert(err.message); }
        setLoading(false);
    };

    const handleEdit = (item: any) => {
        setForm({
            page: item.page, section: item.section, heading: item.heading || '',
            subheading: item.subheading || '', body: item.body || '',
            ctaText: item.ctaText || '', ctaLink: item.ctaLink || '', order: item.order || 0,
        });
        setEditId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this content block?')) return;
        try { await api.del(`/content/${id}`); fetchContent(); } catch (err: any) { alert(err.message); }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">Page Content</h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Manage text blocks across all pages</p>
                </div>
                {!showForm && (
                    <button onClick={() => { resetForm(); setShowForm(true); }} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-3 font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2">
                        <Plus size={16} /><span>Add Content</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-gray-800 border border-white/10 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Page</label>
                                <select
                                    value={form.page}
                                    onChange={(e) => {
                                        const newPage = e.target.value;
                                        // Reset section when page changes
                                        const newSections = sectionConfig[newPage] || [];
                                        // Auto-select first section if it's the ONLY one
                                        const defaultSection = newSections.length > 0 ? newSections[0].value : '';
                                        setForm({ ...form, page: newPage, section: defaultSection });
                                    }}
                                    className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"
                                    disabled={!!editId}
                                >
                                    {pages.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            {/* Show Selector ONLY if multiple sections exist */}
                            {availableSections.length > 1 && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Section</label>
                                    <select
                                        value={form.section}
                                        onChange={(e) => setForm({ ...form, section: e.target.value })}
                                        className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold"
                                        disabled={!!editId}
                                    >
                                        <option value="" disabled>Select Section</option>
                                        {availableSections.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* If manually entering section (fallback) */}
                            {availableSections.length === 0 && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Section Name</label>
                                    <input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" placeholder="e.g. hero" required disabled={!!editId} />
                                </div>
                            )}

                            {visibleFields.includes('heading') && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                                        {form.section.startsWith('stat-') ? 'Value (Number Only)' : form.section === 'event-date' ? 'Date Text (e.g. MAY 16-18)' : form.section.startsWith('festival-') ? 'Feature Title' : 'Heading'}
                                    </label>
                                    <textarea value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} rows={3} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" placeholder={form.section.startsWith('stat-') ? "120" : form.section === 'event-date' ? "MAY 16-18" : "Line 1\nLine 2\nLast Line (Style)"} />
                                </div>
                            )}

                            {visibleFields.includes('subheading') && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                                        {form.section.startsWith('festival-') ? 'Feature Description' : 'Subheading'}
                                    </label>
                                    <input value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" />
                                </div>
                            )}

                            {visibleFields.includes('body') && (
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
                                        {form.section === 'festival-intro' ? 'Main Description Paragraph' : 'Body'}
                                    </label>
                                    <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" />
                                </div>
                            )}

                            {visibleFields.includes('ctaText') && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">CTA Text</label>
                                    <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" />
                                </div>
                            )}

                            {visibleFields.includes('ctaLink') && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">CTA Link</label>
                                    <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" />
                                </div>
                            )}

                            {visibleFields.includes('order') && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">Order</label>
                                    <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} className="bg-gray-700 text-white px-4 py-2 border border-white/10 w-full outline-none font-bold" />
                                </div>
                            )}

                            <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
                                <button type="submit" disabled={loading} className="w-full md:w-auto bg-rugbyRed hover:bg-red-700 text-white px-6 py-2 font-bold uppercase text-xs disabled:opacity-50 flex items-center justify-center space-x-2">
                                    <Save size={14} /><span>{loading ? 'Saving...' : editId ? 'Update' : 'Create'}</span>
                                </button>
                                <button type="button" onClick={() => { resetForm(); }} className="w-full md:w-auto bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 font-bold uppercase text-xs flex items-center justify-center space-x-2">
                                    <X size={14} /><span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-1 order-1 lg:order-2">
                        {form.section && (
                            <div className="bg-gray-800 border border-white/10 p-4 sticky top-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-2">Section Preview</label>
                                <img
                                    key={`${form.page}-${form.section}`}
                                    src={`/assets/admin-previews/${
                                        // Case 1: Single Section Page -> Use pagename.webp
                                        availableSections.length === 1
                                            ? form.page
                                            // Case 2: Home Page Grouping
                                            : form.page === 'home' && form.section.startsWith('stat-')
                                                ? 'home-stats'
                                                : form.page === 'home' && form.section.startsWith('festival-')
                                                    ? 'home-festival'
                                                    // Case 3: Default -> pagename-section.webp
                                                    : `${form.page}-${form.section}`
                                        }.webp`}
                                    onLoad={(e) => (e.currentTarget.style.display = 'block')}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                    alt={`${form.section} preview`}
                                    className="w-full h-auto object-cover border border-white/5"
                                />
                                <p className="text-[10px] text-gray-600 mt-2 text-center break-words">Ref: {
                                    availableSections.length === 1
                                        ? `${form.page}.webp`
                                        : form.page === 'home' && form.section.startsWith('stat-')
                                            ? 'home-stats.webp'
                                            : form.page === 'home' && form.section.startsWith('festival-')
                                                ? 'home-festival.webp'
                                                : `${form.page}-${form.section}.webp`
                                }</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {content.map((item) => (
                    <div key={item._id} className="bg-gray-800 border border-white/5 p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-white/10 transition-colors gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rugbyRed bg-rugbyRed/10 px-2 py-1 min-w-[80px] text-center w-fit">{item.page}</span>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-500 w-fit">{item.section}</span>
                            <span className="text-sm font-bold text-gray-200 break-all">{item.heading || item.body?.substring(0, 50) || '—'}</span>
                        </div>
                        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                            <button onClick={() => handleEdit(item)} className="text-gray-500 hover:text-white p-2 bg-white/5 rounded md:bg-transparent"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(item._id)} className="text-gray-500 hover:text-red-500 p-2 bg-white/5 rounded md:bg-transparent"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            {content.length === 0 && <p className="text-gray-500 text-center py-12 font-bold uppercase">No content blocks yet</p>}
        </div >
    );
};

export default AdminContent;
