// Enhanced Footer with better design and more features

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  ArrowRight,
  Twitter,
  Linkedin,
  Github,
  Heart,
  Code,
  Zap,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      toast.success('Successfully subscribed to newsletter!');
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }, 1500);
  };

  const productLinks = [
    { name: 'Skill Analysis', href: '/skill-gaps' },
    { name: 'Learning Paths', href: '/learning' },
    { name: 'Job Market', href: '/job-market' },
    { name: 'Resume Upload', href: '/upload-resume' },
    { name: 'Career Roadmap', href: '/career-roadmap' },
  ];

  const resourcesLinks = [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/api' },
    { name: 'Support', href: '/support' },
    { name: 'FAQs', href: '/faq' },
  ];

  const companyLinks = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ];

  const socialLinks = [
    { name: 'Twit', href: 'https://twitter.com', icon: Twitter, color: 'hover:text-sky-400' },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin, color: 'hover:text-blue-400' },
    { name: 'GitHub', href: 'https://github.com', icon: Github, color: 'hover:text-slate-300' },
  ];

  const features = [
    { icon: Zap, text: 'AI-Powered Analysis' },
    { icon: Shield, text: 'Secure & Private' },
    { icon: Code, text: 'Open Source Ready' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-black border-t border-slate-800/50">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 mb-6 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
                      SkillDiff AI
                    </h3>
                    <p className="text-sm text-slate-400">Career Intelligence Platform</p>
                  </div>
                </Link>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  Empowering professionals worldwide to bridge skill gaps and achieve career success through AI-powered insights, personalized learning paths, and real-time job market intelligence.
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/30 border border-slate-700/30 rounded-lg text-xs text-slate-400"
                      >
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/30 hover:border-slate-600 rounded-xl text-slate-400 ${social.color} transition-all duration-200`}
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Product Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-sm font-bold text-white mb-4">Product</h4>
                <ul className="space-y-3">
                  {productLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
                <ul className="space-y-3">
                  {resourcesLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Company Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-sm font-bold text-white mb-4">Company</h4>
                <ul className="space-y-3">
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1 group"
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-sm font-bold text-white mb-4">Newsletter</h4>
                <p className="text-sm text-slate-400 mb-4">Get weekly insights and career tips.</p>
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      disabled={isLoading || isSubscribed}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/30 border border-slate-700/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/50 transition-all duration-300 text-sm disabled:opacity-50"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading || isSubscribed}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-medium rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      'Subscribing...'
                    ) : isSubscribed ? (
                      <>
                        <span>Subscribed!</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>© 2026 SkillDiff AI</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1">
                Crafted with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> for your success
              </span>
            </div>

            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;