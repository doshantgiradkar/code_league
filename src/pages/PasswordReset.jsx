// Password reset page

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const PasswordReset = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(email);
            setSuccess(true);
            toast.success('Password reset email sent!');
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
            toast.error('Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Login
                </button>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-2xl mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent mb-2">
                            Reset Password
                        </h1>
                        <p className="text-slate-400">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <Mail className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-slate-800/30 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Sparkles className="w-5 h-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5" />
                                        Send Reset Link
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Check Your Email</h3>
                            <p className="text-slate-400 mb-6">
                                We've sent a password reset link to <span className="text-cyan-400">{email}</span>
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all"
                            >
                                Return to Login
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PasswordReset;
