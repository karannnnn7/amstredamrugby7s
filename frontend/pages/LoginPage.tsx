
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
        <div className="bg-deepNavy min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                        Amsterdam <span className="text-rugbyRed">7s</span>
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 border border-white/10 p-10 skew-x-[-2deg]">
                    <div className="skew-x-[2deg]">
                        <div className="flex items-center space-x-3 mb-8">
                            <Lock className="text-rugbyRed" size={24} />
                            <h2 className="text-2xl font-black uppercase italic">Sign In</h2>
                        </div>

                        {error && (
                            <div className="flex items-center space-x-3 bg-rugbyRed/20 border border-rugbyRed/40 p-4 mb-6">
                                <AlertCircle className="text-rugbyRed flex-shrink-0" size={18} />
                                <span className="text-sm font-bold text-rugbyRed uppercase">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Username</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 focus:border-rugbyRed px-4 py-3 pl-12 text-white transition-all outline-none font-bold uppercase"
                                        placeholder="ADMIN"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 focus:border-rugbyRed px-4 py-3 pl-12 text-white transition-all outline-none font-bold"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-rugbyRed hover:bg-red-700 text-white px-8 py-4 font-black uppercase tracking-widest skew-x-[-12deg] transition-all duration-200 active:scale-95 disabled:opacity-50"
                            >
                                <span className="block skew-x-[12deg]">
                                    {loading ? 'Authenticating...' : 'Access Dashboard'}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <a href="#/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-rugbyRed transition-colors">
                                ← Back to Website
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
