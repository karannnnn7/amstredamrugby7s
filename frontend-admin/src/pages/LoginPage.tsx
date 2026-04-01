import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/auth';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, isAdmin } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user && isAdmin) {
            navigate('/admin', { replace: true });
        }
    }, [user, isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Field Lines Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute top-0 bottom-0 left-[20%] w-px bg-white/50" />
                <div className="absolute top-0 bottom-0 right-[20%] w-px bg-white/50" />
            </div>

            {/* Glowing Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rugbyRed/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-up">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2 text-white">
                        AMS <span className="text-rugbyRed">7s</span>
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">Admin Portal</p>
                </div>

                {/* Login Card */}
                <div className={`glass-card p-10 rounded-xl glow-border relative ${error ? 'animate-shake' : ''}`}>
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-rugbyRed/20 flex items-center justify-center">
                            <Lock className="text-rugbyRed" size={20} />
                        </div>
                        <h2 className="text-2xl font-black uppercase italic text-white tracking-tight">Secure Access</h2>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-3 bg-rugbyRed/10 border border-rugbyRed/30 p-4 mb-6 rounded-lg">
                            <AlertCircle className="text-rugbyRed flex-shrink-0" size={18} />
                            <span className="text-sm font-bold text-rugbyRed uppercase">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">Username</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rugbyRed transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-rugbyRed focus:bg-gray-900/80 rounded-lg px-4 py-3.5 pl-12 text-white transition-all outline-none font-bold uppercase"
                                    placeholder="ADMIN"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 block ml-1">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rugbyRed transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-white/10 focus:border-rugbyRed focus:bg-gray-900/80 rounded-lg px-4 py-3.5 pl-12 text-white transition-all outline-none font-bold"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-rugbyRed hover:bg-red-700 text-white rounded-lg px-8 py-4 font-black uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:shadow-[0_0_30px_rgba(225,6,0,0.5)]"
                        >
                            <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-white/10">
                        <a href="#/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center justify-center space-x-2">
                            <span>←</span>
                            <span>Back to Website</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
