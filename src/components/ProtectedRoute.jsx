// Protected Route component with role-based access control

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="text-slate-400 text-lg">Loading...</p>
                </motion.div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if required
    if (requiredRole && userProfile?.role !== requiredRole) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-slate-400 mb-6">
                        You don't have permission to access this page.
                        {requiredRole && ` This page requires ${requiredRole} role.`}
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all"
                    >
                        Go Back
                    </button>
                </motion.div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
