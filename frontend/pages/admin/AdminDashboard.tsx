
import React, { useState, useEffect } from 'react';
import { Image, FileText, Users, Trophy, Ticket, Newspaper, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
    const [counts, setCounts] = useState({
        images: 0, content: 0, sponsors: 0, teams: 0,
        tickets: 0, news: 0, rules: 0
    });

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
    }, []);

    const cards = [
        { name: 'Images', count: counts.images, icon: <Image size={28} />, path: '/admin/images', color: 'bg-blue-500/20 text-blue-400' },
        { name: 'Page Content', count: counts.content, icon: <FileText size={28} />, path: '/admin/content', color: 'bg-green-500/20 text-green-400' },
        { name: 'Sponsors', count: counts.sponsors, icon: <Trophy size={28} />, path: '/admin/sponsors', color: 'bg-yellow-500/20 text-yellow-400' },
        { name: 'Teams', count: counts.teams, icon: <Users size={28} />, path: '/admin/teams', color: 'bg-purple-500/20 text-purple-400' },
        { name: 'Tickets', count: counts.tickets, icon: <Ticket size={28} />, path: '/admin/tickets', color: 'bg-red-500/20 text-red-400' },
        { name: 'News', count: counts.news, icon: <Newspaper size={28} />, path: '/admin/news', color: 'bg-orange-500/20 text-orange-400' },
        { name: 'Rules', count: counts.rules, icon: <Shield size={28} />, path: '/admin/rules', color: 'bg-cyan-500/20 text-cyan-400' },
        { name: 'Site Config', count: '—', icon: <Settings size={28} />, path: '/admin/config', color: 'bg-gray-500/20 text-gray-400' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black italic uppercase text-white tracking-tight">Dashboard</h1>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Content Management Overview</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Link
                        key={card.path}
                        to={card.path}
                        className="bg-gray-800 border border-white/5 hover:border-rugbyRed/30 p-6 transition-all group"
                    >
                        <div className={`w-12 h-12 ${card.color} flex items-center justify-center mb-4 rounded`}>
                            {card.icon}
                        </div>
                        <h3 className="text-3xl font-black italic text-white">{card.count}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mt-1 group-hover:text-rugbyRed transition-colors">
                            {card.name}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
