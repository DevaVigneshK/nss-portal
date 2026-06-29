import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import EventDetails from "./pages/EventDetails";
import AttendancePage from "./pages/AttendancePage";
import CertificatePage from "./pages/CertificatePage";
import DashboardRedirect from "./pages/Dashboard/DashboardRedirect";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function MainLayout({ children }) {
    const { user } = useContext(AuthContext);
    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes without Sidebar */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-login" element={<Login portal="admin" />} />
                    <Route path="/register" element={<Register />} />

                    {/* Standard Pages with MainLayout */}
                    <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                    <Route path="/leaderboard" element={<MainLayout><Leaderboard /></MainLayout>} />
                    
                    {/* Protected general routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <MainLayout><DashboardRedirect /></MainLayout>
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <MainLayout><Profile /></MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/events" element={<MainLayout><Home /></MainLayout>} />
                    <Route path="/events/:id" element={<MainLayout><EventDetails /></MainLayout>} />

                    {/* Student Protected Routes */}
                    <Route path="/attendance/scan" element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <MainLayout><AttendancePage /></MainLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/certificates" element={
                        <ProtectedRoute allowedRoles={["student"]}>
                            <MainLayout><CertificatePage /></MainLayout>
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
