import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            toast.success(isSignUp ? "Account created successfully!" : "Logged in successfully!");
            navigate('/dashboard');
        }, 1500);
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
    };

    const transition = { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-sans overflow-hidden p-4 relative">
            <div className="flex-1 relative w-full max-w-[1920px] mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-900 min-h-[600px]">

                {/* SIGN IN FORM (Left Side) */}
                <motion.div
                    initial={false}
                    animate={{
                        x: isSignUp ? "-100%" : "0%",
                        opacity: isSignUp ? 0 : 1
                    }}
                    transition={transition}
                    className="absolute top-0 left-0 w-full lg:w-1/2 h-full flex items-center justify-center p-8 lg:p-12 z-10 bg-black"
                >
                    <div className="w-full max-w-md space-y-7">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-zinc-400 text-sm">Enter your email and password to access your account.</p>
                        </div>

                        <div>
                            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-full border border-zinc-700 hover:border-zinc-600 bg-transparent hover:bg-zinc-900/50 transition-all text-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
                            <div className="relative flex justify-center text-xs"><span className="bg-black px-3 text-zinc-500">Or</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="eg. john.doe@example.com"
                                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        placeholder="Enter your password"
                                        className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all pr-12 text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Sign In"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-zinc-500">
                            Don't have an account?
                            <button onClick={toggleMode} className="text-white font-semibold hover:underline ml-1 focus:outline-none">Sign up</button>
                        </p>
                    </div>
                </motion.div>

                {/* SIGN UP FORM (Right Side) */}
                <motion.div
                    initial={false}
                    animate={{
                        x: isSignUp ? "0%" : "100%",
                        opacity: isSignUp ? 1 : 0
                    }}
                    transition={transition}
                    className="absolute top-0 right-0 w-full lg:w-1/2 h-full flex items-center justify-center p-8 lg:p-12 z-10 bg-black"
                >
                    <div className="w-full max-w-md space-y-7">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-zinc-400 text-sm">Enter your personal data to create your account.</p>
                        </div>

                        <div>
                            <button className="w-full flex items-center justify-center gap-2 p-3 rounded-full border border-zinc-700 hover:border-zinc-600 bg-transparent hover:bg-zinc-900/50 transition-all text-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
                            <div className="relative flex justify-center text-xs"><span className="bg-black px-3 text-zinc-500">Or</span></div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-white">First Name</label>
                                    <input type="text" name="firstName" required placeholder="eg. John" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm" value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-white">Last Name</label>
                                    <input type="text" name="lastName" required placeholder="eg. Francisco" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white">Email</label>
                                <input type="email" name="email" required placeholder="eg. johnfrans@gmail.com" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-white">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} required name="password" placeholder="Enter your password" className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all pr-12 text-sm" value={formData.password} onChange={handleChange} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">Must be at least 8 characters.</p>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3.5 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                                {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Sign Up"}
                            </button>
                        </form>
                        <p className="text-center text-sm text-zinc-500">
                            Already have an account?
                            <button onClick={toggleMode} className="text-white font-semibold hover:underline ml-1 focus:outline-none">Log in</button>
                        </p>
                    </div>
                </motion.div>

                {/* GRADIENT PANEL - Slides between Left and Right */}
                <motion.div
                    initial={false}
                    animate={{
                        x: isSignUp ? "0%" : "100%"
                    }}
                    transition={transition}
                    className="absolute top-0 left-0 hidden lg:flex flex-col justify-end w-1/2 h-full p-12 overflow-hidden z-20 pointer-events-none"
                    style={{ pointerEvents: 'none' }}
                >
                    {/* Background Layer */}
                    <div className="absolute inset-0 z-0 bg-black">
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                background: 'radial-gradient(circle at 50% 100%, #000000 20%, #4c1d95 60%, #ffffff 100%)',
                                filter: 'blur(0px)'
                            }}
                        />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 text-center p-4">
                        <div className="max-w-md mx-auto flex justify-center items-center">
                            <motion.div
                                key={isSignUp ? "signup-text" : "signin-text"}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h1 className="text-4xl font-bold mb-4 leading-tight">
                                    {isSignUp ? "Get Started with Us" : "Welcome Back!"}
                                </h1>
                                <p className="text-base text-white/50 mb-0">
                                    {isSignUp ? "Complete these easy steps to register your account." : "We are glad to see you again! Access your dashboard now."}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;   