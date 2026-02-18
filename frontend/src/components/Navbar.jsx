import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, TrendingUp, LogIn, Menu, X, HomeIcon, Settings } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import ThemeToggler from './ThemeToggler';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Comparison', path: '/compare', icon: TrendingUp },
        { name: 'AI Chatbot', path: '/chat', icon: MessageSquare },
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Login/Signup', path: '/login', icon: LogIn },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border z-50 transition-colors duration-300 shadow-sm dark:shadow-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-500 hover:opacity-80 transition-opacity">
                        <div className="p-1.5 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="tracking-tight bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-200 bg-clip-text text-transparent">
                            TrendForecast.ai
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    location.pathname === link.path
                                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 shadow-sm"
                                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                <link.icon className={clsx("w-4 h-4", location.pathname === link.path && "text-brand-600 dark:text-brand-400")} />
                                {link.name}
                            </Link>
                        ))}
                        <div className="pl-4 ml-2 border-l border-slate-200 dark:border-dark-border">
                            <ThemeToggler />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggler />
                        <button onClick={toggleMenu} className="p-2 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                    location.pathname === link.path
                                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
                                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
