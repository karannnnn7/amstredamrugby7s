import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, FileText, MessageSquare, ChevronDown, ChevronUp, Link as LinkIcon, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { SectionField } from './sectionConfig';

interface Props {
    pageName: string;
    pageTitle: string;
    sections: SectionField[];
}

const AdminPageContentEditor: React.FC<Props> = ({ pageName, pageTitle, sections }) => {
    const [content, setContent] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    
    // Default form state pointing to this specific page
    const [form, setForm] = useState({ 
        page: pageName, 
        section: sections.length > 0 ? sections[0].value : '', 
        heading: '', 
        subheading: '', 
        body: '', 
        bodyItems: [] as string[],
        ctaText: '', 
        ctaLink: '', 
        order: 0 
    });
    const [loading, setLoading] = useState(false);

    const fetchContent = () => {
        api.get('/content').then(r => setContent(r.data || [])).catch(() => toast.error('Failed to fetch content'));
    };

    useEffect(() => { 
        fetchContent(); 
        // Sync form default section when props change
        setForm(prev => ({ ...prev, page: pageName, section: sections.length > 0 ? sections[0].value : '' }));
    }, [pageName, sections]);

    const resetForm = () => {
        setForm({ 
            page: pageName, 
            section: sections.length > 0 ? sections[0].value : '', 
            heading: '', 
            subheading: '', 
            body: '', 
            bodyItems: [],
            ctaText: '', 
            ctaLink: '', 
            order: 0 
        });
        setEditId(null);
        setShowForm(false);
    };

    // Determine currently visible fields based on selected section
    const currentSectionConfig = sections.find(s => s.value === form.section);
    const visibleFields = currentSectionConfig ? currentSectionConfig.fields : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editId) {
                await api.put(`/content/${editId}`, form);
                toast.success('Content updated successfully');
            } else {
                await api.post('/content', form);
                toast.success('Content created successfully');
            }
            fetchContent();
            resetForm();
        } catch (err: any) { toast.error(err.message); }
        setLoading(false);
    };

    const handleEdit = (item: any) => {
        setForm({
            page: item.page, section: item.section, heading: item.heading || '',
            subheading: item.subheading || '', body: item.body || '',
            bodyItems: item.bodyItems || [],
            ctaText: item.ctaText || '', ctaLink: item.ctaLink || '', order: item.order || 0,
        });
        setEditId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this content block?')) return;
        try { 
            await api.del(`/content/${id}`); 
            fetchContent(); 
            toast.success('Content block deleted');
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Filter content globally for just THIS page
    const filteredContent = content.filter(c => c.page === pageName);
    
    // Group filtered content by section
    const groupedContent = filteredContent.reduce((acc, item) => {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header Banner */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-green-500">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-green-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30 text-green-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">{pageTitle} Content</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Manage text, headings, and CTAs for the {pageTitle}
                        </p>
                    </div>
                </div>
                {!showForm && (
                     <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-6 md:mt-0 relative z-10 bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]">
                         <Plus size={16} /><span>Add Content Block</span>
                     </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
                {showForm ? (
                    <div className="animate-slide-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center space-x-2">
                                <MessageSquare size={16} className="text-green-500" />
                                <span>{editId ? `Edit ${pageName.toUpperCase()} Block` : `New Content for ${pageName.toUpperCase()}`}</span>
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-xl border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Show Selector ONLY if multiple sections exist */}
                                        {sections.length > 1 && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Target Section</label>
                                                <select
                                                    value={form.section}
                                                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-xs appearance-none"
                                                    disabled={!!editId}
                                                >
                                                    <option value="" disabled>Select Section</option>
                                                    {sections.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                                </select>
                                            </div>
                                        )}

                                        {/* If manually entering section (fallback) */}
                                        {sections.length === 0 && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Section Internal Name</label>
                                                <input 
                                                    value={form.section} 
                                                    onChange={(e) => setForm({ ...form, section: e.target.value })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold uppercase text-xs" 
                                                    placeholder="E.G. HERO" 
                                                    required 
                                                    disabled={!!editId} 
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="md:col-span-2 my-2 border-t border-white/5" />

                                        {visibleFields.includes('heading') && form.section !== 'event-date' && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 ml-1">
                                                    {form.section.startsWith('stat-') ? 'Value (Number Only)' : form.section.startsWith('festival-') ? 'Feature Title' : 'Primary Heading'}
                                                </label>
                                                <textarea 
                                                    value={form.heading} 
                                                    onChange={(e) => setForm({ ...form, heading: e.target.value })} 
                                                    rows={2} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-sm" 
                                                    placeholder={form.section.startsWith('stat-') ? "120" : "Enter main heading here..."} 
                                                />
                                            </div>
                                        )}

                                        {visibleFields.includes('heading') && form.section === 'event-date' && (
                                            <div className="md:col-span-2 glass-card p-4 rounded-xl border border-white/10 bg-black/20">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-4 ml-1">
                                                    Select Tournament Dates
                                                </label>
                                                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                                                    <div className="w-full">
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Start Date</span>
                                                        <input 
                                                            type="date" 
                                                            onChange={(e) => {
                                                                const d = new Date(e.target.value);
                                                                if(isNaN(d.getTime())) return;
                                                                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                                                                const startStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
                                                                let newHeading = startStr;
                                                                if (form.heading.includes('-')) {
                                                                    const parts = form.heading.split('-');
                                                                    newHeading = startStr + (parts[1].trim() ? '-' + parts[1] : '');
                                                                }
                                                                setForm({ ...form, heading: newHeading });
                                                            }}
                                                            className="w-full bg-gray-900/80 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-sm [color-scheme:dark]"
                                                        />
                                                    </div>
                                                    <span className="text-gray-600 font-bold mt-4 shrink-0">TO</span>
                                                    <div className="w-full">
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest ml-1 mb-1 block">End Date</span>
                                                        <input 
                                                            type="date" 
                                                            onChange={(e) => {
                                                                const d = new Date(e.target.value);
                                                                if(isNaN(d.getTime())) return;
                                                                const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                                                                const endStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;
                                                                const endDay = d.getDate();
                                                                let startPart = form.heading.split('-')[0].trim() || 'TBD';
                                                                
                                                                // Smart format: if same month, just append the day (e.g. JUNE 6-7)
                                                                let finalEndStr = `-${endStr}`;
                                                                if (startPart.startsWith(monthNames[d.getMonth()])) {
                                                                    finalEndStr = `-${endDay}`;
                                                                }
                                                                setForm({ ...form, heading: `${startPart}${finalEndStr}` });
                                                            }}
                                                            className="w-full bg-gray-900/80 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-sm [color-scheme:dark]"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-900 border border-white/5 rounded-lg p-3">
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mr-2 flex items-center mb-1"><Hash size={12} className="mr-1"/> FINAL PUBLIC TEXT:</span>
                                                    <input 
                                                        value={form.heading} 
                                                        onChange={(e) => setForm({ ...form, heading: e.target.value })} 
                                                        className="bg-transparent text-white font-black tracking-widest text-sm outline-none w-full border-b border-transparent focus:border-green-500 transition-colors"
                                                        placeholder="e.g. JUNE 6-7"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {visibleFields.includes('subheading') && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 ml-1">
                                                    {form.section.startsWith('festival-') ? 'Feature Description' : 'Secondary Heading / Subtext'}
                                                </label>
                                                <textarea 
                                                    value={form.subheading} 
                                                    onChange={(e) => setForm({ ...form, subheading: e.target.value })} 
                                                    rows={2}
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm" 
                                                    placeholder="Enter supporting text..."
                                                />
                                            </div>
                                        )}

                                        {visibleFields.includes('body') && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 ml-1">
                                                    {form.section === 'festival-intro' ? 'Main Description Paragraph' : 'Body Paragraph Content'}
                                                </label>
                                                <textarea 
                                                    value={form.body} 
                                                    onChange={(e) => setForm({ ...form, body: e.target.value })} 
                                                    rows={5} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none text-sm" 
                                                    placeholder="Write detailed content here..."
                                                />
                                            </div>
                                        )}

                                        {visibleFields.includes('bodyItems') && (
                                            <div className="md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 ml-1">
                                                    Bullet Point Items
                                                </label>
                                                <div className="space-y-3">
                                                    {form.bodyItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <input 
                                                                value={item}
                                                                onChange={(e) => {
                                                                    const newItems = [...form.bodyItems];
                                                                    newItems[idx] = e.target.value;
                                                                    setForm({ ...form, bodyItems: newItems });
                                                                }}
                                                                className="flex-1 bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-xs" 
                                                                placeholder="Enter bullet point text..."
                                                            />
                                                            <button type="button" onClick={() => {
                                                                const newItems = [...form.bodyItems];
                                                                newItems.splice(idx, 1);
                                                                setForm({ ...form, bodyItems: newItems });
                                                            }} className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-white/10 shrink-0">
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button type="button" onClick={() => setForm({ ...form, bodyItems: [...form.bodyItems, ''] })} className="flex items-center justify-center w-full py-3 border border-dashed border-white/20 hover:border-green-500 text-gray-500 hover:text-green-400 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest gap-2">
                                                        <Plus size={14} /> Add Bullet Point
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {visibleFields.includes('ctaText') && (
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 ml-1 flex items-center gap-2"><Hash size={12}/> Button Text</label>
                                                <input 
                                                    value={form.ctaText} 
                                                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-xs" 
                                                    placeholder="e.g. GET TICKETS"
                                                />
                                            </div>
                                        )}

                                        {visibleFields.includes('ctaLink') && (
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-green-400 block mb-2 ml-1 flex items-center gap-2"><LinkIcon size={12}/> Button URL Link</label>
                                                <input 
                                                    value={form.ctaLink} 
                                                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-xs"
                                                    placeholder="e.g. /tickets or https://..."
                                                />
                                            </div>
                                        )}

                                        {visibleFields.includes('order') && (
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2 ml-1">Sort Order (Optional)</label>
                                                <input 
                                                    type="number" 
                                                    value={form.order} 
                                                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} 
                                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-green-500 rounded-lg px-4 py-3 text-white transition-all outline-none font-bold text-xs" 
                                                />
                                            </div>
                                        )}

                                        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
                                            <button type="submit" disabled={loading} className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-500 text-white px-8 py-3.5 rounded-lg font-black uppercase text-xs tracking-widest disabled:opacity-50 flex items-center justify-center space-x-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                                                <span>{loading ? 'Saving...' : editId ? 'Update Content' : 'Publish Content'}</span>
                                            </button>
                                            <button type="button" onClick={() => resetForm()} className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-white/10 text-white px-8 py-3.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center space-x-2 transition-colors">
                                                <X size={16} /><span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>


                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-up glass-panel p-6 rounded-2xl min-h-[400px]">
                         <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                             <div>
                                 <h2 className="text-xl font-black italic uppercase tracking-widest text-white">{pageName.toUpperCase()}'S CONTENT</h2>
                                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                     {filteredContent.length} active blocks configured on this page
                                 </p>
                             </div>
                         </div>

                         {filteredContent.length > 0 ? (
                            <div className="space-y-4">
                                {(Object.entries(groupedContent) as [string, any[]][]).map(([sectionName, items]) => {
                                    const isExpanded = expandedSections[sectionName] !== false; // default to true
                                    const configLabel = sections.find(s => s.value === sectionName)?.label || sectionName;
                                    
                                    return (
                                        <div key={sectionName} className="glass-card rounded-xl border border-white/5 overflow-hidden transition-all duration-300">
                                            {/* Accordion Header */}
                                            <div 
                                                className="px-6 py-4 bg-gray-900/50 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                                onClick={() => toggleSection(sectionName)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Hash size={16} className="text-green-500" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-white">{configLabel}</span>
                                                    <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{items.length} items</span>
                                                </div>
                                                <div className="text-gray-500">
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </div>

                                            {/* Accordion Body */}
                                            <div className={`transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100 p-4 border-t border-white/5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                                <div className="space-y-3">
                                                    {items.map((item) => (
                                                        <div key={item._id} className="bg-gray-900/40 border border-white/5 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between hover:border-green-500/30 hover:bg-white/5 transition-all group">
                                                            <div className="flex-1 min-w-0 pr-4 w-full">
                                                                {item.heading && (
                                                                    <h4 className="text-sm font-black text-white mb-1 truncate">{item.heading}</h4>
                                                                )}
                                                                {item.subheading && (
                                                                    <p className="text-xs font-bold text-gray-400 mb-1 truncate">{item.subheading}</p>
                                                                )}
                                                                {item.body && (
                                                                    <p className="text-[10px] font-medium text-gray-500 line-clamp-2 leading-relaxed">{item.body}</p>
                                                                )}
                                                                {(!item.heading && !item.subheading && !item.body) && (
                                                                    <p className="text-xs italic text-gray-600">No text content defined</p>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex items-center space-x-2 mt-4 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0 w-full md:w-auto justify-end">
                                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="text-gray-500 hover:text-white p-2.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all shadow-sm">
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button onClick={(e) => handleDelete(item._id, e)} className="text-gray-500 hover:text-white p-2.5 bg-gray-800 rounded-lg hover:bg-red-600 hover:shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                         ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                                <FileText size={48} className="text-gray-800 mb-4" />
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center px-4">
                                    No content blocks configured for <br/> <span className="text-green-500">{pageName}</span> page
                                </p>
                            </div>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageContentEditor;
