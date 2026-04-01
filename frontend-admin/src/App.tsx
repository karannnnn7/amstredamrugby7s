import React from 'react';
import { Toaster } from 'react-hot-toast';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminImages from './pages/admin/AdminImages';
import AdminSponsors from './pages/admin/AdminSponsors';
import AdminTeams from './pages/admin/AdminTeams';
import AdminTickets from './pages/admin/AdminTickets';
import AdminNews from './pages/admin/AdminNews';
import AdminRules from './pages/admin/AdminRules';
import AdminConfig from './pages/admin/AdminConfig';
import AdminButtons from './pages/admin/AdminButtons';

// New Individual Content Pages
import AdminPageHome from './pages/admin/pages/AdminPageHome';
import AdminPageTickets from './pages/admin/pages/AdminPageTickets';
import AdminPageTeams from './pages/admin/pages/AdminPageTeams';
import AdminPageVisitors from './pages/admin/pages/AdminPageVisitors';
import AdminPageRules from './pages/admin/pages/AdminPageRules';
import AdminPageSustainability from './pages/admin/pages/AdminPageSustainability';
import AdminPageRecycle from './pages/admin/pages/AdminPageRecycle';
import AdminPagePhotos from './pages/admin/pages/AdminPagePhotos';
import AdminPageCharity from './pages/admin/pages/AdminPageCharity';
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
                        <Route index element={<Navigate to="/admin/page/home" replace />} />
                        <Route path="images" element={<AdminImages />} />
                        <Route path="page/home" element={<AdminPageHome />} />
                        <Route path="page/tickets" element={<AdminPageTickets />} />
                        <Route path="page/teams" element={<AdminPageTeams />} />
                        <Route path="page/visitors" element={<AdminPageVisitors />} />
                        <Route path="page/rules" element={<AdminPageRules />} />
                        <Route path="page/sustainability" element={<AdminPageSustainability />} />
                        <Route path="page/recycle" element={<AdminPageRecycle />} />
                        <Route path="page/photos" element={<AdminPagePhotos />} />
                        <Route path="page/charity" element={<AdminPageCharity />} />
                        <Route path="sponsors" element={<AdminSponsors />} />
                        <Route path="teams" element={<AdminTeams />} />
                        <Route path="tickets" element={<AdminTickets />} />
                        <Route path="news" element={<AdminNews />} />
                        <Route path="rules" element={<AdminRules />} />
                        <Route path="config" element={<AdminConfig />} />
                        <Route path="buttons" element={<AdminButtons />} />
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
