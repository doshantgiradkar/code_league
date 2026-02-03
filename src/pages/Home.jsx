import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  CheckCircle2,
  Star,
  ChevronRight,
  Upload,
  FileText,
  BarChart3,
  Brain,
  Rocket,
  Award,
  Clock,
  Globe
} from 'lucide-react';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow: "0 0 20px rgba(6, 182, 212, 0.25)",
      transition: { type: "spring", stiffness: 400, damping: 15 }
    },
    tap: { scale: 0.98 }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag and drop your resume or choose from your device. Supports all major formats including PDF, DOC, and DOCX.",
      color: "cyan"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your resume content, structure, and formatting to provide comprehensive insights.",
      color: "violet"
    },
    {
      icon: BarChart3,
      title: "Detailed Insights",
      description: "Get actionable feedback on skills, experience, keywords, and formatting to improve your resume's effectiveness.",
      color: "cyan"
    },
    {
      icon: Rocket,
      title: "Instant Results",
      description: "Receive your analysis in seconds with detailed recommendations and improvement suggestions.",
      color: "violet"
    }
  ];

  const stats = [
    { label: "Resumes Analyzed", value: "50K+", icon: FileText },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Time Saved", value: "100K hrs", icon: Clock }
  ];

  const benefits = [
    "ATS-friendly optimization",
    "Keyword density analysis",
    "Industry-specific recommendations",
    "Format and structure review",
    "Skills gap identification",
    "Action verb suggestions"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "Tech Corp",
      avatar: "SC",
      rating: 5,
      text: "This AI resume analyzer helped me land my dream job! The insights were incredibly detailed and actionable."
    },
    {
      name: "Michael Rodriguez",
      role: "Software Engineer",
      company: "StartupXYZ",
      avatar: "MR",
      rating: 5,
      text: "The keyword optimization suggestions increased my interview callback rate by 3x. Absolutely worth it!"
    },
    {
      name: "Emily Taylor",
      role: "Marketing Director",
      company: "Growth Inc",
      avatar: "ET",
      rating: 5,
      text: "Professional, fast, and incredibly insightful. I've recommended this to my entire team."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120,119,198,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120,119,198,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)'
          }}
        />
        
        {/* Glowing Orbs */}
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute top-1/4 -left-20 w-96 h-96 rounded-full"
          style={{
            background: 'rgb(6 182 212 / 0.05)',
            filter: 'blur(80px)'
          }}
        />
        <motion.div
          variants={pulseVariants}
          animate="pulse"
          className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full"
          style={{
            background: 'rgb(139 92 246 / 0.05)',
            filter: 'blur(80px)',
            animationDelay: '1s'
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">AI-Powered Resume Analysis</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={itemVariants}>
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
              style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              Transform Your
              <br />
              Resume with AI
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto">
            Get instant, actionable insights to optimize your resume for ATS systems and hiring managers. 
            Land more interviews with our advanced AI analysis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full sm:w-auto py-4 px-8 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-lg"
            >
              <span>Upload Resume</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full sm:w-auto py-4 px-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <span>Watch Demo</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Hero Image/Card Placeholder */}
          <motion.div
            variants={cardVariants}
            className="relative max-w-4xl mx-auto"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                {/* Animated elements in placeholder */}
                <motion.div
                  variants={floatVariants}
                  animate="animate"
                  className="relative z-10"
                >
                  <FileText className="w-24 h-24 text-cyan-400/30" />
                </motion.div>
                
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '32px 32px'
                  }}
                />
              </div>

              {/* Stats overlay */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
                  >
                    <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 mb-6">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-slate-300">Powerful Features</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
              style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}
            >
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive analysis and actionable insights 
              to help you create a winning resume.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl hover:border-cyan-500/30 transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    feature.color === 'cyan' 
                      ? 'from-cyan-600/20 to-cyan-400/20 border border-cyan-500/30' 
                      : 'from-violet-600/20 to-violet-400/20 border border-violet-500/30'
                  } flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${
                      feature.color === 'cyan' ? 'text-cyan-400' : 'text-violet-400'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-4 py-24 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 mb-6">
                <Award className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">Why Choose Us</span>
              </div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
                style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}
              >
                Stand Out From
                <br />
                The Competition
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Our advanced AI technology ensures your resume gets past applicant tracking 
                systems and catches the attention of hiring managers.
              </p>

              <motion.button
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="py-4 px-8 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold rounded-xl flex items-center gap-2 transition-all duration-300"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl"
            >
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600/20 to-cyan-400/20 border border-cyan-500/30 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-slate-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-slate-300">Testimonials</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
              style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}
            >
              Loved by Professionals
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join thousands of successful job seekers who've improved their resumes with our AI platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-300 mb-6">"{testimonial.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-violet-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-cyan-600/10 to-violet-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full filter blur-3xl" />
            </div>

            <div className="relative z-10">
              <motion.div
                variants={floatVariants}
                animate="animate"
                className="inline-block mb-6"
              >
                <Shield className="w-16 h-16 text-cyan-400 mx-auto" />
              </motion.div>

              <h2 
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
                style={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}
              >
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Upload your resume now and get instant AI-powered insights to help you land your dream job.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  className="py-4 px-8 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-lg"
                >
                  <span>Start Free Analysis</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  className="py-4 px-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                >
                  <Globe className="w-5 h-5" />
                  <span>View Pricing</span>
                </motion.button>
              </div>

              <p className="text-sm text-slate-400 mt-6">
                No credit card required • Free analysis • Instant results
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms</a></li>
                <li><a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold text-lg">Resume AI</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2026 Resume AI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;