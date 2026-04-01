import React from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import {
    Image, FileText, Users, Trophy, Ticket, Newspaper, Shield, Settings,
    LayoutDashboard, LogOut, ChevronRight, X, Link as LinkIcon, Menu,
    Home, Globe, Recycle, Camera
} from 'lucide-react';

const sidebarGroups = [
    {
        title: 'Website Pages',
        links: [
            { name: 'Home Page', path: '/admin/page/home', subtitle: 'Hero, Intro, Festival', icon: <Home size={18} /> },
            { name: 'Tickets Page', path: '/admin/page/tickets', subtitle: 'Tiers & Pricing', icon: <Ticket size={18} /> },
            { name: 'Teams Page', path: '/admin/page/teams', subtitle: 'Packages & Registration', icon: <Users size={18} /> },
            { name: 'Visitors Page', path: '/admin/page/visitors', subtitle: 'Info & Timeline', icon: <Users size={18} /> },
            { name: 'Rules Page', path: '/admin/page/rules', subtitle: 'Hero Text', icon: <Shield size={18} /> },
            { name: 'Sustainability', path: '/admin/page/sustainability', subtitle: 'Overview text', icon: <Recycle size={18} /> },
            { name: 'Recycle', path: '/admin/page/recycle', subtitle: 'App & Rewards', icon: <Recycle size={18} /> },
            { name: 'Photos', path: '/admin/page/photos', subtitle: 'Photos Text', icon: <Camera size={18} /> },
            { name: 'Charity', path: '/admin/page/charity', subtitle: 'SNSG text', icon: <Globe size={18} /> },
            { name: 'News & Media', path: '/admin/news', subtitle: 'Articles & Updates', icon: <Newspaper size={18} /> },
            { name: 'Images', path: '/admin/images', subtitle: 'Sliders & Galleries', icon: <Image size={18} /> },
        ]
    },
    {
        title: 'Management',
        links: [
            { name: 'Tickets Manager', path: '/admin/tickets', subtitle: 'Add/Edit Products', icon: <Ticket size={18} /> },
            { name: 'Teams Manager', path: '/admin/teams', subtitle: 'Add/Edit Packages', icon: <Users size={18} /> },
            { name: 'Rules Manager', path: '/admin/rules', subtitle: 'Tournament Rules', icon: <Shield size={18} /> },
            { name: 'Sponsors', path: '/admin/sponsors', subtitle: 'Logos & Partners', icon: <Trophy size={18} /> },
        ]
    },
    {
        title: 'Site Config',
        links: [
            { name: 'Button Links', path: '/admin/buttons', subtitle: 'CTAs & URLs', icon: <LinkIcon size={18} /> },
            { name: 'Global Settings', path: '/admin/config', subtitle: 'Dates, Contact, SEO', icon: <Settings size={18} /> },
        ]
    }
];

const AdminLayout = () => {
    const { user, isAdmin, isLoading, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-rugbyRed/20 border-t-rugbyRed rounded-full animate-spin mb-4" />
                <div className="text-white font-bold uppercase tracking-widest animate-pulse">Loading Admin...</div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="h-screen w-full bg-gray-950 flex flex-col lg:flex-row text-white overflow-hidden selection:bg-rugbyRed/30">
            {/* Mobile Header (Only visible on small screens) */}
            <div className="lg:hidden shrink-0 bg-gray-900/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-40">
                <Link to="/admin" className="flex items-center space-x-2">
                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
                        AMS <span className="text-rugbyRed">7s</span>
                    </h2>
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-gray-900/90 backdrop-blur-xl border-r border-white/5 flex flex-col shrink-0
                transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:h-full lg:overflow-hidden
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'}
            `}>
                {/* Logo (Desktop & Mobile Panel) */}
                <div className="p-6 border-b border-white/5 shrink-0 flex items-center justify-between">
                    <Link to="/admin" className="block group">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-gray-200 transition-colors">
                            Amsterdam <span className="text-rugbyRed group-hover:animate-pulse-glow">7s</span>
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">Admin Panel</p>
                    </Link>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 min-h-0 py-4 overflow-y-auto custom-scrollbar">
                    {sidebarGroups.map((group, idx) => (
                        <div key={idx} className="mb-6">
                            <h3 className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.links.map((link) => {
                                    // Handle active state including sub-paths
                                    const isActive = location.pathname === link.path ||
                                        (link.path !== '/admin' && location.pathname.startsWith(link.path));
                                    
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`group flex items-center justify-between px-6 py-3 transition-all relative
                                                ${isActive ? 'bg-rugbyRed/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                                            `}
                                        >
                                            {/* Active Glow Indicator */}
                                            {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rugbyRed shadow-[0_0_10px_rgba(225,6,0,0.8)]" />
                                            )}

                                            <div className="flex items-center space-x-3">
                                                <div className={`transition-colors ${isActive ? 'text-rugbyRed' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                                    {link.icon}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold uppercase tracking-wide">{link.name}</span>
                                                    <span className={`text-[10px] uppercase font-bold tracking-widest mt-0.5 ${isActive ? 'text-rugbyRed/70' : 'text-gray-600'}`}>
                                                        {link.subtitle}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {isActive && <ChevronRight size={14} className="text-rugbyRed animate-slide-in opacity-50" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* View Live Site Button */}
                <div className="px-6 py-4 border-t border-white/5">
                    <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-widest transition-colors border border-white/5 hover:border-white/10">
                        <Globe size={14} />
                        <span>View Live Site</span>
                    </a>
                </div>

                {/* User */}
                <div className="p-4 bg-gray-900 border-t border-white/5 shrink-0">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-rugbyRed/20 flex items-center justify-center border border-rugbyRed/30">
                                <span className="text-xs font-black text-rugbyRed">{user?.userName?.charAt(0).toUpperCase() || 'A'}</span>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-white truncate max-w-[100px]">{user?.userName}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-rugbyRed p-2 hover:bg-rugbyRed/10 rounded transition-all"
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto overflow-x-hidden h-full">
                {/* Subtle Content Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950 to-deepNavy/20 pointer-events-none -z-10" />
                
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-slide-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
