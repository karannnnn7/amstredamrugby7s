
import React from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import {
    Image, FileText, Users, Trophy, Ticket, Newspaper, Shield, Settings,
    LayoutDashboard, LogOut, ChevronRight, Menu, X
} from 'lucide-react';

const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Images', path: '/admin/images', icon: <Image size={18} /> },
    { name: 'Page Content', path: '/admin/content', icon: <FileText size={18} /> },
    { name: 'Sponsors', path: '/admin/sponsors', icon: <Trophy size={18} /> },
    { name: 'Teams', path: '/admin/teams', icon: <Users size={18} /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <Ticket size={18} /> },
    { name: 'News', path: '/admin/news', icon: <Newspaper size={18} /> },
    { name: 'Rules', path: '/admin/rules', icon: <Shield size={18} /> },
    { name: 'Site Config', path: '/admin/config', icon: <Settings size={18} /> },
];

const AdminLayout = () => {
    const { user, isAdmin, isLoading, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Close sidebar on route change (mobile)
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white font-bold uppercase tracking-widest animate-pulse">Loading...</div>
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
        <div className="min-h-screen bg-gray-900 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden bg-gray-950 border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-40">
                <Link to="/" className="flex items-center space-x-2">
                    <h2 className="text-lg font-black italic uppercase tracking-tight text-white">
                        AMS <span className="text-rugbyRed">7s</span>
                    </h2>
                </Link>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2">
                    {isSidebarOpen ? <LogOut size={24} className="rotate-180" /> : <LayoutDashboard size={24} />}
                    {/* Using existing icons slightly creatively to avoid import errors if Menu/X missing, 
                        Wait, imports are at top. Let's start by fixing imports if needed but for now sticking to safe icons or assuming Menu is available?
                        The original file imported: Image, FileText, Users, Trophy, Ticket, Newspaper, Shield, Settings, LayoutDashboard, LogOut, ChevronRight
                        It did NOT import Menu or X (X was imported).
                        Let's reuse X. For Menu, I'll use LayoutDashboard or just add Menu to import if I can.
                        Actually, replace_file_content replaces the whole component, so I can't easily change imports at the TOP of the file without a separate call.
                        I'll use 'Settings' as a hamburger placeholder or just 'Menu' text if I have to, 
                        OR better: I can include the import update in a multi_replace or just assume I can edit the top separately.
                        The instruction was to replace the component. 
                        Let's use a simpler approach: I'll stick to icons present or simple text if needed, 
                        BUT wait, I can modify the imports too if I target them.
                        Let's assumes I can't see the top of the file in this tool call easily.
                        Actually, I can see lines 1-107 in previous turn.
                        Imports are lines 5-8.
                        I will use a multi_replace to do both safely.
                    */}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-white/5 flex flex-col 
                transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo (Desktop) */}
                <div className="p-6 border-b border-white/5 hidden lg:block shrink-0">
                    <Link to="/" className="block">
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white">
                            Amsterdam <span className="text-rugbyRed">7s</span>
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-1">Admin Panel</p>
                    </Link>
                </div>

                {/* Mobile Sidebar Header (Logo + Close) */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between lg:hidden shrink-0">
                    <span className="text-xl font-black italic uppercase text-white">Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
                    {sidebarLinks.map((link) => {
                        const isActive = location.pathname === link.path ||
                            (link.path !== '/admin' && location.pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-3 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-all ${isActive
                                    ? 'text-rugbyRed bg-rugbyRed/10 border-r-2 border-rugbyRed'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                                {isActive && <ChevronRight size={14} className="ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User */}
                <div className="p-4 border-t border-white/5 shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black uppercase text-white">{user?.username}</p>
                            <p className="text-[10px] font-bold uppercase text-gray-600">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-rugbyRed transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-x-hidden w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
