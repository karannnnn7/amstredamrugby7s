import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, FileText, Users, Trophy, Ticket, Newspaper, Shield, Settings, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/auth';

const defaultPages = [
    { id: 'home', name: 'Home Page', path: '/admin/content?page=home', required: 12 },
    { id: 'tickets', name: 'Tickets Page', path: '/admin/tickets', required: 3 },
    { id: 'teams', name: 'Teams Page', path: '/admin/teams', required: 1 },
    { id: 'news', name: 'News & Media', path: '/admin/news', required: 1 },
    { id: 'rules', name: 'Rules Page', path: '/admin/rules', required: 4 },
    { id: 'sustainability', name: 'Sustainability', path: '/admin/content?page=sustainability', required: 2 },
    { id: 'recycle', name: 'Recycle', path: '/admin/content?page=recycle', required: 3 },
];

const AdminDashboard = () => {
    const { user } = useAuth();
    const [counts, setCounts] = useState({
        images: 0, content: 0, sponsors: 0, teams: 0,
        tickets: 0, news: 0, rules: 0
    });
    
    // For page coverage array: { pageId: string, count: number }
    const [pageContentCounts, setPageContentCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const endpoints = [
            { key: 'images', url: '/images' },
            { key: 'sponsors', url: '/sponsors' },
            { key: 'teams', url: '/teams' },
            { key: 'tickets', url: '/tickets' },
            { key: 'news', url: '/news' },
            { key: 'rules', url: '/rules' },
        ];

        endpoints.forEach(({ key, url }) => {
            api.get(url).then(r => {
                setCounts(prev => ({ ...prev, [key]: r.data?.length || 0 }));
            }).catch(() => { });
        });
        
        // Fetch content separated
        api.get('/content').then(r => {
            const data = r.data || [];
            setCounts(prev => ({ ...prev, content: data.length }));
            
            // Group by page
            const grouped = data.reduce((acc: any, item: any) => {
                const page = item.page || 'unknown';
                acc[page] = (acc[page] || 0) + 1;
                return acc;
            }, {});
            setPageContentCounts(grouped);
        }).catch(() => {});
    }, []);

    const cards = [
        { name: 'Images', count: counts.images, icon: <ImageIcon size={24} />, path: '/admin/images', color: 'from-blue-600/20 to-blue-900/20 text-blue-400 border-blue-500/30' },
        { name: 'Page Sections', count: counts.content, icon: <FileText size={24} />, path: '/admin/content', color: 'from-green-600/20 to-green-900/20 text-green-400 border-green-500/30' },
        { name: 'Sponsors', count: counts.sponsors, icon: <Trophy size={24} />, path: '/admin/sponsors', color: 'from-yellow-600/20 to-yellow-900/20 text-yellow-400 border-yellow-500/30' },
        { name: 'Teams', count: counts.teams, icon: <Users size={24} />, path: '/admin/teams', color: 'from-purple-600/20 to-purple-900/20 text-purple-400 border-purple-500/30' },
        { name: 'Tickets', count: counts.tickets, icon: <Ticket size={24} />, path: '/admin/tickets', color: 'from-rugbyRed/20 to-red-900/20 text-rugbyRed border-rugbyRed/30' },
        { name: 'News', count: counts.news, icon: <Newspaper size={24} />, path: '/admin/news', color: 'from-orange-600/20 to-orange-900/20 text-orange-400 border-orange-500/30' },
        { name: 'Rules', count: counts.rules, icon: <Shield size={24} />, path: '/admin/rules', color: 'from-cyan-600/20 to-cyan-900/20 text-cyan-400 border-cyan-500/30' },
        { name: 'Site Config', count: '—', icon: <Settings size={24} />, path: '/admin/config', color: 'from-gray-600/20 to-gray-900/20 text-gray-400 border-gray-500/30' },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-rugbyRed">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-rugbyRed/10 to-transparent pointer-events-none" />
                <div className="relative z-10 w-full">
                    <h1 className="text-3xl font-black italic uppercase text-white tracking-tight flex items-center gap-3">
                        {getGreeting()}, {user?.userName || 'Admin'}! 👋
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
                        Amsterdam 7s CMS Overview
                    </p>
                </div>
                <div className="mt-4 md:mt-0 glass-card px-4 py-2 rounded-lg flex items-center space-x-2 whitespace-nowrap z-10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">System Active</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4 ml-1">Quick Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <Link
                            key={card.path}
                            to={card.path}
                            className={`glass-card p-6 rounded-xl border-t border-l border-white/5 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-white/5">
                                        {card.icon}
                                    </div>
                                    <ArrowRight size={16} className="text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-3xl font-black italic text-white mb-1">{card.count}</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                    {card.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Page Coverage Table */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-sm font-black uppercase tracking-[0.1em] text-white">Page Status & Coverage</h2>
                    <p className="text-xs font-bold text-gray-500 mt-1">Identify pages missing vital content or configuration</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <th className="px-6 py-4">Page</th>
                                <th className="px-6 py-4">Content Block Status</th>
                                <th className="px-6 py-4 text-right">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {defaultPages.map((page, idx) => {
                                // For content table, mapping actual block counts from Content endpoint
                                // where it applies, otherwise deriving from primary endpoint counts.
                                let statusIcon;
                                let statusText;
                                let statusColor;
                                
                                let currentCount = 0;
                                let requiredCount = page.required;
                                
                                if (page.id === 'home' || page.id === 'sustainability' || page.id === 'recycle') {
                                     currentCount = pageContentCounts[page.id] || 0;
                                } else if (page.id === 'tickets') {
                                     currentCount = counts.tickets;
                                } else if (page.id === 'teams') {
                                     currentCount = counts.teams;
                                } else if (page.id === 'news') {
                                     currentCount = counts.news;
                                } else if (page.id === 'rules') {
                                     currentCount = counts.rules;
                                }

                                if (currentCount >= requiredCount) {
                                    statusIcon = <CheckCircle2 size={16} className="text-green-500" />;
                                    statusText = "Looks Good";
                                    statusColor = "text-green-500 bg-green-500/10 border-green-500/20";
                                } else if (currentCount > 0) {
                                    statusIcon = <AlertCircle size={16} className="text-yellow-500" />;
                                    statusText = "Partial Content";
                                    statusColor = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
                                } else {
                                    statusIcon = <AlertCircle size={16} className="text-red-500" />;
                                    statusText = "Empty / Missing";
                                    statusColor = "text-red-500 bg-red-500/10 border-red-500/20";
                                }

                                return (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{page.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`px-2 py-1 flex items-center space-x-2 rounded border ${statusColor}`}>
                                                    {statusIcon}
                                                    <span className="text-[10px] font-black uppercase tracking-wider">{statusText}</span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-500">({currentCount} / {requiredCount} items)</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                to={page.path} 
                                                className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-rugbyRed hover:text-white transition-colors"
                                            >
                                                <span>Edit</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
