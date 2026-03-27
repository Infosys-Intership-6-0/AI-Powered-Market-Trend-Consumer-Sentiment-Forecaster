import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const isAuthPage = pathname === '/login';
    const isLandingPage = pathname === '/';
    const isFullWidthPage = isAuthPage || isLandingPage;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
            {!isAuthPage && <Navbar />}

            <main className={!isFullWidthPage ? "pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in pb-12" : "animate-fade-in"}>
                {children}
            </main>

            <Toaster position="top-right" theme="system" className="font-sans" />
        </div>
    );
};

export default Layout;
