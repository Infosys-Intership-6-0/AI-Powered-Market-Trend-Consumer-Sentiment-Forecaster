import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, TrendingUp, LogIn, Menu, X, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import ThemeToggler from './ThemeToggler';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const isLanding = location.pathname === '/';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const dashboardLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Comparison', path: '/compare', icon: TrendingUp },
        { name: 'AI Chatbot', path: '/chat', icon: MessageSquare },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const landingLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Why Us', href: '#why-better' },
        { name: 'Contact Us', href: '#contact' },
    ];

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleScroll = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

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
                        {!isLanding ? (
                            <>
                                {dashboardLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={clsx(
                                            "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                            location.pathname === link.path
                                                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 shadow-sm"
                                                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                                        )}
                                    >
                                        <link.icon className={clsx("w-4 h-4", location.pathname === link.path && "text-brand-600 dark:text-brand-400")} />
                                        {link.name}
                                    </Link>
                                ))}
                                {user ? (
                                    <div className="flex items-center gap-3 ml-2 pl-2 border-l border-slate-200 dark:border-zinc-700 relative">
                                        <button
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            className="focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full transition-transform hover:scale-105"
                                        >
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold border border-slate-200 dark:border-zinc-700">
                                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </button>

                                        {/* Profile Dropdown */}
                                        {isProfileDropdownOpen && (
                                            <div className="absolute top-12 right-0 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 py-2 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                                                <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                        {user.displayName || 'User'}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="px-2 py-2">
                                                    <button
                                                        onClick={() => { handleLogout(); setIsProfileDropdownOpen(false); }}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors w-full text-left"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login/Signup
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                {landingLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleScroll(e, link.href)}
                                        className="px-3 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all duration-200"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                <div className="flex items-center gap-4 ml-2">
                                    {user ? (
                                        <div className="flex items-center gap-3 relative">
                                            <Link
                                                to="/dashboard"
                                                className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors shadow-sm"
                                            >
                                                Go to Dashboard
                                            </Link>
                                            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-zinc-700 pl-4 relative">
                                                <button
                                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                    className="focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full transition-transform hover:scale-105"
                                                >
                                                    {user.photoURL ? (
                                                        <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold border border-slate-200 dark:border-zinc-700">
                                                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </button>

                                                {/* Profile Dropdown for Landing Page */}
                                                {isProfileDropdownOpen && (
                                                    <div className="absolute top-12 right-0 w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 py-2 z-50 overflow-hidden">
                                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                {user.displayName || 'User'}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        <div className="px-2 pt-2">
                                                            <button
                                                                onClick={() => { handleLogout(); setIsProfileDropdownOpen(false); }}
                                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors w-full text-left"
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                                Logout
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/login?mode=signup"
                                                className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors shadow-sm"
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="pl-2 flex items-center">
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
                        {!isLanding ? (
                            <>
                                {dashboardLinks.map((link) => (
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
                                {user ? (
                                    <div className="px-4 py-4 mt-2 border-t border-slate-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-3 mb-4">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold border border-slate-200 dark:border-zinc-700 text-lg">
                                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {user.displayName || 'User'}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[200px]">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Login/Signup
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                {landingLinks.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleScroll(e, link.href)}
                                        className="block px-4 py-3 rounded-xl text-base font-medium text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                                {user ? (
                                    <div className="px-4 py-4 mt-2 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                                        <div className="flex items-center gap-3">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-700 object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold border border-slate-200 dark:border-zinc-700 text-lg">
                                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {user.displayName || 'User'}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-[200px]">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex justify-center py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                                className="flex justify-center py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 px-4 py-4 mt-2 border-t border-slate-100 dark:border-zinc-800">
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex justify-center py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            to="/login?mode=signup"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex justify-center py-2.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
