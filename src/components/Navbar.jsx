// Enhanced Navbar with auth integration and user info display

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  BarChart3,
  BookOpen,
  Briefcase,
  FileText,
  Target,
  Home,
  TrendingUp,
  Map,
  Mail
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsNotificationOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  const navigationLinks = user ? [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Skills', href: '/skill-gaps', icon: Target },
    { name: 'Learning', href: '/learning', icon: BookOpen },
    { name: 'Job Market', href: '/job-market', icon: Briefcase },
    { name: 'Roadmap', href: '/career-roadmap', icon: Map },
  ] : [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: BookOpen },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const userMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Career Roadmap', href: '/career-roadmap', icon: TrendingUp },
    { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
    { name: 'Settings', href: '/profile', icon: Settings },
  ];

  // Get user initials
  const getUserInitials = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserRole = () => {
    return userProfile?.role || 'Learner';
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                  SkillDiff AI
                </h1>
                <p className="text-xs text-slate-400">Career Intelligence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* User Menu */}
                  <div className="hidden md:block relative" ref={userMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsUserMenuOpen(!isUserMenuOpen);
                        setIsNotificationOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
                      </div>
                      <div className="hidden xl:block text-left">
                        <p className="text-sm font-medium text-white">{userProfile?.displayName || 'User'}</p>
                        <p className="text-xs text-slate-400">{getUserRole()}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''
                        }`} />
                    </motion.button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="absolute right-0 mt-2 w-56 bg-slate-900 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="p-3 border-b border-slate-800/50">
                            <p className="text-sm font-medium text-white truncate">{userProfile?.displayName || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                          </div>
                          <div className="p-2">
                            {userMenuItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                                >
                                  <Icon className="w-4 h-4 text-slate-500" />
                                  <span className="text-sm">{item.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                          <div className="p-2 border-t border-slate-800/50">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span className="text-sm">Sign Out</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-violet-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-violet-500 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800/50 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">SkillDiff AI</h2>
                      <p className="text-xs text-slate-400">Career Intelligence</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {user && (
                  <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                        <span className="text-white font-semibold">{getUserInitials()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{userProfile?.displayName || 'User'}</p>
                        <p className="text-sm text-slate-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.name}
                          to={link.href}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          <span className="font-medium">{link.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Auth Buttons or Logout */}
                {user ? (
                  <div className="pt-6 border-t border-slate-800/50">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-slate-800/50 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center bg-slate-800/50 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-medium rounded-lg transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;