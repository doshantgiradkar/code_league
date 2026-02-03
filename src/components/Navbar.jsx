import React, { useState, useEffect } from 'react';
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
  Users,
  Home,
  TrendingUp
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
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

  const navigationLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Skills', href: '/skills', icon: Target },
    { name: 'Learning', href: '/learning', icon: BookOpen },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Resume', href: '/resume', icon: FileText },
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Skill Gap Identified',
      message: 'React.js proficiency needed for your target roles',
      time: '5 min ago',
      unread: true,
      type: 'skill'
    },
    {
      id: 2,
      title: 'Course Recommendation',
      message: 'AWS Certification matches your career path',
      time: '1 hour ago',
      unread: true,
      type: 'learning'
    },
    {
      id: 3,
      title: 'Job Match Found',
      message: '3 new positions match your profile',
      time: '2 hours ago',
      unread: false,
      type: 'job'
    },
  ];

  const userMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Career Roadmap', href: '/roadmap', icon: TrendingUp },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    tap: { scale: 0.95 }
  };

  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { 
      x: '100%',
      opacity: 0 
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: '100%',
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                  SkillGap AI
                </h1>
                <p className="text-xs text-slate-400">Career Intelligence</p>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="font-medium">{link.name}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* Right Section - Search, Notifications, User Menu */}
            <div className="flex items-center gap-3">
              {/* Search Button - Hidden on mobile */}
              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="hidden xl:inline-flex px-2 py-0.5 text-xs font-semibold text-slate-500 bg-slate-900 border border-slate-700 rounded">
                  ⌘K
                </kbd>
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsUserMenuOpen(false);
                  }}
                  className="relative p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Bell className="w-5 h-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  )}
                </motion.button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-80 bg-slate-900 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-800/50">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">Notifications</h3>
                          <button className="text-xs text-cyan-400 hover:text-cyan-300">
                            Mark all read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                            className={`p-4 border-b border-slate-800/50 cursor-pointer ${
                              notification.unread ? 'bg-slate-800/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.unread ? 'bg-cyan-400' : 'bg-transparent'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white mb-1">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-400 mb-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-500">{notification.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-800/50 bg-slate-800/20">
                        <button className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="hidden md:block relative">
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">JD</span>
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-medium text-white">John Doe</p>
                    <p className="text-xs text-slate-400">Student</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      variants={menuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-slate-900 backdrop-blur-xl border border-slate-800/50 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-slate-800/50">
                        <p className="text-sm font-medium text-white">John Doe</p>
                        <p className="text-xs text-slate-400">john.doe@example.com</p>
                      </div>
                      <div className="p-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <motion.a
                              key={item.name}
                              href={item.href}
                              whileHover={{ x: 4, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
                            >
                              <Icon className="w-4 h-4 text-slate-500" />
                              <span className="text-sm">{item.name}</span>
                            </motion.a>
                          );
                        })}
                      </div>
                      <div className="p-2 border-t border-slate-800/50">
                        <motion.button
                          whileHover={{ x: 4, backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 w-80 bg-slate-900 border-l border-slate-800/50 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">SkillGap AI</h2>
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

                {/* User Profile Section */}
                <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center">
                      <span className="text-white font-semibold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">John Doe</p>
                      <p className="text-sm text-slate-400">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.a
                      href="/profile"
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 text-center text-sm bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-all"
                    >
                      Profile
                    </motion.a>
                    <motion.a
                      href="/settings"
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-3 py-2 text-center text-sm bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 transition-all"
                    >
                      Settings
                    </motion.a>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          <span className="font-medium">{link.name}</span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Quick Actions
                  </p>
                  <div className="space-y-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Target className="w-5 h-5" />
                      <span>Analyze Skills</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>Find Jobs</span>
                    </motion.button>
                  </div>
                </div>

                {/* Sign Out */}
                <div className="pt-6 border-t border-slate-800/50">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;