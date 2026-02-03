import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  Shield,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { USER_ROLES } from '../lib/constants';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.LEARNER, // Default to learner role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal Info Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setErrors({});

      try {
        const displayName = `${formData.firstName} ${formData.lastName}`;
        await register(formData.email, formData.password, displayName, formData.role);

        setSuccess(true);
        toast.success('Account created successfully!');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        toast.error(error.message || 'Registration failed');
        setErrors({ email: 'Registration failed. Please try again.' });
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

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
        damping: 15,
        delay: 0.3
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

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (formData.password.length >= 12) strength += 25;
    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength += 25;
    if (/\d/.test(formData.password)) strength += 15;
    if (/[^a-zA-Z\d]/.test(formData.password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength < 40) return 'from-red-500 to-red-400';
    if (strength < 70) return 'from-yellow-500 to-yellow-400';
    return 'from-green-500 to-green-400';
  };

  const getStrengthText = () => {
    const strength = passwordStrength();
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleGitHubSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">Join Our Platform</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent"
            style={{ lineHeight: 1, letterSpacing: '-0.02em' }}
          >
            Create Account
          </h1>
          <p className="text-lg text-slate-400">
            Start your journey with us today
          </p>
        </motion.div>

        {/* Registration Card */}
        <motion.div
          variants={cardVariants}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/30 border-2 ${errors.firstName ? 'border-red-500/50' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/50 transition-all duration-300`}
                    placeholder="John"
                    disabled={isLoading || success}
                  />
                </div>
                {errors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.firstName}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-800/30 border-2 ${errors.lastName ? 'border-red-500/50' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/50 transition-all duration-300`}
                    placeholder="Doe"
                    disabled={isLoading || success}
                  />
                </div>
                {errors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.lastName}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-800/30 border-2 ${errors.email ? 'border-red-500/50' : 'border-slate-700'
                    } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/50 transition-all duration-300`}
                  placeholder="you@example.com"
                  disabled={isLoading || success}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-800/30 border-2 ${errors.password ? 'border-red-500/50' : 'border-slate-700'
                    } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/50 transition-all duration-300`}
                  placeholder="Create a strong password"
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={isLoading || success}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </motion.p>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Password strength:</span>
                    <span className={`font-medium ${passwordStrength() < 40 ? 'text-red-400' :
                      passwordStrength() < 70 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getStrengthColor()} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength()}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-slate-700'
                        }`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-slate-700'
                        }`} />
                      <span>Uppercase and lowercase letters</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${/\d/.test(formData.password) ? 'bg-green-500' : 'bg-slate-700'
                        }`} />
                      <span>At least one number</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Shield className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-12 py-3 bg-slate-800/30 border-2 ${errors.confirmPassword ? 'border-red-500/50' : 'border-slate-700'
                    } rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/50 transition-all duration-300`}
                  placeholder="Re-enter your password"
                  disabled={isLoading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={isLoading || success}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </motion.p>
              )}
              {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-green-400 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Passwords match
                </motion.p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                  className={`mt-0.5 w-5 h-5 rounded border-2 ${errors.terms ? 'border-red-500/50' : 'border-slate-700'
                    } bg-slate-800/30 text-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:ring-offset-0 transition-all`}
                  disabled={isLoading || success}
                />
                <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.terms}
                </motion.p>
              )}
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  </motion.div>
                  <p className="text-sm text-green-300">Account created successfully! Redirecting...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="idle"
              whileHover={!isLoading && !success ? "hover" : "idle"}
              whileTap={!isLoading && !success ? "tap" : "idle"}
              disabled={isLoading || success}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Creating Account...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;