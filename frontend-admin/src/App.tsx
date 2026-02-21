import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminImages from './pages/admin/AdminImages';
import AdminContent from './pages/admin/AdminContent';
import AdminSponsors from './pages/admin/AdminSponsors';
import AdminTeams from './pages/admin/AdminTeams';
import AdminTickets from './pages/admin/AdminTickets';
import AdminNews from './pages/admin/AdminNews';
import AdminRules from './pages/admin/AdminRules';
import AdminConfig from './pages/admin/AdminConfig';
import { AuthProvider } from './context/auth';

const AppContent: React.FC = () => {
    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen flex flex-col font-sans antialiased bg-deepNavy text-white">
                <Routes>
                    <Route path="/" element={<Navigate to="/admin" replace />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="images" element={<AdminImages />} />
                        <Route path="content" element={<AdminContent />} />
                        <Route path="sponsors" element={<AdminSponsors />} />
                        <Route path="teams" element={<AdminTeams />} />
                        <Route path="tickets" element={<AdminTickets />} />
                        <Route path="news" element={<AdminNews />} />
                        <Route path="rules" element={<AdminRules />} />
                        <Route path="config" element={<AdminConfig />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </HashRouter>
    );
};

export default App;
